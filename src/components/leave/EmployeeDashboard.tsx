import React, { useState, useEffect } from 'react';
import { User, LeaveBalance } from '../../types/leave';
import { apiService } from '../../services/leaveApi';
import Button from '../ui/Button';

const EmployeeDashboard: React.FC<{ user: User; onNavigate: (page: string) => void }> = ({ user, onNavigate }) => {
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const balances = await apiService.getLeaveBalances();
        setLeaveBalances(balances);
      } catch (error) {
        console.error('Error fetching leave balances:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBalances();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.first_name}!</h1>
        <p className="text-gray-600 mt-2">Manage your leave requests and view your balances</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {leaveBalances.map((balance) => (
          <div key={balance.leave_type} className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{balance.leave_type}</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {balance.remaining}/{balance.total}
            </div>
            <p className="text-sm text-gray-600">Days remaining</p>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(balance.remaining / balance.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <Button onClick={() => onNavigate('apply-leave')} className="flex-1 sm:flex-none">
          Apply for Leave
        </Button>
        <Button variant="secondary" onClick={() => onNavigate('leave-history')} className="flex-1 sm:flex-none">
          View Leave History
        </Button>
        <Button variant="secondary" onClick={() => onNavigate('view-holidays')} className="flex-1 sm:flex-none">
          View Holidays
        </Button>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
