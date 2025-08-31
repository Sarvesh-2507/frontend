import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600">Verifying authentication...</p>
    </div>
  </div>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, tokens } = useAuthStore();
  const [sessionChecked, setSessionChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      // Check if we have tokens in localStorage
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken && !tokens?.access) {
        // No tokens at all, user is not authenticated
        setSessionChecked(true);
        return;
      }

      // If we have tokens, consider the user authenticated
      if (accessToken && !isAuthenticated) {
        // Update the store state if needed
        useAuthStore.setState({
          isAuthenticated: true,
          tokens: {
            access: accessToken,
            refresh: localStorage.getItem("refreshToken") || ""
          }
        });
      }
      
      setSessionChecked(true);
    };

    if (!sessionChecked) {
      checkAuth();
    }
  }, [sessionChecked, tokens, isAuthenticated]);

  // Show loading spinner while checking session
  if (isLoading || !sessionChecked) {
    return <Spinner />;
  }

  // If not authenticated, redirect to login with the current location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
