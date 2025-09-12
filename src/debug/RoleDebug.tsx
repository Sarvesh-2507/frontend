import React from 'react';
import { useAuthStore } from '../context/authStore';

const RoleDebug: React.FC = () => {
  const { 
    isAuthenticated, 
    userInfo, 
    user, 
    tokens, 
    getUserInfo, 
    getHomeRoute 
  } = useAuthStore();

  const handleRefreshUserInfo = async () => {
    console.log('🔄 Debug - Manually fetching user info...');
    const result = await getUserInfo();
    console.log('✅ Debug - User info result:', result);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Role Debug Information
      </h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Authentication Status</h3>
            <p className={`text-sm ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
              {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Has Tokens</h3>
            <p className={`text-sm ${tokens ? 'text-green-600' : 'text-red-600'}`}>
              {tokens ? '✅ Has Tokens' : '❌ No Tokens'}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">User Info</h3>
          <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto">
            {userInfo ? JSON.stringify(userInfo, null, 2) : 'No user info available'}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Legacy User</h3>
          <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto">
            {user ? JSON.stringify(user, null, 2) : 'No legacy user data'}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Role Detection</h3>
          <div className="text-sm space-y-1">
            <p>Role Name: {userInfo?.role?.name || 'N/A'}</p>
            <p>Role ID: {userInfo?.role?.id || 'N/A'}</p>
            <p>Home Route: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{getHomeRoute()}</code></p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">localStorage Data</h3>
          <div className="text-xs space-y-1">
            <p>Access Token: {localStorage.getItem('accessToken') ? '✅ Present' : '❌ Missing'}</p>
            <p>User Info: {localStorage.getItem('userInfo') ? '✅ Present' : '❌ Missing'}</p>
            <p>Current User: {localStorage.getItem('currentUser') ? '✅ Present' : '❌ Missing'}</p>
          </div>
        </div>

        <button
          onClick={handleRefreshUserInfo}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Refresh User Info
        </button>
      </div>
    </div>
  );
};

export default RoleDebug;
