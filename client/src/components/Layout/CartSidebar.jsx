import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../../store/slices/cartSlice";
import { toggleCart } from "../../store/slices/popupSlice";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { isCartOpen } = useSelector((state) => state.popup);
  const { cart } = useSelector((state) => state.cart);

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const total =
    cart?.reduce((sum, item) => sum + (Number(item?.product?.price) || 0) * (item?.quantity || 0), 0) ??
    0;

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => dispatch(toggleCart())}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 z-50 glass-panel animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-[hsla(var(--glass-border))]">
          <h2 className="text-xl font-semibold text-primary">Shopping Cart</h2>
          <button
            aria-label="Close Cart"
            onClick={() => dispatch(toggleCart())}
            className="p-2 rounded-lg glass-card hover:glow-on-hover animate-smooth"
          >
            <X className="w-6 h-6 text-primary" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {cart?.length === 0 ? (
            <div className="text-center text-gray-500">
              <p className="text-muted-foreground">Your cart is empty.</p>

              <Link
                to="/products"
                onClick={() => dispatch(toggleCart())}
                className="inline-block mt-4 px-6 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="glass-card p-4 flex items-start space-x-4"
                  >
                    {/* Product Image */}
                    <img
                      src={item?.product?.images?.[0] || 'https://via.placeholder.com/64x64?text=No+Image'}
                      alt={item?.product?.name || 'Product'}
                      className="w-16 h-16 object-cover rounded-lg"
                    />

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-primary font-semibold">
                        ₹{item?.product?.price ? Number(item.product.price).toFixed(2) : '0.00'}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          aria-label="Decrease Quantity"
                          className="p-1 rounded glass-card hover:glow-on-hover animate-smooth"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="w-5 h-5 " />
                        </button>

                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          aria-label="Increase Quantity"
                          className="p-1 rounded glass-card hover:glow-on-hover animate-smooth"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="w-5 h-5 " />
                        </button>

                        {/* Remove Button */}
                        <button
                          aria-label="Remove Item"
                          className="p-1 rounded glass-card hover:glow-on-hover animate-smooth ml-2 text-destructive"
                          onClick={() =>
                            dispatch(removeFromCart(item.product.id))
                          }
                        >
                          <Trash2 className="w-5 h-5 " />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4 border-[hsla(var(--glass-border))]">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-xl font-bold text-primary">
                    ₹{Number(total).toFixed(2)}
                  </span>
                </div>

                <Link
                  to="/cart"
                  onClick={() => dispatch(toggleCart())}
                  className="w-full py-3 block text-center mt-4 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold"
                >
                  View Cart & Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
