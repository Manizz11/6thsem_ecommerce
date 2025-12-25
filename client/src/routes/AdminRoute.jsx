import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { authUser } = useSelector((state) => state.auth);
  
  // Check if user is authenticated and is admin
  // For demo purposes, we'll allow any authenticated user to access admin
  // In production, you'd check for admin role
  if (!authUser) {
    return <Navigate to="/" replace />;
  }

  // Optional: Check for admin role
  // if (authUser.role !== 'admin') {
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

export default AdminRoute;