import { useState } from "react";
import { toast } from "react-toastify";

const KhaltiPayment = ({ amount, onSuccess, onError }) => {
  const [processing, setProcessing] = useState(false);

  const handleKhaltiPayment = async () => {
    setProcessing(true);
    
    try {
      // Khalti configuration
      const config = {
        publicKey: import.meta.env.VITE_KHALTI_PUBLIC_KEY || "test_public_key_dc74e0fd57cb46cd93832aee0a390234",
        productIdentity: `product_${Date.now()}`,
        productName: "E-commerce Purchase",
        productUrl: window.location.origin,
        paymentPreference: [
          "KHALTI",
          "EBANKING",
          "MOBILE_BANKING",
          "CONNECT_IPS",
          "SCT",
        ],
        eventHandler: {
          onSuccess(payload) {
            console.log("Khalti Payment Success:", payload);
            toast.success("Payment successful!");
            onSuccess(payload);
          },
          onError(error) {
            console.error("Khalti Payment Error:", error);
            toast.error("Payment failed!");
            onError(error);
          },
          onClose() {
            console.log("Khalti widget closed");
            setProcessing(false);
          }
        }
      };

      // Initialize Khalti checkout
      const checkout = new window.KhaltiCheckout(config);
      checkout.show({ amount: amount * 100 }); // Khalti expects amount in paisa
      
    } catch (error) {
      console.error("Khalti initialization error:", error);
      toast.error("Failed to initialize Khalti payment");
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="font-medium text-purple-800">Khalti Payment</span>
        </div>
        <p className="text-sm text-purple-600">
          Pay securely using Khalti digital wallet, mobile banking, or internet banking.
        </p>
      </div>
      
      <button
        onClick={handleKhaltiPayment}
        disabled={processing}
        className="w-full py-3 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition disabled:opacity-50"
      >
        {processing ? "Processing..." : `Pay Rs. ${amount.toFixed(2)} with Khalti`}
      </button>
    </div>
  );
};

export default KhaltiPayment;