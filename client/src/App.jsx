import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Loader } from "lucide-react";

// Layout Components
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import SearchOverlay from "./components/Layout/SearchOverlay";
import CartSidebar from "./components/Layout/CartSidebar";
import ProfilePanel from "./components/Layout/ProfilePanel";
import LoginModal from "./components/Layout/LoginModal";
import Footer from "./components/Layout/Footer";

// Pages
import Index from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Redux
import { getUser } from "./store/slices/authSlice";
import { fetchProducts } from "./store/slices/productSlice";

const App = () => {
  const dispatch = useDispatch();

  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const { products, loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        category: "",
        price: "0-10000",
        search: "",
        ratings: "",
        availability: "",
        page: 1,
      })
    );
  }, [dispatch]);

  if (isCheckingAuth || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Sidebar />
          <SearchOverlay />
          <CartSidebar />
          <ProfilePanel />
          <LoginModal />

          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
