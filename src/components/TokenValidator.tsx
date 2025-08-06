import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, XCircle, AlertTriangle, RefreshCw, Copy } from 'lucide-react';
import { toast } from 'react-toastify';

const TokenValidator: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<any[]>([]);

  const API_BASE_URL = 'http://192.168.1.132:8000';

  const endpoints = [
    { name: 'Profile', url: '/api/profile/', method: 'GET' },
    { name: 'Change Password', url: '/api/change-password/', method: 'POST' },
    { name: 'Change Password (accounts)', url: '/accounts/change-password/', method: 'POST' },
    { name: 'Change Password (auth)', url: '/auth/change-password/', method: 'POST' },
    { name: 'User Info', url: '/api/user/', method: 'GET' },
    { name: 'Dashboard', url: '/api/dashboard/', method: 'GET' },
  ];

  const analyzeToken = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const token = currentUser.access_token ||
                  currentUser.token ||
                  currentUser.access ||
                  currentUser.authToken ||
                  currentUser.jwt ||
                  currentUser.bearer_token ||
                  localStorage.getItem('accessToken');

    let decodedToken = null;
    let isExpired = false;
    let expirationDate = null;

    if (token) {
      try {
        // Decode JWT token
        const payload = JSON.parse(atob(token.split('.')[1]));
        decodedToken = payload;
        const now = Math.floor(Date.now() / 1000);
        isExpired = payload.exp < now;
        expirationDate = new Date(payload.exp * 1000);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    const info = {
      tokenFound: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? token.substring(0, 30) + '...' : 'No token found',
      tokenSource: token === currentUser.access_token ? 'currentUser.access_token' :
                  token === currentUser.token ? 'currentUser.token' :
                  token === currentUser.access ? 'currentUser.access' :
                  token === localStorage.getItem('accessToken') ? 'localStorage.accessToken' :
                  'unknown',
      decodedToken,
      isExpired,
      expirationDate,
      currentUser,
      availableFields: {
        access_token: !!currentUser.access_token,
        token: !!currentUser.token,
        access: !!currentUser.access,
        authToken: !!currentUser.authToken,
        jwt: !!currentUser.jwt,
        bearer_token: !!currentUser.bearer_token,
        localStorage_accessToken: !!localStorage.getItem('accessToken')
      }
    };

    setTokenInfo(info);
    return { token, info };
  };

  const validateEndpoints = async () => {
    setIsValidating(true);
    const { token } = analyzeToken();

    if (!token) {
      toast.error('No token found to validate');
      setIsValidating(false);
      return;
    }

    const results = [];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint.url}`, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: endpoint.method === 'POST' ? JSON.stringify({
            current_password: 'test',
            new_password: 'test123'
          }) : undefined
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
          success: response.status < 400,
          data: parsedData,
          headers: Object.fromEntries(response.headers.entries())
        });
      } catch (error: any) {
        results.push({
          ...endpoint,
          status: 'ERROR',
          success: false,
          data: error.message,
          headers: {}
        });
      }
    }

    setValidationResults(results);
    setIsValidating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  useEffect(() => {
    analyzeToken();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">
              Token Validator & Debugger
            </h2>
            <p className="text-blue-700 dark:text-blue-400 text-sm">
              Analyze your authentication token and test API endpoints
            </p>
          </div>
        </div>
      </div>

      {/* Token Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Token Analysis</h3>
          <button
            type="button"
            onClick={analyzeToken}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {tokenInfo && (
          <div className="space-y-4">
            {/* Token Status */}
            <div className="flex items-center space-x-3">
              {tokenInfo.tokenFound ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={`font-medium ${tokenInfo.tokenFound ? 'text-green-700' : 'text-red-700'}`}>
                {tokenInfo.tokenFound ? 'Token Found' : 'No Token Found'}
              </span>
            </div>

            {tokenInfo.tokenFound && (
              <>
                {/* Token Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Token Source
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      {tokenInfo.tokenSource}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Token Length
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      {tokenInfo.tokenLength} characters
                    </p>
                  </div>
                </div>

                {/* Token Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Token Preview
                  </label>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded flex-1 font-mono">
                      {tokenInfo.tokenPreview}
                    </p>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(tokenInfo.tokenPreview)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expiration Status */}
                {tokenInfo.decodedToken && (
                  <div className="flex items-center space-x-3">
                    {tokenInfo.isExpired ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    <span className={`font-medium ${tokenInfo.isExpired ? 'text-red-700' : 'text-green-700'}`}>
                      {tokenInfo.isExpired ? 'Token Expired' : 'Token Valid'}
                    </span>
                    {tokenInfo.expirationDate && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Expires: {tokenInfo.expirationDate.toLocaleString()}
                      </span>
                    )}
                  </div>
                )}

                {/* Available Token Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Available Token Fields
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(tokenInfo.availableFields).map(([field, available]) => (
                      <div key={field} className="flex items-center space-x-2">
                        {available ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-xs text-gray-600 dark:text-gray-400">{field}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Endpoint Validation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Endpoint Validation</h3>
          <button
            type="button"
            onClick={validateEndpoints}
            disabled={isValidating || !tokenInfo?.tokenFound}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Shield className="w-4 h-4" />
            <span>{isValidating ? 'Testing...' : 'Test Endpoints'}</span>
          </button>
        </div>

        {validationResults.length > 0 && (
          <div className="space-y-3">
            {validationResults.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  result.success
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                }`}
              >
                <div className="flex items-center justify-between">
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
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    result.success
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}>
                    {result.status}
                  </span>
                </div>
                {result.data && (
                  <div className="mt-2">
                    <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
                      {typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenValidator;
