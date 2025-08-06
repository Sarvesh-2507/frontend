import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Menu, User, ChevronDown } from 'lucide-react';

// Redux
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar } from '../../store/slices/uiSlice';

// Components
import SidebarModern from './SidebarModern';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface DashboardLayoutModernProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const DashboardLayoutModern: React.FC<DashboardLayoutModernProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const dispatch = useAppDispatch();
  const { sidebarCollapsed } = useAppSelector((state: any) => state.ui);
  const { user } = useAppSelector((state: any) => state.auth);

  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const notifications = [
    {
      id: '1',
      title: 'New Leave Request',
      message: 'John Doe has submitted a leave request',
      time: '5 minutes ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Performance Review Due',
      message: 'Performance review for Q1 is due tomorrow',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: '3',
      title: 'System Maintenance',
      message: 'Scheduled maintenance tonight at 2 AM',
      time: '2 hours ago',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      {/* Sidebar */}
      <SidebarModern />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-80'}`}>
        {/* Top Navigation */}
        <Card variant="glass" rounded="none" className="sticky top-0 z-30 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => dispatch(toggleSidebar())}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Toggle sidebar"
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>

              {title && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Center Section - Search */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <Input
                placeholder="Search employees, documents..."
                variant="soft"
                icon={<Search className="w-4 h-4" />}
                className="w-full"
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Actions */}
              {actions && (
                <div className="hidden lg:block">
                  {actions}
                </div>
              )}

              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-soft-xl border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Notifications
                        </h3>
                        <span className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                          Mark all as read
                        </span>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                            notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                            }`} />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                {notification.title}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                {notification.message}
                              </p>
                              <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 text-center">
                      <Button variant="ghost" size="sm" fullWidth>
                        View All Notifications
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name || user?.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.role || 'Employee'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-soft-xl border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="p-2">
                      <Button variant="ghost" size="sm" fullWidth className="justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                      <Button variant="ghost" size="sm" fullWidth className="justify-start">
                        Settings
                      </Button>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        fullWidth 
                        className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Logout
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Click outside handlers */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayoutModern;
