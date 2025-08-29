import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../context/authStore';
import { User } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Array<'admin' | 'employee' | 'hr'>;
  redirectTo?: string;
}

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </motion.div>
  </div>
);

const UnauthorizedAccess: React.FC<{ userRole?: string; requiredRoles: string[] }> = ({ 
  userRole, 
  requiredRoles 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full text-center"
    >
      <div className="card p-8">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You don't have permission to access this page.
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <p>Your role: <span className="font-medium">{userRole || 'Unknown'}</span></p>
          <p>Required roles: <span className="font-medium">{requiredRoles.join(', ')}</span></p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.history.back()}
          className="btn-primary"
        >
          Go Back
        </motion.button>
      </div>
    </motion.div>
  </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  redirectTo = '/login',
}) => {
  const { isAuthenticated, user, isLoading, checkSession } = useAuthStore();
  const location = useLocation();

  // Check the session when the component mounts or location changes
  useEffect(() => {
    const validateSession = async () => {
      await checkSession();
    };
    validateSession();
  }, [checkSession, location]);

  console.log('🛡️ ProtectedRoute - Auth state:', { isAuthenticated, user: !!user, isLoading });

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Only redirect to login if we've completed loading and determined the user is not authenticated
  // This prevents premature redirects when tokens exist but haven't been validated yet
  if (!isAuthenticated && !isLoading) {
    // Check localStorage directly as a final fallback
    const accessToken = localStorage.getItem("accessToken");
    
    if (!accessToken) {
      console.log('🔒 User not authenticated, redirecting to login');
      return (
        <Navigate 
          to={redirectTo} 
          state={{ from: location }} 
          replace 
        />
      );
    }
  }
  
  // If we have authentication but no user data yet, that's okay
  // We'll allow the route to render while user data is being fetched
  // This prevents unnecessary redirects for API errors in user profile fetching

  // Check role-based access if roles are specified
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    
    if (!hasRequiredRole) {
      return (
        <UnauthorizedAccess 
          userRole={user.role} 
          requiredRoles={requiredRoles} 
        />
      );
    }
  }

  // User is authenticated and has required permissions
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default ProtectedRoute;

// Higher-order component for role-based protection
export const withRoleProtection = (
  Component: React.ComponentType<any>,
  requiredRoles: Array<'admin' | 'employee' | 'hr'>
) => {
  return (props: any) => (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Specific role-based route components
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRoles={['admin']}>
    {children}
  </ProtectedRoute>
);

export const HRRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRoles={['admin', 'hr']}>
    {children}
  </ProtectedRoute>
);

export const EmployeeRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRoles={['admin', 'hr', 'employee']}>
    {children}
  </ProtectedRoute>
);
