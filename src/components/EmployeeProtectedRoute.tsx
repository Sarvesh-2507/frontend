import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

interface EmployeeProtectedRouteProps {
  children: React.ReactNode;
}

const EmployeeProtectedRoute: React.FC<EmployeeProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, userInfo, getUserInfo, isLoading } = useAuthStore();
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (isAuthenticated && !userInfo) {
        try {
          console.log('🔍 EmployeeProtectedRoute - Fetching user info for employee access check');
          await getUserInfo();
        } catch (error) {
          console.error('❌ EmployeeProtectedRoute - Error fetching user info:', error);
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

  // Check if user has Employee role
  if (userInfo && userInfo.role) {
    const roleName = userInfo.role.name.toLowerCase().trim();
    console.log('🔍 EmployeeProtectedRoute - Checking role:', `"${roleName}"`);
    console.log('🔍 EmployeeProtectedRoute - Full role object:', userInfo.role);
    
    // Check for Employee roles
    if (roleName === 'employee' || roleName === 'emp' || roleName === 'staff') {
      console.log('✅ EmployeeProtectedRoute - Employee access granted');
      return <>{children}</>;
    } 
    // Check for HR/Admin roles
    else if (roleName === 'hr' || roleName === 'human resources' || roleName === 'admin' || 
             roleName.includes('hr') || roleName.includes('admin') || roleName.includes('manager')) {
      // Redirect HR users to their home page
      console.log(`🚫 EmployeeProtectedRoute - HR/Admin user detected, redirecting to HR home`);
      return <Navigate to="/home" replace />;
    } 
    // Unknown roles default to employee access for now
    else {
      console.log(`⚠️ EmployeeProtectedRoute - Unknown role "${roleName}", allowing employee access`);
      return <>{children}</>;
    }
  }

  // Fallback to login if no user info
  return <Navigate to="/login" replace />;
};

export default EmployeeProtectedRoute;
