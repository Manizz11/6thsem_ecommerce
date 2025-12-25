import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CheckCircle } from 'lucide-react';
import { placeOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    // Get cart and shipping details from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const shippingDetails = JSON.parse(localStorage.getItem('shippingDetails') || '{}');
    
    // Place order after successful payment
    if (cart.length > 0 && shippingDetails.fullName) {
      dispatch(placeOrder({
        full_name: shippingDetails.fullName,
        state: shippingDetails.state,
        city: shippingDetails.city,
        country: shippingDetails.country,
        address: shippingDetails.address,
        pincode: shippingDetails.zipCode,
        phone: shippingDetails.phoneNumber,
        orderedItems: cart,
      }));
    }
    
    // Clear cart and shipping details
    dispatch(clearCart());
    localStorage.removeItem('cart');
    localStorage.removeItem('shippingDetails');
  }, [dispatch]);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
          Your payment has been processed successfully. Thank you for your order!
        </p>
        <div className="space-y-3">
          <Link 
            to="/orders" 
            className="block w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
          >
            View Orders
          </Link>
          <Link 
            to="/" 
            className="block w-full py-2 px-4 border border-border rounded-md hover:bg-secondary transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;