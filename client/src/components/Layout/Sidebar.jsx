import {
  X,
  Home,
  Package,
  Info,
  HelpCircle,
  ShoppingCart,
  List,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/slices/popupSlice";

const Sidebar = () => {
  const { authUser } = useSelector((state) => state.auth);
  const { isSidebarOpen } = useSelector((state) => state.popup);
  const dispatch = useDispatch();

  const menuItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Products", icon: Package, path: "/products" },
    { name: "About", icon: Info, path: "/about" },
    { name: "FAQ", icon: HelpCircle, path: "/faq" },
    { name: "Contact", icon: Phone, path: "/contact" },
    { name: "Cart", icon: ShoppingCart, path: "/cart" },
    authUser && { name: "My Orders", icon: List, path: "/orders" },
  ];

  if (!isSidebarOpen) return null;

  return (
    <>
      {/* Sidebar Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => dispatch(toggleSidebar())}
      />

      {/* Sidebar Content */}
      <div className="fixed top-0 left-0 w-80 h-full z-50 glass-panel animate-slide-in-left">
        <div className="flex items-center justify-between p-6 border-b border-[hsla(var(--glass-border))]">
          <h2 className="text-2xl font-bold">Menu</h2>

          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg glass-card hover:glow-on-hover animate-smooth"
          >
            <X className="w-6 h-6 text-primary" />
          </button>
        </div>

        <nav className="p-6">
          <ul className="space-y-2">
            {menuItems
              .filter(Boolean)
              .map((item) => (
                <li key={item.name} className="mb-4">
                  <Link
                    to={item.path}
                    onClick={() => dispatch(toggleSidebar())}
                    className="flex items-center space-x-3 p-3 rounded-lg glass-card hover:glow-on-hover animate-smooth text-foreground hover:text-primary group"
                  >
                    <item.icon className="w-5 h-5 group-hover:text-primary" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
