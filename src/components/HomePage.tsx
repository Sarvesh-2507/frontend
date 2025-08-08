import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BarChart3,
  Calendar,
  AlertCircle,
  FileText,
  User,
  Plus,
  Eye,
  ChevronRight,
  Building2,
  DollarSign,
  Search,
  ArrowLeft
} from 'lucide-react';
import Sidebar from './Sidebar';
import QuickEmployeeDirectory from './QuickEmployeeDirectory';
import RecentAnnouncements from './RecentAnnouncements';
import ScheduleComponent from './ScheduleComponent';
import CompanyFeeds from './CompanyFeeds';
import GlobalSearchHeader from './GlobalSearchHeader';
import BackButton from './ui/BackButton';
import LeaveBalanceWidget from './LeaveBalanceWidget';
import YesterdayAttendanceWidget from './YesterdayAttendanceWidget';

interface QuickStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
}

const QuickStatsCard: React.FC<QuickStatsCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-2xl font-bold text-gray-900 dark:text-white mt-2"
          >
            {value}
          </motion.p>
        </div>
        <motion.div
          className={`p-3 rounded-lg ${color}`}
          whileHover={{ rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
};



interface QuickActionProps {
  title: string;
  icon: React.ComponentType<any>;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionProps> = ({ title, icon: Icon, onClick }) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.02,
        x: 5,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center space-x-3 w-full p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group"
    >
      <motion.div
        whileHover={{ rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
      </motion.div>
      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors">{title}</span>
      <motion.div
        whileHover={{ x: 3 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="ml-auto"
      >
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </motion.div>
    </motion.button>
  );
};

const HomePage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showEmployeeDirectory, setShowEmployeeDirectory] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const quickStats = [
    {
      title: 'Total Employees',
      value: '352',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Projects',
      value: '24',
      icon: BarChart3,
      color: 'bg-green-500'
    },
    {
      title: 'Pending Leaves',
      value: '8',
      icon: Calendar,
      color: 'bg-orange-500'
    },
    {
      title: 'Open Tickets',
      value: '12',
      icon: AlertCircle,
      color: 'bg-red-500'
    }
  ];



  const quickActions = [
    { title: 'Leave Management', icon: Plus, path: '/leave' },
    { title: 'View Attendance', icon: Eye, path: '/attendance' },
    { title: 'Manage Organizations', icon: Building2, path: '/organizations' },
    { title: 'Employee Directory', icon: Users, path: '/employee-profile' },
    { title: 'Payroll Management', icon: DollarSign, path: '/payroll' },
    { title: 'Performance Reviews', icon: BarChart3, path: '/performance' }
  ];

  // Get current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return now.toLocaleDateString('en-US', options);
  };

  // Mock last punch data - in real app, this would come from API
  const lastPunchTime = "09:15 AM";

  const handleQuickAction = (path: string, title: string) => {
    if (title === 'Employee Directory') {
      setShowEmployeeDirectory(true);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header with Search */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <GlobalSearchHeader onNavigate={navigate} />
          </motion.div>

          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            whileHover={{
              scale: 1.01,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
            }}
            className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 rounded-xl p-8 text-white relative overflow-hidden cursor-pointer"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }}
            />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-3xl font-bold mb-2"
                >
                  Welcome to MH-HR, Tamil
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-blue-100 text-lg"
                >
                  Hope you are having a great day.
                </motion.p>
              </div>
              <div className="text-right">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-blue-100"
                >
                  <div className="text-sm font-medium">{getCurrentDateTime()}</div>
                  <div className="text-xs mt-1">Last punch: {lastPunchTime}</div>
                </motion.div>
              </div>
            </div>
          </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Left Sidebar - Quick Actions & Recent Announcements */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <QuickActionButton
                  key={index}
                  title={action.title}
                  icon={action.icon}
                  onClick={() => handleQuickAction(action.path, action.title)}
                />
              ))}
            </div>
          </motion.div>

          {/* Recent Announcements */}
          <RecentAnnouncements />
        </div>

        {/* Center - Company Feeds */}
        <div className="lg:col-span-2">
          <CompanyFeeds />
        </div>

        {/* Right Sidebar - Schedule and Widgets */}
        <div className="space-y-6">
          <ScheduleComponent />
          <LeaveBalanceWidget />
          <YesterdayAttendanceWidget />
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)"
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/organizations/create')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Quick Employee Directory Modal */}
      <QuickEmployeeDirectory
        isOpen={showEmployeeDirectory}
        onClose={() => setShowEmployeeDirectory(false)}
      />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
