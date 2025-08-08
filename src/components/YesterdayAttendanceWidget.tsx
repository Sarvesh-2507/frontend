import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';

interface YesterdayAttendanceWidgetProps {
  className?: string;
}

const YesterdayAttendanceWidget: React.FC<YesterdayAttendanceWidgetProps> = ({ className = '' }) => {
  // Mock data - in real app, this would come from API
  const attendanceData = {
    date: 'Yesterday',
    inTime: '09:15 AM',
    outTime: '06:30 PM',
    totalHours: '8h 45m',
    status: 'Present'
  };

  const formatTime = (time: string) => {
    return time || '-';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Clock className="w-5 h-5 mr-2 text-green-500" />
          Yesterday's attendance
        </h3>
      </div>

      <div className="space-y-4">
        {/* Time Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">In-time</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatTime(attendanceData.inTime)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Out-time</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatTime(attendanceData.outTime)}
            </div>
          </div>
        </div>

        {/* Total Working Hours */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total working hours</span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {attendanceData.totalHours}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            attendanceData.status === 'Present' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {attendanceData.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default YesterdayAttendanceWidget;
