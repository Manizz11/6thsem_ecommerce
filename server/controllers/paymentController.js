import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import database from "../database/db.js";
import { generateEsewaSignature } from "../utils/generateEsewaSignature.js";
import { v4 as uuidv4 } from "uuid";

/* ================= INITIATE PAYMENT ================= */
export const initiatePayment = catchAsyncErrors(async (req, res, next) => {
  const { amount, productName, transactionId, method, orderId } = req.body;

  if (!amount || !productName || !transactionId || !method) {
    return next(new ErrorHandler("Missing required fields", 400));
  }

  switch (method) {
    case "esewa": {
      const transactionUuid = `${Date.now()}-${uuidv4()}`;
      const esewaConfig = {
        amount: amount,
        tax_amount: "0",
        total_amount: amount,
        transaction_uuid: transactionUuid,
        product_code: process.env.ESEWA_MERCHANT_CODE || "EPAYTEST",
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: `${process.env.FRONTEND_URL}/payment-success?method=esewa&order_id=${orderId}`,
        failure_url: `${process.env.FRONTEND_URL}/payment-failed`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
      };

      const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
      const signature = generateEsewaSignature(
        process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q",
        signatureString
      );

      // Store payment record
      await database.execute(
        "INSERT INTO payments (order_id, payment_type, payment_status, transaction_uuid) VALUES (?, ?, ?, ?)",
        [orderId, "eSewa", "Pending", transactionUuid]
      );

      res.status(200).json({
        success: true,
        esewaConfig: {
          ...esewaConfig,
          signature,
          product_service_charge: Number(esewaConfig.product_service_charge),
          product_delivery_charge: Number(esewaConfig.product_delivery_charge),
          tax_amount: Number(esewaConfig.tax_amount),
          total_amount: Number(esewaConfig.total_amount),
        },
      });
      break;
    }

    case "khalti": {
      const khaltiConfig = {
        return_url: `${process.env.FRONTEND_URL}/payment-success?method=khalti&order_id=${orderId}`,
        website_url: process.env.FRONTEND_URL,
        amount: Math.round(parseFloat(amount) * 100),
        purchase_order_id: transactionId,
        purchase_order_name: productName,
        customer_info: {
          name: req.user?.name || "Customer",
          email: req.user?.email || "customer@example.com",
          phone: req.user?.phone || "9800000000",
        },
      };

      const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(khaltiConfig),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return next(new ErrorHandler(`Khalti payment failed: ${JSON.stringify(errorData)}`, 400));
      }

      const khaltiResponse = await response.json();

      // Store payment record
      await database.execute(
        "INSERT INTO payments (order_id, payment_type, payment_status, payment_intent_id) VALUES (?, ?, ?, ?)",
        [orderId, "Khalti", "Pending", khaltiResponse.pidx]
      );

      res.status(200).json({
        success: true,
        khaltiPaymentUrl: khaltiResponse.payment_url,
        pidx: khaltiResponse.pidx,
      });
      break;
    }

    default:
      return next(new ErrorHandler("Invalid payment method", 400));
  }
});

/* ================= VERIFY ESEWA PAYMENT ================= */
export const verifyEsewaPayment = catchAsyncErrors(async (req, res, next) => {
  const { oid, amt, refId } = req.body;

  if (!oid || !amt || !refId) {
    return next(new ErrorHandler("Missing payment verification data", 400));
  }

  try {
    // Verify with eSewa
    const verificationUrl = `https://uat.esewa.com.np/epay/transrec`;
    const verificationData = new URLSearchParams({
      amt: amt,
      scd: process.env.ESEWA_MERCHANT_CODE || "EPAYTEST",
      rid: refId,
      pid: oid,
    });

    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: verificationData,
    });

    const result = await response.text();

    if (result.includes("Success")) {
      // Update payment status
      await database.execute(
        "UPDATE payments SET payment_status = ? WHERE order_id = ?",
        ["Completed", oid]
      );

      // Update order as paid
      await database.execute(
        "UPDATE orders SET paid_at = NOW() WHERE id = ?",
        [oid]
      );

      res.status(200).json({
        success: true,
        message: "eSewa payment verified successfully",
      });
    } else {
      return next(new ErrorHandler("eSewa payment verification failed", 400));
    }
  } catch (error) {
    return next(new ErrorHandler("Payment verification error", 500));
  }
});

/* ================= VERIFY KHALTI PAYMENT ================= */
export const verifyKhaltiPayment = catchAsyncErrors(async (req, res, next) => {
  const { pidx, orderId } = req.body;

  if (!pidx || !orderId) {
    return next(new ErrorHandler("Missing payment verification data", 400));
  }

  try {
    const response = await fetch("https://a.khalti.com/api/v2/epayment/lookup/", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });

    const result = await response.json();

    if (result.status === "Completed") {
      // Update payment status
      await database.execute(
        "UPDATE payments SET payment_status = ? WHERE order_id = ?",
        ["Completed", orderId]
      );

      // Update order as paid
      await database.execute(
        "UPDATE orders SET paid_at = NOW() WHERE id = ?",
        [orderId]
      );

      res.status(200).json({
        success: true,
        message: "Khalti payment verified successfully",
      });
    } else {
      return next(new ErrorHandler("Khalti payment verification failed", 400));
    }
  } catch (error) {
    return next(new ErrorHandler("Payment verification error", 500));
  }
});