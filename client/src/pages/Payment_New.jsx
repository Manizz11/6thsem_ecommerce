import { useState, useEffect } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";
import { initiatePayment, setPaymentMethod } from "../store/slices/paymentSlice";

const Payment = () => {
  const { authUser } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { paymentMethod: selectedPaymentMethod, loading: paymentLoading, esewaConfig, khaltiPaymentUrl } = useSelector((state) => state.payment);

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
  const shippingFee = subtotal > 50 ? 0 : 2;
  const total = subtotal + tax + shippingFee;

  const handlePaymentMethodSelect = (method) => {
    dispatch(setPaymentMethod(method));
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);

      // Place order first
      const orderResponse = await dispatch(
        placeOrder({
          full_name: shippingDetails.fullName,
          state: shippingDetails.state,
          city: shippingDetails.city,
          country: shippingDetails.country,
          address: shippingDetails.address,
          pincode: shippingDetails.zipCode,
          phone: shippingDetails.phoneNumber,
          orderedItems: cart,
        })
      ).unwrap();

      // Initiate payment
      const paymentResponse = await dispatch(
        initiatePayment({
          amount: total.toString(),
          productName: "E-commerce Purchase",
          transactionId: `ORDER_${Date.now()}`,
          method: selectedPaymentMethod,
          orderId: orderResponse.orderId || Date.now(),
        })
      ).unwrap();

      if (selectedPaymentMethod === "esewa" && paymentResponse.esewaConfig) {
        // Create eSewa form and submit
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        Object.entries(paymentResponse.esewaConfig).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else if (selectedPaymentMethod === "khalti" && paymentResponse.khaltiPaymentUrl) {
        // Redirect to Khalti
        window.location.href = paymentResponse.khaltiPaymentUrl;
      }

      dispatch(clearCart());
    } catch (error) {
      console.error(error);
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
              <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
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

            {/* Payment Methods */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handlePaymentMethodSelect("esewa")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedPaymentMethod === "esewa"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-green-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">E</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">eSewa</div>
                      <div className="text-sm text-gray-500">Digital wallet payment</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handlePaymentMethodSelect("khalti")}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedPaymentMethod === "khalti"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-300 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">K</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Khalti</div>
                      <div className="text-sm text-gray-500">Mobile payment solution</div>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing || paymentLoading}
                className={`w-full py-3 text-white rounded-md font-semibold transition disabled:opacity-50 ${
                  selectedPaymentMethod === "esewa"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {processing || paymentLoading
                  ? "Processing..."
                  : `Pay ₹${total.toFixed(2)} with ${selectedPaymentMethod === "esewa" ? "eSewa" : "Khalti"}`}
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="glass-card p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

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
                <span className="text-primary">₹{total.toFixed(2)}</span>
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