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
  const [localAuthChecked, setLocalAuthChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      // Check if we have tokens in localStorage
      const accessToken = localStorage.getItem("accessToken");
      const currentUser = localStorage.getItem("currentUser");
      
      console.log("ProtectedRoute - Debug Auth Check:");
      console.log("Access Token:", accessToken ? "EXISTS" : "MISSING");
      console.log("Current User:", currentUser ? "EXISTS" : "MISSING");
      console.log("Store isAuthenticated:", isAuthenticated);
      console.log("Store tokens:", tokens);
      
      if (!accessToken || !currentUser) {
        // No tokens or user data, user is not authenticated
        console.log("ProtectedRoute - No auth data found, user not authenticated");
        setSessionChecked(true);
        setLocalAuthChecked(true);
        return;
      }

      // If we have both token and user data, consider the user authenticated
      if (accessToken && currentUser) {
        console.log("ProtectedRoute - Found auth data, updating store state");
        try {
          const user = JSON.parse(currentUser);
          useAuthStore.setState({
            isAuthenticated: true,
            user: user,
            tokens: {
              access: accessToken,
              refresh: localStorage.getItem("refreshToken") || ""
            }
          });
          setLocalAuthChecked(true);
        } catch (error) {
          console.error("ProtectedRoute - Error parsing user data:", error);
          setSessionChecked(true);
          setLocalAuthChecked(true);
          return;
        }
      }
      
      setSessionChecked(true);
    };

    if (!sessionChecked) {
      checkAuth();
    }
  }, [sessionChecked, tokens, isAuthenticated]);

  // Show loading spinner while checking session
  if (isLoading || !sessionChecked || !localAuthChecked) {
    return <Spinner />;
  }

  // Check localStorage directly as fallback
  const accessToken = localStorage.getItem("accessToken");
  const currentUser = localStorage.getItem("currentUser");
  const hasLocalAuth = !!(accessToken && currentUser);

  // If not authenticated in store but has localStorage auth, allow access
  if (!isAuthenticated && hasLocalAuth) {
    console.log("ProtectedRoute - Using localStorage auth as fallback");
    return <>{children}</>;
  }

  // If not authenticated, redirect to login with the current location
  if (!isAuthenticated && !hasLocalAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
