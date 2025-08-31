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
  const { isAuthenticated, isLoading, checkSession, tokens } = useAuthStore();
  const [sessionChecked, setSessionChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifySession = async () => {
      try {
        // Check if we have tokens in localStorage
        const accessToken = localStorage.getItem("accessToken");
        
        if (!accessToken && !tokens?.access) {
          // No tokens at all, user is not authenticated
          setSessionChecked(true);
          return;
        }

        // If we have tokens, verify the session
        await checkSession();
      } catch (error) {
        console.error("Session verification failed:", error);
      } finally {
        setSessionChecked(true);
      }
    };

    if (!sessionChecked) {
      verifySession();
    }
  }, [checkSession, sessionChecked, tokens]);

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
