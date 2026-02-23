import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const ProtectedLayout = ({ allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // 🔐 If no token → redirect
  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // 🔐 If role not allowed → redirect
    if (allowedRoles && !allowedRoles.includes(decoded?.role)) {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch (error) {
    // ❌ Invalid token
    localStorage.removeItem("token");
    console.log("Error decoding token:", error);
    return <Navigate to="/signin" replace />;
  }
};
