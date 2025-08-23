import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { motion } from 'framer-motion';

interface WithAuthOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  roles?: string[];
  permissions?: string[];
  fallbackComponent?: React.ComponentType;
}

interface AuthUser {
  id: string;
  email: string;
  role?: string;
  permissions?: string[];
}

const DefaultUnauthorizedComponent: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5V9m0 0V7m0 2h2m-2 0H10" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to access this resource.
        </p>
      </div>
    </motion.div>
  );
};

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) => {
  const {
    redirectTo = '/login',
    requireAuth = true,
    roles = [],
    permissions = [],
    fallbackComponent: FallbackComponent = DefaultUnauthorizedComponent
  } = options;

  const WithAuthComponent: React.FC<P> = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, isLoading } = useAuthStore();

    useEffect(() => {
      if (!isLoading) {
        if (requireAuth && !isAuthenticated) {
          // Redirect to login with return URL
          navigate(redirectTo, { 
            state: { from: location.pathname },
            replace: true 
          });
          return;
        }

        // Check role-based access
        if (isAuthenticated && roles.length > 0 && user) {
          const userRole = (user as AuthUser).role;
          if (!userRole || !roles.includes(userRole)) {
            return; // Will show fallback component
          }
        }

        // Check permission-based access
        if (isAuthenticated && permissions.length > 0 && user) {
          const userPermissions = (user as AuthUser).permissions || [];
          const hasPermission = permissions.some(permission => 
            userPermissions.includes(permission)
          );
          if (!hasPermission) {
            return; // Will show fallback component
          }
        }
      }
    }, [isAuthenticated, user, isLoading, navigate, location.pathname]);

    // Show loading state
    if (isLoading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
        >
          <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </motion.div>
      );
    }

    // Check authentication
    if (requireAuth && !isAuthenticated) {
      return null; // Will redirect in useEffect
    }

    // Check role authorization
    if (isAuthenticated && roles.length > 0 && user) {
      const userRole = (user as AuthUser).role;
      if (!userRole || !roles.includes(userRole)) {
        return <FallbackComponent />;
      }
    }

    // Check permission authorization
    if (isAuthenticated && permissions.length > 0 && user) {
      const userPermissions = (user as AuthUser).permissions || [];
      const hasPermission = permissions.some(permission => 
        userPermissions.includes(permission)
      );
      if (!hasPermission) {
        return <FallbackComponent />;
      }
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithAuthComponent;
};

export default withAuth;
