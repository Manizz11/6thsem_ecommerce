import { useState, useEffect } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";

const Payment = () => {
  const { authUser } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!authUser) {
    navigate("/");
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to continue</h2>
          <p className="text-muted-foreground mb-4">You need to be logged in to access the payment page</p>
          <Link to="/" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [processing, setProcessing] = useState(false);

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "Kathmandu",
    zipCode: "",
    country: "Nepal",
  });

  const subtotal = cart.reduce(
    (acc, item) => acc + (item?.product?.price || 0) * (item?.quantity || 0),
    0
  );
  const tax = subtotal * 0.13;
  const shippingFee = subtotal > 50 ? 2 : 0;
  const total = subtotal + tax + shippingFee;

  /* ===========================
     ESEWA PAYMENT
  =========================== */
  const handleEsewaPayment = async () => {
    try {
      setProcessing(true);
      
      // Validate shipping details
      if (!shippingDetails.fullName || !shippingDetails.phoneNumber || !shippingDetails.address) {
        alert('Please fill in all shipping details');
        setProcessing(false);
        return;
      }

      // Save shipping details to localStorage for later use
      localStorage.setItem('shippingDetails', JSON.stringify(shippingDetails));
      
      // Call payment API
      const response = await fetch('http://localhost:4000/api/v1/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          method: 'esewa',
          amount: total.toFixed(2),
          productName: 'E-commerce Order',
          transactionId: `TXN_${Date.now()}`,
          orderId: `ORDER_${Date.now()}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment initiation failed');
      }

      const paymentData = await response.json();
      
      if (!paymentData.success) {
        throw new Error(paymentData.message || 'Payment initiation failed');
      }
      
      // Create and submit eSewa form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

      const esewaPayload = {
        amount: paymentData.esewaConfig.total_amount,
        tax_amount: paymentData.esewaConfig.tax_amount,
        total_amount: paymentData.esewaConfig.total_amount,
        transaction_uuid: paymentData.esewaConfig.transaction_uuid,
        product_code: paymentData.esewaConfig.product_code,
        product_service_charge: paymentData.esewaConfig.product_service_charge,
        product_delivery_charge: paymentData.esewaConfig.product_delivery_charge,
        success_url: paymentData.esewaConfig.success_url,
        failure_url: paymentData.esewaConfig.failure_url,
        signed_field_names: paymentData.esewaConfig.signed_field_names,
        signature: paymentData.esewaConfig.signature,
      };

      Object.entries(esewaPayload).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      
    } catch (error) {
      console.error('eSewa payment error:', error);
      alert('Failed to initiate eSewa payment. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <Link to="/cart" className="flex items-center text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">
                Shipping Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(shippingDetails).map((field) => (
                  <input
                    key={field}
                    value={shippingDetails[field]}
                    onChange={(e) =>
                      setShippingDetails({
                        ...shippingDetails,
                        [field]: e.target.value,
                      })
                    }
                    placeholder={field.replace(/([A-Z])/g, " $1")}
                    className="glass-input px-4 py-3 rounded-md"
                  />
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">
                Payment Method
              </h2>

              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setPaymentMethod("esewa")}
                  className={`px-4 py-2 rounded-md ${
                    paymentMethod === "esewa"
                      ? "bg-green-600 text-white"
                      : "glass-button"
                  }`}
                >
                  eSewa
                </button>

                <button
                  onClick={() => setPaymentMethod("khalti")}
                  className={`px-4 py-2 rounded-md ${
                    paymentMethod === "khalti"
                      ? "bg-purple-600 text-white"
                      : "glass-button"
                  }`}
                >
                  Khalti
                </button>
              </div>

              {paymentMethod === "esewa" && (
                <button
                  onClick={handleEsewaPayment}
                  disabled={processing}
                  className="w-full py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {processing ? 'Processing...' : `Pay ₹${total.toFixed(2)} with eSewa`}
                </button>
              )}

              {paymentMethod === "khalti" && (
                <button
                  onClick={() => alert('Khalti payment integration coming soon!')}
                  className="w-full py-3 bg-purple-600 text-white rounded-md font-semibold"
                >
                  Pay with Khalti
                </button>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="glass-card p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">
              Order Summary
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shippingFee.toFixed(2)}</span>
              </div>

              <hr />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center text-green-500 text-sm">
              <Check className="w-4 h-4 mr-2" />
              Secure payment guaranteed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
