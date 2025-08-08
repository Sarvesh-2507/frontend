import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  Plus,
  XCircle,
  ArrowLeft,
  Search,
  Users,
  BarChart3,
  FileText,
  History,
  CreditCard,
  UserCheck,
  TrendingUp,
  CalendarDays,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "../../components/Sidebar";
import Logo from "../../components/ui/Logo";
import BackButton from "../../components/ui/BackButton";
import { dashboardAPI } from "../../services/api";

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  approver?: string;
  department?: string;
  priority?: "low" | "medium" | "high";
}

interface SubModule {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  description: string;
  count?: number;
}

interface LeaveStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalLeaveDays: number;
  averageLeavePerEmployee: number;
}

interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  annualLeave: number;
  sickLeave: number;
  casualLeave: number;
  maternityLeave?: number;
  usedAnnual: number;
  usedSick: number;
  usedCasual: number;
}

const Leave: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeSubModule, setActiveSubModule] = useState("application");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<LeaveStats>({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalLeaveDays: 0,
    averageLeavePerEmployee: 0,
  });
  const navigate = useNavigate();

  const subModules: SubModule[] = [
    {
      id: "application",
      name: "Leave Application",
      icon: FileText,
      path: "/leave/application",
      description: "Apply for leave",
    },
    {
      id: "history",
      name: "Application History",
      icon: History,
      path: "/leave/history",
      description: "View leave application history",
      count: stats.totalRequests,
    },
    {
      id: "balance",
      name: "Leave Balance",
      icon: CreditCard,
      path: "/leave/balance",
      description: "Check current leave balance",
    },
    {
      id: "approval",
      name: "Leave Approval",
      icon: UserCheck,
      path: "/leave/approval",
      description: "Approve/reject leave requests",
      count: stats.pendingRequests,
    },
    {
      id: "requests",
      name: "View Requests",
      icon: Eye,
      path: "/leave/requests",
      description: "View all leave requests",
    },
    {
      id: "summary",
      name: "Leave Summary",
      icon: BarChart3,
      path: "/leave/summary",
      description: "Generate leave reports",
    },
  ];

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStats();
      if (response.data) {
        setStats({
          totalRequests: response.data.data?.totalLeaveRequests || leaveRequests.length,
          pendingRequests: response.data.data?.pendingLeaveRequests || leaveRequests.filter(r => r.status === 'pending').length,
          approvedRequests: response.data.data?.approvedLeaveRequests || leaveRequests.filter(r => r.status === 'approved').length,
          rejectedRequests: response.data.data?.rejectedLeaveRequests || leaveRequests.filter(r => r.status === 'rejected').length,
          totalLeaveDays: response.data.data?.totalLeaveDays || leaveRequests.reduce((sum, r) => sum + r.days, 0),
          averageLeavePerEmployee: response.data.data?.averageLeavePerEmployee || 12.5,
        });
      }
      toast.success("Leave data loaded successfully");
    } catch (error) {
      console.error("Error fetching leave data:", error);
      setStats({
        totalRequests: leaveRequests.length,
        pendingRequests: leaveRequests.filter(r => r.status === 'pending').length,
        approvedRequests: leaveRequests.filter(r => r.status === 'approved').length,
        rejectedRequests: leaveRequests.filter(r => r.status === 'rejected').length,
        totalLeaveDays: leaveRequests.reduce((sum, r) => sum + r.days, 0),
        averageLeavePerEmployee: 12.5,
      });
      toast.error("Using offline data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubModuleClick = (subModule: SubModule) => {
    setActiveSubModule(subModule.id);
    navigate(subModule.path);
  };

  const handleApplyLeave = () => {
    navigate("/leave/application");
  };

  const leaveRequests: LeaveRequest[] = [
    {
      id: "1",
      employeeName: "John Doe",
      employeeId: "EMP001",
      leaveType: "Annual Leave",
      startDate: "2024-02-15",
      endDate: "2024-02-17",
      days: 3,
      reason: "Family vacation",
      status: "pending",
      appliedDate: "2024-02-01",
    },
    {
      id: "2",
      employeeName: "Sarah Wilson",
      employeeId: "EMP002",
      leaveType: "Sick Leave",
      startDate: "2024-02-10",
      endDate: "2024-02-12",
      days: 3,
      reason: "Medical appointment",
      status: "approved",
      appliedDate: "2024-02-08",
      approver: "Mike Johnson",
    },
    {
      id: "3",
      employeeName: "Emily Davis",
      employeeId: "EMP004",
      leaveType: "Personal Leave",
      startDate: "2024-02-20",
      endDate: "2024-02-20",
      days: 1,
      reason: "Personal matters",
      status: "rejected",
      appliedDate: "2024-02-18",
      approver: "Mike Johnson",
    },
  ];

  const leaveStats = [
    {
      title: "Pending Requests",
      value: "15",
      change: "+3",
      changeType: "increase" as const,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Approved This Month",
      value: "42",
      change: "+8",
      changeType: "increase" as const,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Rejected",
      value: "5",
      change: "+1",
      changeType: "increase" as const,
      icon: XCircle,
      color: "bg-red-500",
    },
    {
      title: "Total Days Off",
      value: "156",
      change: "+24",
      changeType: "increase" as const,
      icon: Calendar,
      color: "bg-blue-500",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "Annual Leave":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Sick Leave":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "Personal Leave":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "Maternity Leave":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="header-modern px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackButton variant="home" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                  <Calendar className="w-8 h-8 text-green-600" />
                  <span>Leave Management</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage employee leave requests, approvals, and time-off balances
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Leave Request</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {leaveStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="stat-card"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p
                          className={`text-sm ${
                            stat.changeType === "increase"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {stat.change} this month
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Leave Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Leave Requests
                </h3>

                <div className="flex items-center space-x-4">
                  <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Employee
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Leave Type
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Duration
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Days
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Reason
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((request) => (
                      <tr
                        key={request.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                                {request.employeeName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {request.employeeName}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {request.employeeId}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(
                              request.leaveType
                            )}`}
                          >
                            {request.leaveType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {request.startDate} - {request.endDate}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {request.days}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {request.reason}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {request.status === "pending" && (
                              <>
                                <button className="p-1 text-green-600 hover:text-green-700 dark:text-green-400">
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-red-600 hover:text-red-700 dark:text-red-400">
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="card p-6 text-center"
              >
                <Plus className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Apply for Leave
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Submit a new leave request
                </p>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Apply Now
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="card p-6 text-center"
              >
                <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Leave Calendar
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  View team leave calendar
                </p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View Calendar
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="card p-6 text-center"
              >
                <AlertCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Leave Balance
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Check leave balances
                </p>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  View Balances
                </button>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leave;
