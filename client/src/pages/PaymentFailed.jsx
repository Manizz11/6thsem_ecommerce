import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentFailed = () => {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Failed!</h1>
        <p className="text-muted-foreground mb-6">
          Your payment could not be processed. Please try again or contact support.
        </p>
        <div className="space-y-3">
          <Link 
            to="/payment" 
            className="block w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
          >
            Try Again
          </Link>
          <Link 
            to="/cart" 
            className="block w-full py-2 px-4 border border-border rounded-md hover:bg-secondary transition"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;