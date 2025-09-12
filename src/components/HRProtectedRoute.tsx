import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

interface HRProtectedRouteProps {
  children: React.ReactNode;
}

const HRProtectedRoute: React.FC<HRProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, userInfo, getUserInfo, isLoading } = useAuthStore();
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (isAuthenticated && !userInfo) {
        try {
          console.log('🔍 HRProtectedRoute - Fetching user info for HR access check');
          await getUserInfo();
        } catch (error) {
          console.error('❌ HRProtectedRoute - Error fetching user info:', error);
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
          <p className="text-gray-600 dark:text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has HR role
  if (userInfo && userInfo.role) {
    const roleName = userInfo.role.name.toLowerCase().trim();
    console.log('🔍 HRProtectedRoute - Checking role:', `"${roleName}"`);
    console.log('🔍 HRProtectedRoute - Full role object:', userInfo.role);
    
    // Check for HR/Admin roles (multiple variations)
    if (roleName === 'hr' || roleName === 'human resources' || roleName === 'admin' || 
        roleName.includes('hr') || roleName.includes('admin') || roleName.includes('manager')) {
      console.log('✅ HRProtectedRoute - HR/Admin access granted');
      return <>{children}</>;
    } else {
      // Redirect employees to their home page
      console.log(`🚫 HRProtectedRoute - Access denied for "${roleName}", redirecting to employee home`);
      return <Navigate to="/emp-home" replace />;
    }
  }

  // Fallback to login if no user info
  return <Navigate to="/login" replace />;
};

export default HRProtectedRoute;
