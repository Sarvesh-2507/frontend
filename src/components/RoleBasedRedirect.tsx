import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

const RoleBasedRedirect: React.FC = () => {
  const { isAuthenticated, userInfo, getUserInfo, getHomeRoute, isLoading } = useAuthStore();
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (isAuthenticated && !userInfo) {
        try {
          console.log('🔍 RoleBasedRedirect - Fetching user info for role determination');
          await getUserInfo();
        } catch (error) {
          console.error('❌ RoleBasedRedirect - Error fetching user info:', error);
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
          <p className="text-gray-600 dark:text-gray-400">Determining your role...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (userInfo && userInfo.role) {
    const homeRoute = getHomeRoute();
    console.log('🔍 RoleBasedRedirect - Full userInfo:', JSON.stringify(userInfo, null, 2));
    console.log('🏷️ RoleBasedRedirect - Role name:', userInfo.role.name);
    console.log('🏷️ RoleBasedRedirect - Role name type:', typeof userInfo.role.name);
    console.log('🏷️ RoleBasedRedirect - Role name lowercase:', userInfo.role.name.toLowerCase());
    console.log(`🏠 RoleBasedRedirect - Redirecting ${userInfo.role.name} to ${homeRoute}`);
    return <Navigate to={homeRoute} replace />;
  }

  // Fallback to login if no user info
  return <Navigate to="/login" replace />;
};

export default RoleBasedRedirect;
