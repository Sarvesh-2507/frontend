import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bug, Send, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'react-toastify';

const DebugChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const API_BASE_URL = 'http://192.168.1.132:8000/api';

  const testFormats = [
    {
      name: 'Format 1: current_password + new_password',
      getData: () => ({
        current_password: currentPassword,
        new_password: newPassword
      })
    },
    {
      name: 'Format 2: old_password + new_password',
      getData: () => ({
        old_password: currentPassword,
        new_password: newPassword
      })
    },
    {
      name: 'Format 3: Django default (with confirmation)',
      getData: () => ({
        old_password: currentPassword,
        new_password1: newPassword,
        new_password2: newPassword
      })
    },
    {
      name: 'Format 4: currentPassword + newPassword (camelCase)',
      getData: () => ({
        currentPassword: currentPassword,
        newPassword: newPassword
      })
    },
    {
      name: 'Format 5: current_password + new_password + confirm_password',
      getData: () => ({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: newPassword
      })
    },
    {
      name: 'Format 6: Payroll-style format',
      getData: () => ({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: newPassword
      })
    }
  ];

  const makeRequest = async (format: any) => {
    // Enhanced token detection with debugging
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const token = currentUser.access_token ||
                  currentUser.token ||
                  currentUser.access ||
                  currentUser.authToken ||
                  currentUser.jwt ||
                  currentUser.bearer_token ||
                  localStorage.getItem('accessToken');

    console.log('🔍 Token Debug Info:');
    console.log('📦 currentUser object:', currentUser);
    console.log('🔑 Available token fields:', {
      access_token: currentUser.access_token ? 'Present' : 'Missing',
      token: currentUser.token ? 'Present' : 'Missing',
      access: currentUser.access ? 'Present' : 'Missing',
      authToken: currentUser.authToken ? 'Present' : 'Missing',
      jwt: currentUser.jwt ? 'Present' : 'Missing',
      bearer_token: currentUser.bearer_token ? 'Present' : 'Missing',
      localStorage_accessToken: localStorage.getItem('accessToken') ? 'Present' : 'Missing'
    });
    console.log('🎯 Selected token:', token ? token.substring(0, 30) + '...' : 'NO TOKEN FOUND');

    if (!token) {
      throw new Error('No access token found. Please log in first.');
    }

    const requestData = format.getData();

    console.log(`🧪 Testing ${format.name}`);
    console.log('📤 Request data:', requestData);
    console.log('🌐 API URL:', `${API_BASE_URL}/change-password/`);
    console.log('🔐 Authorization header:', `Bearer ${token.substring(0, 20)}...`);

    const response = await fetch(`${API_BASE_URL}/change-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(requestData)
    });

    console.log('📊 Response status:', response.status);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

    const responseData = await response.text();
    let parsedData;

    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = responseData;
    }

    console.log('📥 Response data:', parsedData);

    return {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: parsedData,
      requestData,
      tokenInfo: {
        tokenFound: !!token,
        tokenSource: token === currentUser.access_token ? 'currentUser.access_token' :
                    token === currentUser.token ? 'currentUser.token' :
                    token === currentUser.access ? 'currentUser.access' :
                    token === localStorage.getItem('accessToken') ? 'localStorage.accessToken' :
                    'unknown',
        tokenLength: token ? token.length : 0
      }
    };
  };

  const runSingleTest = async (format: any) => {
    if (!currentPassword || !newPassword) {
      toast.error('Please enter both current and new passwords');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await makeRequest(format);
      
      const testResult = {
        format: format.name,
        success: result.status >= 200 && result.status < 300,
        status: result.status,
        statusText: result.statusText,
        requestData: result.requestData,
        responseData: result.data,
        timestamp: new Date().toISOString()
      };

      setResults(prev => [testResult, ...prev]);

      if (testResult.success) {
        toast.success(`✅ ${format.name} - Success!`);
      } else {
        toast.error(`❌ ${format.name} - Failed (${result.status})`);
      }
    } catch (error: any) {
      const testResult = {
        format: format.name,
        success: false,
        status: 'ERROR',
        statusText: error.message,
        requestData: format.getData(),
        responseData: error.toString(),
        timestamp: new Date().toISOString()
      };

      setResults(prev => [testResult, ...prev]);
      toast.error(`❌ ${format.name} - Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runAllTests = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Please enter both current and new passwords');
      return;
    }

    setIsLoading(true);
    setResults([]);

    for (const format of testFormats) {
      try {
        await runSingleTest(format);
        // Wait 500ms between requests to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Test failed for ${format.name}:`, error);
      }
    }

    setIsLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const generateCurlCommand = (result: any) => {
    const token = localStorage.getItem('accessToken');
    return `curl -X POST ${API_BASE_URL}/change-password/ \\
  -H "Authorization: Bearer ${token}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(result.requestData)}' \\
  -v`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Bug className="w-6 h-6 text-yellow-600" />
          <div>
            <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-300">
              Change Password API Debugger
            </h2>
            <p className="text-yellow-700 dark:text-yellow-400 text-sm">
              Test different request formats to identify the correct API structure
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Test Credentials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your current password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your new password"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={runAllTests}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Test All Formats</span>
          </motion.button>

          {testFormats.map((format, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => runSingleTest(format)}
              disabled={isLoading}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <span>Test Format {index + 1}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Test Results
          </h3>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  result.success
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {result.format}
                    </h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      result.success
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {result.status} {result.statusText}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(generateCurlCommand(result))}
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy curl</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Request Data:
                    </h5>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.requestData, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Response Data:
                    </h5>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto">
                      {typeof result.responseData === 'string' 
                        ? result.responseData 
                        : JSON.stringify(result.responseData, null, 2)}
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
          How to Use This Debugger
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-blue-700 dark:text-blue-400 text-sm">
          <li>Enter your current password and desired new password</li>
          <li>Click "Test All Formats" to try all common API formats</li>
          <li>Look for green (success) results to identify the correct format</li>
          <li>Check the response data for specific error messages</li>
          <li>Use the "Copy curl" button to test the same request in terminal</li>
          <li>Update your main API call to use the successful format</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugChangePassword;