import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeLogoutPage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('empToken');
    navigate('/emp-login');
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-lg text-gray-700 dark:text-gray-200">Logging out...</div>
    </div>
  );
};

export default EmployeeLogoutPage;
