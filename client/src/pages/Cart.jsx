import { Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const total =
    cart?.reduce(
      (sum, item) => sum + (Number(item?.product?.price) || 0) * (item?.quantity || 0),
      0
    ) || 0;

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {cart?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link to="/products" className="text-blue-500 hover:underline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center space-x-4 p-4 border rounded-lg"
              >
                <img
                  src={
                    item?.product?.images?.[0]?.url ||
                    item?.product?.images?.[0] ||
                    "https://via.placeholder.com/80x80?text=No+Image"
                  }
                  alt={item?.product?.name || "Product"}
                  className="w-20 h-20 object-cover rounded"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-gray-600">
                    ₹
                    {item?.product?.price
                      ? Number(item.product.price).toFixed(2)
                      : "0.00"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.product.id, item.quantity - 1)
                    }
                    className="p-1 border rounded hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="p-1 border rounded hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item.product.id))}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="text-right">
            <p className="text-xl font-bold mb-4">
              Total: ₹{Number(total).toFixed(2)}
            </p>
            <Link
              to="/payment"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 inline-flex items-center space-x-2"
            >
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
