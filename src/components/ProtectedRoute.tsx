import React from "react";
import { Navigate } from "react-router-dom";
import { getUserInfo } from "../services/auth-storage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: "ADMIN" | "SELLER" | "CUSTOMER";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const userInfo = getUserInfo();

  if (!userInfo || userInfo.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
