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
  DollarSign
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
    { title: 'Apply Leave', icon: Plus, path: '/leave' },
    { title: 'View Attendance', icon: Eye, path: '/attendance' },
    { title: 'Create Ticket', icon: FileText, path: '/help-desk' },
    { title: 'View Profile', icon: User, path: '/employee-profile' },
    { title: 'Manage Organizations', icon: Building2, path: '/organizations' },
    { title: 'Employee Directory', icon: Users, path: '/employee-profile' },
    { title: 'Payroll Management', icon: DollarSign, path: '/payroll' },
    { title: 'Performance Reviews', icon: BarChart3, path: '/performance' }
  ];

  const handleQuickAction = (path: string) => {
    navigate(path);
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
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl font-bold mb-2 relative z-10"
        >
          Welcome to MH-HR
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-blue-100 text-lg relative z-10"
        >
          Your comprehensive Human Resource Management System
        </motion.p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {quickStats.map((stat, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <QuickStatsCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

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
                onClick={() => handleQuickAction(action.path)}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Compact Calendar Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 max-w-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Calendar</h3>
          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="p-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
          {/* Calendar days - compact version */}
          {Array.from({ length: 35 }, (_, i) => {
            const day = i < 31 ? i + 1 : '';
            const isToday = day === new Date().getDate();
            return (
              <div
                key={i}
                className={`p-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded cursor-pointer transition-colors ${
                  isToday ? 'bg-blue-500 text-white font-semibold' : ''
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </motion.div>
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
    </div>
  );
};

export default HomePage;
