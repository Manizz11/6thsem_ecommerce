import { useState } from "react";
import { toast } from "react-toastify";

const IMEPayment = ({ amount, orderData, onSuccess }) => {
  const [processing, setProcessing] = useState(false);

  const handleIMEPayment = async () => {
    setProcessing(true);
    
    try {
      // IME Pay integration
      const imePayForm = document.createElement("form");
      imePayForm.method = "POST";
      imePayForm.action = "https://payment.imepay.com.np:7979/WebCheckout/Checkout";
      
      const fields = {
        MerchantCode: import.meta.env.VITE_IME_MERCHANT_CODE || "TESTMERCHANT",
        Amount: amount.toFixed(2),
        RefId: `ORDER_${Date.now()}`,
        Method: "POST",
        CheckSum: generateIMEChecksum(amount),
        RespUrl: `${window.location.origin}/payment-success`,
        CancelUrl: `${window.location.origin}/payment-failed`,
        Module: "WEB"
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        imePayForm.appendChild(input);
      });

      document.body.appendChild(imePayForm);
      imePayForm.submit();
      
    } catch (error) {
      console.error("IME Pay error:", error);
      toast.error("Failed to initialize IME Pay");
      setProcessing(false);
    }
  };

  const generateIMEChecksum = (amount) => {
    // Simple checksum generation - in production, use proper encryption
    const merchantCode = import.meta.env.VITE_IME_MERCHANT_CODE || "TESTMERCHANT";
    const refId = `ORDER_${Date.now()}`;
    return btoa(`${merchantCode}${amount}${refId}`);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">IME</span>
          </div>
          <span className="font-medium text-red-800">IME Pay</span>
        </div>
        <p className="text-sm text-red-600">
          Pay using IME Pay - Bank transfer and mobile banking solution.
        </p>
      </div>
      
      <button
        onClick={handleIMEPayment}
        disabled={processing}
        className="w-full py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition disabled:opacity-50"
      >
        {processing ? "Redirecting..." : `Pay Rs. ${amount.toFixed(2)} with IME Pay`}
      </button>
    </div>
  );
};

export default IMEPayment;