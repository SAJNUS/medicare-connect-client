import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <span className="loading loading-spinner loading-lg text-[#0b6e66]"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.includes(user.role?.toLowerCase())) {
    return children;
  }

  // User is logged in but doesn't have the required role
  return <Navigate to="/" replace />;
};

export default RoleRoute;
