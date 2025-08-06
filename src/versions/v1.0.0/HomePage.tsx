import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BarChart3,
  Calendar,
  AlertCircle,
  FileText,
  Clock,
  User,
  Plus,
  Eye,
  Target,
  ChevronRight
} from 'lucide-react';
import Sidebar from './Sidebar';

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
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

interface AnnouncementProps {
  title: string;
  description: string;
  date: string;
}

const AnnouncementCard: React.FC<AnnouncementProps> = ({ title, description, date }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
    >
      <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{date}</p>
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center space-x-3 w-full p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      <span className="text-sm font-medium text-gray-900 dark:text-white">{title}</span>
      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
    </motion.button>
  );
};

const HomePage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const announcements = [
    {
      title: 'New HR Policy Update',
      description: 'Please review the updated leave policy effective from next month.',
      date: '2024-01-15'
    },
    {
      title: 'Team Building Event',
      description: 'Join us for the quarterly team building event this Friday.',
      date: '2024-01-12'
    }
  ];

  const quickActions = [
    { title: 'Apply Leave', icon: Plus },
    { title: 'View Attendance', icon: Eye },
    { title: 'Create Ticket', icon: FileText },
    { title: 'View Profile', icon: User }
  ];

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    // Add navigation logic here
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome to MH-HR</h1>
        <p className="text-blue-100 text-lg">Your comprehensive Human Resource Management System</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <QuickStatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Announcements</h3>
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <AnnouncementCard key={index} {...announcement} />
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <QuickActionButton
                key={index}
                title={action.title}
                icon={action.icon}
                onClick={() => handleQuickAction(action.title)}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Calendar Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Calendar</h3>
          <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="p-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
          {/* Calendar days would be dynamically generated */}
          {Array.from({ length: 35 }, (_, i) => (
            <div
              key={i}
              className="p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded cursor-pointer"
            >
              {i < 31 ? i + 1 : ''}
            </div>
          ))}
        </div>
      </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
