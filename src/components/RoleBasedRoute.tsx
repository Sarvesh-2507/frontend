import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

interface RoleBasedRouteProps {
  children: React.ReactNode;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children }) => {
  const { isAuthenticated, userInfo, getUserInfo, getHomeRoute, isLoading } = useAuthStore();
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (isAuthenticated && !userInfo) {
        try {
          console.log('🔍 RoleBasedRoute - Fetching user info for role determination');
          await getUserInfo();
        } catch (error) {
          console.error('❌ RoleBasedRoute - Error fetching user info:', error);
        }
      }
      setIsCheckingRole(false);
    };

    checkUserRole();
  }, [isAuthenticated, userInfo, getUserInfo]);

  // Show loading while checking authentication or role
  if (isLoading || isCheckingRole) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If we have user info and role, redirect to appropriate home
  if (userInfo && userInfo.role) {
    const homeRoute = getHomeRoute();
    const currentPath = window.location.pathname;
    
    // Don't redirect if user is already on their correct home route or sub-routes
    const isOnCorrectRoute = currentPath.startsWith(homeRoute);
    
    if (!isOnCorrectRoute && (currentPath === '/' || currentPath === '/home' || currentPath === '/emp-home')) {
      console.log(`🏠 RoleBasedRoute - Redirecting ${userInfo.role.name} to ${homeRoute}`);
      return <Navigate to={homeRoute} replace />;
    }
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
