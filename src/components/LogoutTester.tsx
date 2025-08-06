import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, CheckCircle, XCircle, AlertTriangle, RefreshCw, Copy } from 'lucide-react';
import { toast } from 'react-toastify';

const LogoutTester: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const API_BASE_URL = 'http://192.168.1.132:8000/api';

  const testLogoutEndpoints = async () => {
    setIsLoading(true);
    setTestResults([]);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const accessToken = currentUser.access_token ||
                       currentUser.token ||
                       currentUser.access ||
                       currentUser.authToken ||
                       currentUser.jwt ||
                       currentUser.bearer_token ||
                       localStorage.getItem('accessToken');

    const refreshToken = currentUser.refresh_token || localStorage.getItem('refreshToken');

    const endpoints = [
      { name: 'Logout API', url: '/logout/', method: 'POST' },
      { name: 'Logout (auth)', url: '/auth/logout/', method: 'POST' },
      { name: 'Logout (accounts)', url: '/accounts/logout/', method: 'POST' },
      { name: 'Logout (simple)', url: '/logout', method: 'POST' },
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        console.log(`🧪 Testing logout endpoint: ${endpoint.url}`);
        
        const response = await fetch(`${API_BASE_URL}${endpoint.url}`, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': 'Bearer ' + accessToken })
          },
          body: JSON.stringify({
            refresh: refreshToken,
            refresh_token: refreshToken,
            token: refreshToken
          })
        });

        const data = await response.text();
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch {
          parsedData = data;
        }

        results.push({
          ...endpoint,
          status: response.status,
          success: response.status >= 200 && response.status < 300,
          data: parsedData,
          headers: Object.fromEntries(response.headers.entries()),
          requestData: {
            refresh: refreshToken,
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken
          }
        });

        console.log(`✅ ${endpoint.name}: ${response.status}`, parsedData);
      } catch (error: any) {
        results.push({
          ...endpoint,
          status: 'ERROR',
          success: false,
          data: error.message,
          headers: {},
          requestData: {
            refresh: refreshToken,
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken
          }
        });

        console.error(`❌ ${endpoint.name}: ERROR`, error);
      }
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const testCurrentLogout = async () => {
    setIsLoading(true);
    
    try {
      console.log('🚪 Testing current logout implementation...');
      
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const refreshToken = currentUser.refresh_token || localStorage.getItem('refreshToken');
      
      console.log('🔑 Current user data:', currentUser);
      console.log('🔑 Refresh token:', refreshToken ? 'Present' : 'Missing');
      
      // Test the actual logout API call
      const response = await fetch(`${API_BASE_URL}/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (currentUser.access_token || localStorage.getItem('accessToken'))
        },
        body: JSON.stringify({ refresh: refreshToken })
      });

      const data = await response.json();
      
      console.log('📊 Logout response status:', response.status);
      console.log('📥 Logout response data:', data);

      if (response.ok) {
        toast.success('✅ Logout API test successful!');
      } else {
        toast.error(`❌ Logout API test failed: ${response.status}`);
      }

      setTestResults([{
        name: 'Current Implementation Test',
        url: '/logout/',
        method: 'POST',
        status: response.status,
        success: response.ok,
        data,
        headers: Object.fromEntries(response.headers.entries()),
        requestData: {
          refresh: refreshToken,
          hasAccessToken: !!(currentUser.access_token || localStorage.getItem('accessToken')),
          hasRefreshToken: !!refreshToken
        }
      }]);

    } catch (error: any) {
      console.error('❌ Logout test error:', error);
      toast.error(`❌ Logout test error: ${error.message}`);
      
      setTestResults([{
        name: 'Current Implementation Test',
        url: '/logout/',
        method: 'POST',
        status: 'ERROR',
        success: false,
        data: error.message,
        headers: {},
        requestData: {
          refresh: 'unknown',
          hasAccessToken: false,
          hasRefreshToken: false
        }
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const generateCurlCommand = (result: any) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const accessToken = currentUser.access_token || localStorage.getItem('accessToken');
    const refreshToken = currentUser.refresh_token || localStorage.getItem('refreshToken');
    
    return `curl -X ${result.method} ${API_BASE_URL}${result.url} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${accessToken}" \\
  -d '{"refresh": "${refreshToken}"}'`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <LogOut className="w-6 h-6 text-red-600" />
          <div>
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-300">
              Logout API Tester
            </h2>
            <p className="text-red-700 dark:text-red-400 text-sm">
              Test logout functionality with your backend API at 192.168.1.132:8000
            </p>
          </div>
        </div>
      </div>

      {/* Current Token Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Authentication State</h3>
        
        <div className="space-y-3">
          {(() => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            const accessToken = currentUser.access_token || localStorage.getItem('accessToken');
            const refreshToken = currentUser.refresh_token || localStorage.getItem('refreshToken');
            
            return (
              <>
                <div className="flex items-center space-x-3">
                  {accessToken ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Access Token: {accessToken ? 'Present' : 'Missing'}
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
                
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Current User Object:</p>
                  <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                    {JSON.stringify(currentUser, null, 2)}
                  </pre>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Test Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Logout Endpoints</h3>
        
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={testCurrentLogout}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoading ? 'Testing...' : 'Test Current Implementation'}</span>
          </button>
          
          <button
            type="button"
            onClick={testLogoutEndpoints}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isLoading ? 'Testing...' : 'Test All Endpoints'}</span>
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Results</h3>
          
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  result.success
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {result.name} ({result.method})
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{result.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      result.success
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {result.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(generateCurlCommand(result))}
                      className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy curl</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Request Data:</h5>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.requestData, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Response Data:</h5>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto">
                      {typeof result.data === 'string' 
                        ? result.data 
                        : JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
          How to Use This Tester
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-blue-700 dark:text-blue-400 text-sm">
          <li>Check your current authentication state above</li>
          <li>Click "Test Current Implementation" to test the main logout endpoint</li>
          <li>Click "Test All Endpoints" to try different logout URL variations</li>
          <li>Look for green (success) results to identify the working endpoint</li>
          <li>Use the "Copy curl" button to test the same request in terminal</li>
          <li>Check the console for detailed logging information</li>
        </ol>
      </div>
    </div>
  );
};

export default LogoutTester;
