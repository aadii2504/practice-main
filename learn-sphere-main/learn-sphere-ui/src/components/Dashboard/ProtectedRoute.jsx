import React from "react";
import { Navigate } from "react-router-dom";

// Very small, simple protected route using localStorage
export const ProtectedRoute = ({ children }) => {
  try {
    const user = JSON.parse(localStorage.getItem("learnsphere_user") || "null");
    if (!user) return <Navigate to="/login" replace />;
    return children;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
