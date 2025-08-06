import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Plus,
  Shield,
  DollarSign,
  BarChart3,
  Settings,
  Users,
  Calendar,
  FileText,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';

const Benefits: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Benefits & Compensation</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage employee benefits, compensation packages, and enrollment
              </p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Benefit</span>
            </button>
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Benefits</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">12</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Enrolled Employees</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">284</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Cost</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">$45,230</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900">
                  <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Enrollment Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">89%</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Benefits Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Benefits Overview</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage and track employee benefits and compensation packages
              </p>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Benefits Management System
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Comprehensive benefits and compensation management features will be available here.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Benefits Enrollment</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Manage employee benefit enrollments
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <Shield className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Health Insurance</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Track health insurance coverage
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <DollarSign className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Retirement Plans</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Manage retirement benefit plans
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
