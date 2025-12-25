import { useEffect, useState } from "react";
import { X, LogOut as LogoutIcon, Upload, Eye, EyeOff, Shield } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toggleProfilePopup } from "../../store/slices/popupSlice";
import { updateProfile, updatePassword, logout } from "../../store/slices/authSlice";

const ProfilePanel = () => {
  const dispatch = useDispatch();
  const { isProfilePopupOpen } = useSelector((state) => state.popup);
  const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector(
    (state) => state.auth
  );

  const [name, setName] = useState(authUser?.name || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (authUser) {
      setName(authUser.name || "");
      setEmail(authUser.email || "");
    }
  }, [authUser]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
  };

  const handleAdminLogin = () => {
    window.open('http://localhost:5174/login', '_blank');
  };

  const handleUpdateProfile = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (avatar) formData.append("avatar", avatar);
    dispatch(updateProfile(formData));
  };

  const handleUpdatePassword = () => {
    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newpassword", newpassword);
    formData.append("confirmNewPassword", confirmNewPassword);
    dispatch(updatePassword(formData));
  };

  if (!isProfilePopupOpen || !authUser) return null;

  return (
    <>
      {/*OVERLAY*/}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => dispatch(toggleProfilePopup())}
      />

      {/*Profile Panel */}
      <div className="fixed right-0 top-0 h-full w-96 z-50 glass-panel animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-[hsla(var(--glass-border))]">
          <h2 className="text-xl font-semibold text-primary">Profile</h2>
          <button
            aria-label="Close Cart"
            onClick={() => dispatch(toggleProfilePopup())}
            className="p-2 rounded-lg glass-card hover:glow-on-hover animate-smooth"
          >
            <X className="w-6 h-6 text-primary" />
          </button>
        </div>

        <div className="p-6">
          {/* aVATAR AND BASIC INFO */}
          <div className="text-center mb-6">
            <img
              src={authUser?.avatar?.url || "/avatar-holder.avif"}
              alt={authUser?.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-primary object-cover"
            />
            <h3 className="text-lg font-semibold text-foreground">
              {authUser?.name}
            </h3>
            <p className="text-sm text-muted-foreground">{authUser?.email}</p>
          </div>

          {/* Prfofile update Form */}
          {authUser && (
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-primary">
                Update Profile
              </h3>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded border border-border bg-secondary text-foreground"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded border border-border bg-secondary text-foreground"
              />
              <label className="flex items-center gpa-2 cursor-pointer text-sm text-muted-foreground">
                <Upload className="w-4 h-4 text-primary" />
                <span>Upload Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleUpdateProfile}
                className="flex justify-center items-center space-x-3 p-3 rounded-lg glass-card hover:glow-on-hover  animate-smooth group w-full"
              >
                {isUpdatingProfile ? (
                  <>
                    <div
                      className={`w-5 h-5 border-2 border-white border-t-transparent rounded-full 
                      animate-spin`}
                    />
                    <span>Updating Profile....</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          )}

          {/* Password Update Form */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-primary">
              Update Password
            </h3>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 rounded border border-border bg-secondary text-foreground"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newpassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 rounded border border-border bg-secondary text-foreground"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full p-2 rounded border border-border bg-secondary text-foreground"
            />

            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-muted-foreground flex items-center gap-1"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-primary" />
              ) : (
                <Eye className="w-4 h-4 text-primary" />
              )}
              <span>{showPassword ? "Hide" : "Show"} Passwords</span>
            </button>

            <button
              onClick={handleUpdatePassword}
              className="flex justify-center items-center space-x-3 p-3 rounded-lg glass-card hover:glow-on-hover  animate-smooth group w-full"
            >
              {isUpdatingPassword ? (
                <>
                  <div
                    className={`w-5 h-5 border-2 border-white border-t-transparent rounded-full 
                      animate-spin`}
                  />
                  <span>Updating Password....</span>
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>

          {/* Admin Login Button */}
          <button
            onClick={handleAdminLogin}
            className="w-full p-3 rounded-lg glass-card hover:glow-on-hover animate-smooth text-blue-600 flex justify-center items-center space-x-2 mb-4"
          >
            <Shield className="w-5 h-5" />
            <span>Admin Login</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-lg glass-card hover:glow-on-hover animate-smooth text-destructive flex justify-center items-center space-x-2"
          >
            <LogoutIcon className="w-5 h-5 text-destructive-foreground" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;
