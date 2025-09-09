import React from 'react';
import { Zap, FileText, Calendar, DollarSign } from 'lucide-react';

const quickActions = [
  { label: 'Apply Leave', icon: FileText, path: '/emp-home/leave' },
  { label: 'View Attendance', icon: Calendar, path: '/emp-home/attendance' },
  { label: 'Download Payslip', icon: DollarSign, path: '/emp-home/payroll' },
  { label: 'Update Profile', icon: Zap, path: '/emp-home/profile' },
];

const QuickActionsEmployee: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
      <Zap className="w-5 h-5 text-blue-500" /> Quick Actions
    </h3>
    <div className="flex flex-wrap gap-3">
      {quickActions.map((action, i) => (
        <a
          key={i}
          href={action.path}
          className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/40 rounded-lg text-blue-700 dark:text-blue-200 font-medium hover:bg-blue-100 dark:hover:bg-blue-800 transition"
        >
          <action.icon className="w-4 h-4" />
          {action.label}
        </a>
      ))}
    </div>
  </div>
);

export default QuickActionsEmployee;
