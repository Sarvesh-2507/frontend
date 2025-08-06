import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiresAuth?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/dashboard',
  requiresAuth = false 
}) => {
  const { isAuthenticated } = useAuthStore();

  // If route requires no auth and user is authenticated, redirect
  if (!requiresAuth && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
