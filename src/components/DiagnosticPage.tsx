import React from 'react';

const DiagnosticPage: React.FC = () => {
  const authStore = localStorage.getItem('auth-store');
  const theme = localStorage.getItem('theme');
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          🔍 Application Diagnostic Page
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ✅ Basic Functionality
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="text-green-600">✓ React is working</li>
              <li className="text-green-600">✓ TypeScript is working</li>
              <li className="text-green-600">✓ Tailwind CSS is working</li>
              <li className="text-green-600">✓ Component rendering is working</li>
            </ul>
          </div>

          {/* Environment Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🌍 Environment
            </h2>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Node ENV: {import.meta.env.MODE}</li>
              <li>Vite Mode: {import.meta.env.DEV ? 'Development' : 'Production'}</li>
              <li>Base URL: {import.meta.env.BASE_URL}</li>
              <li>Use Mock: {import.meta.env.VITE_USE_MOCK || 'undefined'}</li>
            </ul>
          </div>

          {/* Local Storage */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              💾 Local Storage
            </h2>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <strong>Auth Store:</strong>
                <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto">
                  {authStore ? JSON.stringify(JSON.parse(authStore), null, 2) : 'Not found'}
                </pre>
              </div>
              <div>
                <strong>Theme:</strong> {theme || 'Not set'}
              </div>
            </div>
          </div>

          {/* Navigation Test */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🧭 Navigation Test
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => window.location.href = '/login'}
                className="block w-full text-left px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                → Go to Login
              </button>
              <button
                onClick={() => window.location.href = '/home'}
                className="block w-full text-left px-3 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                → Go to Home
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="block w-full text-left px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
              >
                → Go to Dashboard
              </button>
            </div>
          </div>

          {/* Current URL */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📍 Current Location
            </h2>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div><strong>URL:</strong> {window.location.href}</div>
              <div><strong>Pathname:</strong> {window.location.pathname}</div>
              <div><strong>Search:</strong> {window.location.search || 'None'}</div>
              <div><strong>Hash:</strong> {window.location.hash || 'None'}</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 md:col-span-2">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              📋 Next Steps
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>If you can see this page, React and Tailwind are working correctly</li>
              <li>Check the browser console (F12) for any JavaScript errors</li>
              <li>Try the navigation buttons above to test routing</li>
              <li>Check if authentication is causing redirect loops</li>
              <li>Verify all required dependencies are installed</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;
