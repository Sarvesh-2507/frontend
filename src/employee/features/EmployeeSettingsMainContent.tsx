import React from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  Shield,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const employeeMenuItems = [
  {
    id: 'general',
    title: 'General Settings',
    description: 'Basic application preferences and account settings',
    icon: SettingsIcon,
    path: '/emp-home/settings/general'
  },
  {
    id: 'theme',
    title: 'Theme & Appearance',
    description: 'Customize the look and feel of your application',
    icon: Palette,
    path: '/emp-home/settings/theme'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure how you receive notifications',
    icon: Bell,
    path: '/emp-home/settings/notifications'
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    description: 'Manage your security and privacy preferences',
    icon: Shield,
    path: '/emp-home/settings/security'
  }
];

const EmployeeSettingsMainContent: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => navigate('/emp-home')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <SettingsIcon className="w-8 h-8 text-blue-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <span>Settings</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account preferences and application settings
              </p>
            </div>
          </div>
        </div>
      </header>
      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Choose a settings category
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {employeeMenuItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onClick={() => navigate(item.path)}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
                            <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeSettingsMainContent;
