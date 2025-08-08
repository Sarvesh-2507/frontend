import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import BackButton from '../../components/ui/BackButton';

const HRProfile: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // Mock HR details - replace with real API later
  const hr = {
    name: 'HR',
    role: 'Human Resources',
    email: 'hr@mhcognition.com',
    phone: '+1 (555) 123-4567',
    employeeId: 'HR-0001',
    department: 'Human Resources',
    location: 'Coimbatore, TN',
    joined: '2020-03-15',
    permissions: ['Leave Approvals', 'Employee Management', 'Announcements', 'Payroll Access']
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center space-x-4">
            <BackButton variant="home" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <User className="w-8 h-8 text-blue-600" />
                <span>HR Profile</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">View HR details and permissions</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left card: avatar and basics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  HR
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{hr.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{hr.role}</p>

                <div className="mt-6 space-y-3 w-full">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{hr.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{hr.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{hr.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right card: details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Employee ID</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{hr.employeeId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{hr.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{new Date(hr.joined).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{hr.role}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-blue-500" /> Permissions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hr.permissions.map((p) => (
                    <span key={p} className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HRProfile;
