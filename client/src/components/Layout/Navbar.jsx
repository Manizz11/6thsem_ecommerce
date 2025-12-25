import { Menu, User, ShoppingCart, Sun, Moon, Search, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { toggleAuthPopup, toggleCart, toggleSearchBar, toggleSidebar, toggleProfilePopup } from "../../store/slices/popupSlice";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart); 
  const cartItemsCount = cart?.reduce((total, item) => total + (item?.quantity || 0), 0) || 0;

  const handleAdminLogin = () => {
    window.open('http://localhost:5174/login', '_blank');
  };

  return <>
    <nav className="fixed left-0 w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border ">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Left Section */}
          <button onClick={() => dispatch(toggleSidebar())} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Menu className="w-6 h-6 text-foreground" />
          </button>

          {/* Center Section */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-primary">ShopMate</h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">

            {/* THEME TOGGLE */}
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              {theme === "dark"
                ? <Sun className="w-6 h-6 text-foreground" />
                : <Moon className="w-6 h-6 text-foreground" />}
            </button>

            {/* Search Overlay */}
            <button onClick={() => dispatch(toggleSearchBar())} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Search className="w-6 h-6 text-foreground" />
            </button>

            {/* User Profile */}
            <button 
              onClick={() => dispatch(authUser ? toggleProfilePopup() : toggleAuthPopup())} 
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <User className="w-6 h-6 text-foreground" />
            </button>

            {/* Admin Login - Only show for non-authenticated users */}
            {!authUser && (
              <button 
                onClick={handleAdminLogin}
                className="p-2 rounded-lg hover:bg-secondary transition-colors" 
                title="Admin Login"
              >
                <Shield className="w-6 h-6 text-blue-600" />
              </button>
            )}

            {/* Shopping Cart */}
            <button onClick={() => dispatch(toggleCart())} className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <ShoppingCart className="w-6 h-6 text-foreground" />

              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </nav>
  </>;
};

export default Navbar;
