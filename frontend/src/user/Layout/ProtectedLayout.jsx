import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedLayout = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Ye line MUST hamesha rehni chahiye
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const CustomerProtectedLayout = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Ye line MUST hamesha rehni chahiye
    return <Navigate to="/customerCare/signIn" state={{ from: location }} replace />;
  }

  return <Outlet />;
};


