import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

interface ModulePageProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  comingSoon?: boolean;
}

const ModulePage: React.FC<ModulePageProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  comingSoon = true 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Back to Dashboard"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                  <Icon className="w-8 h-8 text-blue-600" />
                  <span>{title}</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {comingSoon ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12">
                  <Construction className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Coming Soon
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    We're working hard to bring you the <strong>{title}</strong> module. 
                    This feature will be available in an upcoming release.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      What to expect:
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
                      <li>• Comprehensive {title.toLowerCase()} management</li>
                      <li>• Intuitive user interface</li>
                      <li>• Real-time updates and notifications</li>
                      <li>• Advanced reporting and analytics</li>
                      <li>• Mobile-responsive design</li>
                    </ul>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/dashboard')}
                    className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Back to Dashboard
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {title} Content
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  This is where the {title} module content would be displayed.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModulePage;
