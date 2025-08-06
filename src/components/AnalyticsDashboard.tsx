import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Clock,
  FileText,
  Activity,
  Building2,
  UserCheck,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Sidebar from './Sidebar';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ComponentType<any>;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon: Icon, color }) => {
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
          <div className="flex items-center mt-2">
            {changeType === 'positive' ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {change}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

const ChartPlaceholder: React.FC<{ title: string; type: 'bar' | 'pie'; icon: React.ComponentType<any> }> = ({ title, type, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
        <div className="text-center">
          {type === 'bar' ? (
            <BarChart3 className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
          ) : (
            <PieChart className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
          )}
          <p className="text-gray-500 dark:text-gray-400">{title} Visualization</p>
        </div>
      </div>
    </motion.div>
  );
};

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      title: 'New HR Policy Update',
      description: 'Please review the updated leave policy effective from next month.',
      time: '2024-01-15',
      type: 'policy'
    },
    {
      id: 2,
      title: 'Team Building Event',
      description: 'Join us for the quarterly team building event this Friday.',
      time: '2024-01-12',
      type: 'event'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
        <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex-shrink-0">
              {activity.type === 'policy' ? (
                <FileText className="w-5 h-5 text-blue-500" />
              ) : (
                <Users className="w-5 h-5 text-green-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.description}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const AnalyticsDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const metrics = [
    {
      title: 'Total employees',
      value: '352',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Number of leave',
      value: '22',
      change: '-10%',
      changeType: 'negative' as const,
      icon: Calendar,
      color: 'bg-red-500'
    },
    {
      title: 'New employees',
      value: '32',
      change: '+12%',
      changeType: 'positive' as const,
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      title: 'Happiness rate',
      value: '82%',
      change: '-1%',
      changeType: 'negative' as const,
      icon: Activity,
      color: 'bg-orange-500'
    },
    {
      title: 'Organization',
      value: '8',
      change: '+2%',
      changeType: 'positive' as const,
      icon: Building2,
      color: 'bg-purple-500'
    },
    {
      title: 'Open Tickets',
      value: '12',
      change: '+3%',
      changeType: 'positive' as const,
      icon: AlertCircle,
      color: 'bg-red-500'
    },
    {
      title: 'Completed Tasks',
      value: '156',
      change: '+8%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Budget',
      value: '$45.2K',
      change: '+5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Deep dive into your organization's performance metrics, trends, and detailed analytics.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Export
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Attendance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Average Team KPI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Team KPI</h3>
            <span className="text-xs text-gray-500">Monthly</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">84.45%</div>
          <div className="flex items-center text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">+5.2%</span>
          </div>
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div className="h-2 bg-blue-500 rounded-full" style={{ width: '84.45%' }}></div>
          </div>
        </motion.div>

        {/* Attendance Overview Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Overview</h3>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">On Time</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-300 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Late</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Absent</span>
              </div>
            </div>
          </div>
          <div className="h-48 flex items-end justify-center space-x-2">
            {/* Attendance bars for each day */}
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="flex flex-col items-center space-y-1">
                <div className="flex flex-col space-y-1">
                  <div className="w-8 bg-orange-500 rounded-t" style={{ height: `${60 + Math.random() * 40}px` }}></div>
                  <div className="w-8 bg-blue-300 rounded" style={{ height: `${20 + Math.random() * 20}px` }}></div>
                  <div className="w-8 bg-gray-300 rounded-b" style={{ height: `${10 + Math.random() * 15}px` }}></div>
                </div>
                <span className="text-xs text-gray-500">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Calendar with Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 h-fit"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule</h3>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                <Plus className="w-4 h-4" />
              </button>
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-3">
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <span className="text-sm font-medium text-gray-900 dark:text-white">June 2027</span>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="p-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
            {/* Calendar days with events */}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i < 31 ? i + 1 : '';
              const isToday = day === 19; // June 19th as today
              const hasEvent = [15, 19, 25].includes(day as number);
              return (
                <div
                  key={i}
                  className={`relative p-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded cursor-pointer transition-colors ${
                    isToday ? 'bg-blue-500 text-white font-semibold' : ''
                  }`}
                >
                  {day}
                  {hasEvent && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Today's Events */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">19 June 2027</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Strategy Meeting</span>
                <span className="text-gray-500 text-xs ml-auto">9:00 AM</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Team Review</span>
                <span className="text-gray-500 text-xs ml-auto">2:00 PM</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-xs">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Marketing Strategy Session</span>
                <span className="text-gray-500 text-xs ml-auto">4:00 PM</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Attendance</h3>
            <BarChart3 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="h-48 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Monthly Attendance Chart</p>
            </div>
          </div>
        </motion.div>

        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Department Distribution</h3>
            <PieChart className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="h-48 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Department Distribution Chart</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
