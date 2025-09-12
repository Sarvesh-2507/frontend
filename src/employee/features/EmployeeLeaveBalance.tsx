import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Info,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../services/leaveApi";
import { LeaveBalance } from "../../types/leave";
import { useAuthStore } from "../../context/authStore";
import toast from "react-hot-toast";

interface LeaveUsageStats {
  month: string;
  used: number;
  available: number;
}

const EmployeeLeaveBalance: React.FC = () => {
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [usageStats, setUsageStats] = useState<LeaveUsageStats[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const navigate = useNavigate();
  const { getCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const user = getCurrentUser();

      if (!token || !user) {
        navigate("/login");
        return;
      }

      setCurrentUser(user);

      // Fetch leave balance for the logged-in employee
      const balance = await apiService.getLeaveBalances(
        parseInt(user.id),
        token
      );

      // If the response is a single object, wrap it in an array
      if (Array.isArray(balance)) {
        setLeaveBalances(balance);
      } else if (balance && typeof balance === "object") {
        setLeaveBalances([balance]);
      } else {
        setLeaveBalances([]);
      }

      // Generate mock usage stats for the selected year
      generateUsageStats();
    } catch (error) {
      console.error("Error fetching leave balances:", error);
      toast.error("Failed to fetch leave balances");
      setLeaveBalances([]);
    } finally {
      setLoading(false);
    }
  };

  const generateUsageStats = () => {
    // Mock data generation for monthly usage stats
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const stats = months.map(month => ({
      month,
      used: Math.floor(Math.random() * 3) + 1, // Random usage between 1-3 days
      available: Math.floor(Math.random() * 5) + 15, // Random available between 15-20 days
    }));

    setUsageStats(stats);
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await fetchData();
      toast.success("Leave balance refreshed");
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  const exportData = () => {
    // Mock export functionality
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `leave_balance_${selectedYear}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Leave balance exported successfully");
  };

  const generateCSVContent = () => {
    const headers = ["Leave Type", "Total Allocated", "Used", "Available", "Pending", "Carried Forward"];
    const rows = leaveBalances.map(balance => [
      balance.leave_type_display || balance.leave_type,
      balance.total_allocated || 0,
      balance.used || 0,
      balance.available || 0,
      balance.pending || 0,
      balance.carried_forward || 0,
    ]);

    return [headers, ...rows].map(row => row.join(",")).join("\n");
  };

  const calculateTotalDays = () => {
    return leaveBalances.reduce((total, balance) => total + Number(balance.total_allocated || 0), 0);
  };

  const calculateUsedDays = () => {
    return leaveBalances.reduce((total, balance) => total + Number(balance.used || 0), 0);
  };

  const calculateAvailableDays = () => {
    return leaveBalances.reduce((total, balance) => total + Number(balance.available || 0), 0);
  };

  const calculatePendingDays = () => {
    return leaveBalances.reduce((total, balance) => total + Number(balance.pending || 0), 0);
  };

  const getUsagePercentage = (balance: LeaveBalance) => {
    const total = Number(balance.total_allocated || 0);
    const used = Number(balance.used || 0);
    return total > 0 ? Math.round((used / total) * 100) : 0;
  };

  const getAvailabilityColor = (balance: LeaveBalance) => {
    const available = Number(balance.available || 0);
    const total = Number(balance.total_allocated || 0);
    const percentage = total > 0 ? (available / total) * 100 : 0;

    if (percentage >= 70) return "text-green-600";
    if (percentage >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/emp-home/leave")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Leave Balance
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View your leave entitlements and usage
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => navigate("/emp-home/leave/application")}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Apply Leave</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Allocated
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {calculateTotalDays()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Days Used
              </p>
              <p className="text-2xl font-bold text-red-600">
                {calculateUsedDays()}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Available
              </p>
              <p className="text-2xl font-bold text-green-600">
                {calculateAvailableDays()}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Approval
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {calculatePendingDays()}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Leave Balance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Leave Balance Breakdown
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading leave balances...</p>
          </div>
        ) : leaveBalances.length === 0 ? (
          <div className="p-8 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No leave balance found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your leave balance information is not available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total Allocated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Used
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pending
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Carried Forward
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Usage %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {leaveBalances.map((balance) => (
                  <tr key={balance.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {balance.leave_type_display || balance.leave_type}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {balance.leave_type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {balance.total_allocated || 0} days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-red-600">
                        {balance.used || 0} days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getAvailabilityColor(balance)}`}>
                        {balance.available || 0} days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-yellow-600">
                        {balance.pending || 0} days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {balance.carried_forward || 0} days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                getUsagePercentage(balance) >= 80
                                  ? "bg-red-500"
                                  : getUsagePercentage(balance) >= 50
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${getUsagePercentage(balance)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          {getUsagePercentage(balance)}%
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Usage Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Usage Trends ({selectedYear})
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Info className="w-4 h-4" />
              <span>Estimated data for visualization</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-12 gap-2">
            {usageStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {stat.month}
                </div>
                <div className="flex flex-col space-y-1">
                  <div
                    className="bg-blue-200 dark:bg-blue-800 rounded"
                    style={{ height: `${Math.max(stat.available * 2, 10)}px` }}
                    title={`Available: ${stat.available} days`}
                  ></div>
                  <div
                    className="bg-red-200 dark:bg-red-800 rounded"
                    style={{ height: `${Math.max(stat.used * 8, 5)}px` }}
                    title={`Used: ${stat.used} days`}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {stat.used}/{stat.available}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-200 dark:bg-blue-800 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-200 dark:bg-red-800 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Used</span>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Leave Balance Information
            </h4>
            <ul className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Leave balances are updated in real-time upon approval</li>
              <li>• Unused annual leave may be carried forward as per company policy</li>
              <li>• Pending requests are not deducted from available balance until approved</li>
              <li>• Contact HR for any discrepancies in your leave balance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveBalance;
