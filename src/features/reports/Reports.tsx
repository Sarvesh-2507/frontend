import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Search,
  FileText,
  Download,
  Filter,
  Calendar,
  Eye,
  Settings,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

interface SubModule {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  description: string;
}

const Reports: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('employees');

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const subModules: SubModule[] = [
    {
      id: 'employees',
      name: 'Employee Reports',
      icon: Users,
      path: '/reports/employees',
      description: 'Comprehensive employee analytics and reports',
    },
    {
      id: 'attendance',
      name: 'Attendance Reports',
      icon: Clock,
      path: '/reports/attendance',
      description: 'Attendance patterns and analytics',
    },
    {
      id: 'payroll',
      name: 'Payroll Reports',
      icon: DollarSign,
      path: '/reports/payroll',
      description: 'Payroll summaries and cost analysis',
    },
    {
      id: 'performance',
      name: 'Performance Reports',
      icon: TrendingUp,
      path: '/reports/performance',
      description: 'Performance metrics and trends',
    },
    {
      id: 'recruitment',
      name: 'Recruitment Reports',
      icon: Search,
      path: '/reports/recruitment',
      description: 'Hiring analytics and recruitment metrics',
    },
    {
      id: 'custom',
      name: 'Custom Reports',
      icon: FileText,
      path: '/reports/custom',
      description: 'Create and manage custom reports',
    },
    {
      id: 'analytics',
      name: 'Dashboard Analytics',
      icon: BarChart3,
      path: '/reports/analytics',
      description: 'Advanced analytics and insights',
    },
  ];

  const reportTemplates = [
    {
      id: '1',
      name: 'Monthly Employee Summary',
      description: 'Comprehensive monthly employee report',
      category: 'Employee',
      lastGenerated: '2024-01-15',
      downloads: 45,
    },
    {
      id: '2',
      name: 'Attendance Trends',
      description: 'Weekly attendance patterns and trends',
      category: 'Attendance',
      lastGenerated: '2024-01-14',
      downloads: 32,
    },
    {
      id: '3',
      name: 'Payroll Cost Analysis',
      description: 'Quarterly payroll cost breakdown',
      category: 'Payroll',
      lastGenerated: '2024-01-10',
      downloads: 28,
    },
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Generate comprehensive reports and analyze HR metrics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FileText className="w-4 h-4" />
                <span>Create Report</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* Sub-module Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex space-x-1 overflow-x-auto">
              {subModules.map((module) => {
                const Icon = module.icon;
                const isActive = activeTab === module.id;
                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveTab(module.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{module.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">156</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">24</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Downloads</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">1,234</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900">
                  <Download className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">8</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Report Templates */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Report Templates</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Quick access to frequently used reports
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          Category: {template.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          Last generated: {template.lastGenerated}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {template.downloads} downloads
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
