import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LeaveBalanceWidgetProps {
  className?: string;
}

const LeaveBalanceWidget: React.FC<LeaveBalanceWidgetProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API
  const leaveBalance = {
    total: 24,
    used: 22,
    remaining: 2,
    paidLeave: 2
  };

  const handleApplyLeave = () => {
    navigate('/leave');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-500" />
          Leave balance
        </h3>
      </div>

      <div className="space-y-4">
        {/* Main Balance Display */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {leaveBalance.remaining}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Paid Leave
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Used: {leaveBalance.used}</span>
            <span>Total: {leaveBalance.total}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(leaveBalance.used / leaveBalance.total) * 100}%` }}
            />
          </div>
        </div>

        {/* Apply Leave Button */}
        <motion.button
          onClick={handleApplyLeave}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Apply Leave</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LeaveBalanceWidget;
