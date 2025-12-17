import React from "react";
import { Navigate } from "react-router-dom";
import { getUserInfo, UserInfo } from "../services/auth-storage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserInfo["role"];
  requiredRoles?: UserInfo["role"][];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredRoles,
}) => {
  const userInfo = getUserInfo();

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = requiredRoles ?? (requiredRole ? [requiredRole] : []);

  if (allowedRoles.length > 0 && !allowedRoles.includes(userInfo.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
