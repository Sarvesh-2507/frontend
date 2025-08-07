import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoginForm from '../../../features/authentication/Login';

// Compound Component Pattern for Login
const Login = () => {
  const { isAuthenticated } = useAuthStore();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <LoginForm />;
};

// Compound components
Login.Form = LoginForm;
Login.Container = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="max-w-md w-full space-y-8">
      {children}
    </div>
  </div>
);

export default Login;
