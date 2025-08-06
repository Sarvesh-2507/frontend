import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Info, CheckCircle, XCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LogoutDebugger: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token, refreshToken, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleTestLogout = async () => {
    console.log('🧪 LogoutDebugger - Starting test logout...');
    console.log('🔍 Current auth state:', { 
      hasUser: !!user, 
      hasToken: !!token, 
      hasRefreshToken: !!refreshToken, 
      isAuthenticated 
    });
    
    try {
      const result = await dispatch(logoutUser());
      console.log('🧪 LogoutDebugger - Logout result:', result);
      
      if (logoutUser.fulfilled.match(result)) {
        console.log('✅ LogoutDebugger - Logout successful');
        toast.success('Logout test successful!');
      } else {
        console.log('❌ LogoutDebugger - Logout failed');
        toast.error('Logout test failed');
      }
    } catch (error) {
      console.error('❌ LogoutDebugger - Error:', error);
      toast.error('Logout test error');
    }
  };

  const handleDirectAPITest = async () => {
    console.log('🧪 LogoutDebugger - Testing direct API call...');
    
    const currentRefreshToken = refreshToken || localStorage.getItem('refreshToken');
    const currentAccessToken = token || localStorage.getItem('accessToken');
    
    console.log('🔑 Tokens:', { 
      hasRefreshToken: !!currentRefreshToken, 
      hasAccessToken: !!currentAccessToken 
    });

    try {
      const response = await fetch('http://192.168.1.132:8000/api/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentAccessToken}`
        },
        body: JSON.stringify({ refresh: currentRefreshToken })
      });

      console.log('📡 Direct API response status:', response.status);
      const data = await response.text();
      console.log('📥 Direct API response data:', data);

      if (response.ok) {
        toast.success(`Direct API test successful! Status: ${response.status}`);
      } else {
        toast.error(`Direct API test failed! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Direct API test error:', error);
      toast.error('Direct API test error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <LogOut className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">
              Logout Debugger
            </h2>
            <p className="text-blue-700 dark:text-blue-400 text-sm">
              Test logout functionality and API calls
            </p>
          </div>
        </div>
      </div>

      {/* Current State */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Authentication State</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Authenticated: {isAuthenticated ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {user ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              User: {user ? `${user.username} (${user.email})` : 'None'}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {token ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Access Token: {token ? 'Present' : 'Missing'}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {refreshToken ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Refresh Token: {refreshToken ? 'Present' : 'Missing'}
            </span>
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Logout</h3>
        
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleTestLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Test Redux Logout</span>
          </button>
          
          <button
            type="button"
            onClick={handleDirectAPITest}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Info className="w-4 h-4" />
            <span>Test Direct API Call</span>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
          How to Use
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-yellow-700 dark:text-yellow-400 text-sm">
          <li>Check your current authentication state above</li>
          <li>Click "Test Redux Logout" to test the full logout flow</li>
          <li>Click "Test Direct API Call" to test just the API endpoint</li>
          <li>Check the browser console for detailed logs</li>
          <li>Check the network tab to see the actual API requests</li>
        </ol>
      </div>
    </div>
  );
};

export default LogoutDebugger;
