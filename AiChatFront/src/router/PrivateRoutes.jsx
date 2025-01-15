import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoutes({ children }) {
  const { user } = useAuth();

  // Redirect to login if the user is not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoutes;
