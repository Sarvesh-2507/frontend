import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import DashboardMain from '../../../features/dashboard/Dashboard';

// Compound Component Pattern for Dashboard
const Dashboard = () => {
  const { isAuthenticated } = useAuthStore();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardMain />;
};

// Compound components
Dashboard.Main = DashboardMain;
Dashboard.Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    {children}
  </div>
);

Dashboard.Content = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 p-6">
    {children}
  </div>
);

export default Dashboard;
