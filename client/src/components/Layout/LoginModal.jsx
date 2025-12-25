import { useState, useEffect } from "react";
import { X, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { login, register, forgotPassword, resetPassword } from "../../store/slices/authSlice";
import { toggleAuthPopup } from "../../store/slices/popupSlice";

const LoginModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { authUser, isSigningUp, isLoggingIn, isRequestingForToken } =
    useSelector((state) => state.auth);

  const { isAuthPopupOpen } = useSelector((state) => state.popup);

  const [mode, setMode] = useState("signin");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Detect reset password mode (FIXED so close button works)
  useEffect(() => {
    if (
      location.pathname.startsWith("/password/reset") &&
      !isAuthPopupOpen
    ) {
      setMode("reset");
      dispatch(toggleAuthPopup());
    }
  }, [location.pathname, isAuthPopupOpen, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "forgot") {
      dispatch(forgotPassword({ email: formData.email })).then(() => {
        dispatch(toggleAuthPopup());
        setMode("signin");
      });
      return;
    }

    if (mode === "reset") {
      const token = location.pathname.split("/").pop();
      dispatch(
        resetPassword({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })
      );
      return;
    }

    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);

    if (mode === "signup") {
      data.append("name", formData.name);
      dispatch(register(data));
    } else {
      dispatch(login(data));
    }
  };

  // Close modal on auth success
  useEffect(() => {
    if (authUser && isAuthPopupOpen) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      dispatch(toggleAuthPopup());
    }
  }, [authUser, isAuthPopupOpen, dispatch]);

  const isLoading = isSigningUp || isLoggingIn || isRequestingForToken;

  if (!isAuthPopupOpen || authUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-[hsla(var(--glass-bg))]" />

      {/* Modal */}
      <div className="relative z-10 glass-panel w-full max-w-md mx-4 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">
            {mode === "reset"
              ? "Reset Password"
              : mode === "signup"
              ? "Create Account"
              : mode === "forgot"
              ? "Forgot Password"
              : "Welcome Back"}
          </h2>
        </div>

        {/* Close Button */}
        <button
          type="button"
          className="absolute top-3 right-3 cursor-pointer"
          onClick={() => dispatch(toggleAuthPopup())}
        >
          <X className="w-5 h-5 text-primary" />
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded"
                required
              />
            </div>
          )}

          {mode !== "reset" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded"
                required
              />
            </div>
          )}

          {mode !== "forgot" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded"
                required
              />
            </div>
          )}

          {mode === "reset" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded"
                required
              />
            </div>
          )}

          {mode === "signin" && (
            <div className="text-right text-sm">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-primary hover:text-accent"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 gradient-primary text-primary-foreground font-semibold rounded ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {isLoading
              ? mode === "reset"
                ? "Resetting password..."
                : mode === "signup"
                ? "Signing up..."
                : mode === "forgot"
                ? "Requesting email..."
                : "Signing in..."
              : mode === "reset"
              ? "Reset Password"
              : mode === "signup"
              ? "Create Account"
              : mode === "forgot"
              ? "Send Reset Email"
              : "Sign In"}
          </button>
        </form>

        {["signin", "signup"].includes(mode) && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() =>
                setMode((prev) => (prev === "signup" ? "signin" : "signup"))
              }
              className="text-primary hover:text-accent"
            >
              {mode === "signup"
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;