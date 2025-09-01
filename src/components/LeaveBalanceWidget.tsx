import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LeaveBalanceWidgetProps {
  className?: string;
}

const LeaveBalanceWidget: React.FC<LeaveBalanceWidgetProps> = ({ className = '' }) => {
  const navigate = useNavigate();


    const [leaveBalances, setLeaveBalances] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchBalances = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch('http://192.168.1.132:8000/api/leave/leave-balances/');
          const data = await response.json();
          setLeaveBalances(Array.isArray(data.results) ? data.results : []);
        } catch (err) {
          setError('Failed to fetch leave balances');
        } finally {
          setLoading(false);
        }
      };
      fetchBalances();
    }, []);

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
          Leave Balance
        </h3>
      </div>
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : leaveBalances.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">No leave balances found.</div>
      ) : (
        <div className="space-y-4">
          {leaveBalances.map((balance) => (
            <div key={balance.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {balance.leave_type_display || balance.leave_type}
                  <span className="ml-2 text-xs text-gray-500">({balance.year})</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Allocated: <span className="font-medium">{balance.total_allocated}</span>
                  {balance.carried_forward && (
                    <span> | Carried Forward: <span className="font-medium">{balance.carried_forward}</span></span>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Used: <span className="font-medium">{balance.used}</span></span>
                <span>Pending: <span className="font-medium">{balance.pending}</span></span>
                <span>Available: <span className="font-medium">{balance.available}</span></span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(parseFloat(balance.used) / parseFloat(balance.total_allocated)) * 100}%` }}
                />
              </div>
            </div>
          ))}
          <motion.button
            onClick={handleApplyLeave}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 mt-4"
          >
            <Plus className="w-4 h-4" />
            <span>Apply Leave</span>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default LeaveBalanceWidget;
