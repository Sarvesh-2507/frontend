import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  BarChart3,
  PieChart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

interface LeaveBalance {
  id: string;
  leaveType: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  pendingDays: number;
  carryForward: number;
  expiryDate?: string;
  description: string;
  color: string;
}

interface LeaveTransaction {
  id: string;
  date: string;
  leaveType: string;
  type: "used" | "added" | "expired" | "carried_forward";
  days: number;
  description: string;
  status: "approved" | "pending" | "rejected";
}

interface LeavePolicy {
  leaveType: string;
  maxCarryForward: number;
  maxConsecutiveDays: number;
  advanceNotice: number;
  canCarryForward: boolean;
  expiryPolicy: string;
}

const LeaveBalance: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [leaveTransactions, setLeaveTransactions] = useState<
    LeaveTransaction[]
  >([]);
  const [leavePolicies, setLeavePolicies] = useState<LeavePolicy[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const periods = [
    { value: "current", label: "Current Year" },
    { value: "previous", label: "Previous Year" },
    { value: "next", label: "Next Year" },
  ];

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: Replace with real API calls
      setLeaveBalances([]);
      setLeaveTransactions([]);
      setLeavePolicies([]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalDays = () => {
    return leaveBalances.reduce(
      (total, balance) => total + balance.totalDays,
      0
    );
  };

  const getUsedDays = () => {
    return leaveBalances.reduce(
      (total, balance) => total + balance.usedDays,
      0
    );
  };

  const getRemainingDays = () => {
    return leaveBalances.reduce(
      (total, balance) => total + balance.remainingDays,
      0
    );
  };

  const getPendingDays = () => {
    return leaveBalances.reduce(
      (total, balance) => total + balance.pendingDays,
      0
    );
  };

  const getUtilizationRate = () => {
    const total = getTotalDays();
    const used = getUsedDays();
    return total > 0 ? Math.round((used / total) * 100) : 0;
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "used":
        return "text-red-600 bg-red-100";
      case "added":
        return "text-green-600 bg-green-100";
      case "expired":
        return "text-gray-600 bg-gray-100";
      case "carried_forward":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const exportReport = () => {
    const csvContent = `Leave Type,Total Days,Used Days,Remaining Days,Pending Days,Carry Forward,Utilization %
${leaveBalances
  .map(
    (balance) =>
      `${balance.leaveType},${balance.totalDays},${balance.usedDays},${
        balance.remainingDays
      },${balance.pendingDays},${balance.carryForward},${Math.round(
        (balance.usedDays / balance.totalDays) * 100
      )}%`
  )
  .join("\n")}`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leave_balance_${selectedPeriod}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/leave")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Leave Balance
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  View your current leave entitlements and usage
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
              <button
                onClick={exportReport}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Entitlement
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getTotalDays()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      days
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-500">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Used
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getUsedDays()}
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {getUtilizationRate()}% utilized
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Remaining
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getRemainingDays()}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      available
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getPendingDays()}
                    </p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      awaiting approval
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-500">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Leave Balance Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Balance Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Leave Balance Breakdown
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    leaveBalances.map((balance) => (
                      <div
                        key={balance.id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded ${balance.color}`}
                            ></div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {balance.leaveType}
                            </h4>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {balance.remainingDays}/{balance.totalDays} days
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Used
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {balance.usedDays} days
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Remaining
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {balance.remainingDays} days
                            </span>
                          </div>
                          {balance.pendingDays > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                Pending
                              </span>
                              <span className="text-yellow-600 dark:text-yellow-400">
                                {balance.pendingDays} days
                              </span>
                            </div>
                          )}
                          {balance.carryForward > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                Carry Forward
                              </span>
                              <span className="text-blue-600 dark:text-blue-400">
                                {balance.carryForward} days
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${balance.color}`}
                            style={{
                              width: `${
                                (balance.usedDays / balance.totalDays) * 100
                              }%`,
                            }}
                          ></div>
                        </div>

                        {balance.expiryDate && (
                          <div className="mt-2 flex items-center space-x-1 text-xs text-orange-600 dark:text-orange-400">
                            <AlertCircle className="w-3 h-3" />
                            <span>
                              Expires:{" "}
                              {new Date(
                                balance.expiryDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Recent Transactions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Transactions
                  </h3>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {leaveTransactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {transaction.leaveType}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getTransactionTypeColor(
                                transaction.type
                              )}`}
                            >
                              {transaction.type.replace("_", " ")}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.type === "used" ? "-" : "+"}
                            {transaction.days} days
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Leave Policies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Leave Policies
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Leave Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Max Carry Forward
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Max Consecutive
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Advance Notice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Expiry Policy
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {leavePolicies.map((policy, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {policy.leaveType}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {policy.canCarryForward
                            ? `${policy.maxCarryForward} days`
                            : "Not allowed"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {policy.maxConsecutiveDays} days
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {policy.advanceNotice > 0
                            ? `${policy.advanceNotice} days`
                            : "Not required"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {policy.expiryPolicy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Important Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6"
            >
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Important Information
                  </h4>
                  <ul className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>
                      • Leave balances are updated in real-time as applications
                      are approved
                    </li>
                    <li>
                      • Carry forward limits apply at the end of each calendar
                      year
                    </li>
                    <li>
                      • Some leave types may expire if not used within the
                      specified period
                    </li>
                    <li>
                      • Contact HR for any discrepancies in your leave balance
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Important Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6"
            >
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Important Information
                  </h4>
                  <ul className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>
                      • Leave balances are updated in real-time as applications
                      are approved
                    </li>
                    <li>
                      • Carry forward limits apply at the end of each calendar
                      year
                    </li>
                    <li>
                      • Some leave types may expire if not used within the
                      specified period
                    </li>
                    <li>
                      • Contact HR for any discrepancies in your leave balance
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeaveBalance;
