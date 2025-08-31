import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const Spinner = () => <div className="p-8 text-center">Loading...</div>;

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Temporarily bypass authentication to show UI
  return <>{children}</>;
  
  // Original auth code (commented out):
  // const { token, loading, isTokenValid } = useAuth();
  // if (loading) return <Spinner />;
  // if (token && isTokenValid(token)) return <>{children}</>;
  // return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
