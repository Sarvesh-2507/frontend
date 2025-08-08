import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  Shield,
  User,
  ChevronRight
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import BackButton from '../../components/ui/BackButton';

// Import settings pages
import GeneralSettings from './GeneralSettings';
import ThemeAppearance from './ThemeAppearance';
import NotificationSettings from './NotificationSettings';
import SecurityPrivacy from './SecurityPrivacy';

interface SettingsMenuItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
}

const Settings: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: SettingsMenuItem[] = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Basic application preferences and account settings',
      icon: SettingsIcon,
      path: '/settings/general'
    },
    {
      id: 'theme',
      title: 'Theme & Appearance',
      description: 'Customize the look and feel of your application',
      icon: Palette,
      path: '/settings/theme'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure how you receive notifications',
      icon: Bell,
      path: '/settings/notifications'
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      description: 'Manage your security and privacy preferences',
      icon: Shield,
      path: '/settings/security'
    }
  ];

  const isMainSettingsPage = location.pathname === '/settings';

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
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackButton variant="home" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                  <SettingsIcon className="w-8 h-8 text-blue-600" />
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
            <Routes>
              <Route path="/" element={
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
                      {menuItems.map((item, index) => {
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
              } />
              <Route path="/general" element={<GeneralSettings />} />
              <Route path="/theme" element={<ThemeAppearance />} />
              <Route path="/notifications" element={<NotificationSettings />} />
              <Route path="/security" element={<SecurityPrivacy />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
