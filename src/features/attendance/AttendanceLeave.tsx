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
} from "lucide-react";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

interface LeaveRequest {
  id: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
}

interface AttendanceRecord {
  id: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
  status: "present" | "late" | "absent" | "half-day";
}

const AttendanceLeave: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("attendance");

  const leaveRequests: LeaveRequest[] = [
    {
      id: "1",
      employeeName: "John Doe",
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
      leaveType: "Sick Leave",
      startDate: "2024-02-10",
      endDate: "2024-02-12",
      days: 3,
      reason: "Medical appointment",
      status: "approved",
      appliedDate: "2024-02-08",
    },
    {
      id: "3",
      employeeName: "Mike Johnson",
      leaveType: "Personal Leave",
      startDate: "2024-02-20",
      endDate: "2024-02-20",
      days: 1,
      reason: "Personal matters",
      status: "rejected",
      appliedDate: "2024-02-18",
    },
  ];

  const attendanceRecords: AttendanceRecord[] = [
    {
      id: "1",
      employeeName: "John Doe",
      date: "2024-02-01",
      checkIn: "09:00",
      checkOut: "17:30",
      hoursWorked: 8.5,
      status: "present",
    },
    {
      id: "2",
      employeeName: "Sarah Wilson",
      date: "2024-02-01",
      checkIn: "09:15",
      checkOut: "17:45",
      hoursWorked: 8.5,
      status: "late",
    },
    {
      id: "3",
      employeeName: "Mike Johnson",
      date: "2024-02-01",
      checkIn: "09:00",
      checkOut: "13:00",
      hoursWorked: 4,
      status: "half-day",
    },
  ];

  const attendanceStats = [
    {
      title: "Present Today",
      value: "234",
      change: "+5%",
      changeType: "increase" as const,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Late Arrivals",
      value: "12",
      change: "-2",
      changeType: "decrease" as const,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Absent",
      value: "8",
      change: "+1",
      changeType: "increase" as const,
      icon: XCircle,
      color: "bg-red-500",
    },
    {
      title: "Pending Leaves",
      value: "15",
      change: "+3",
      changeType: "increase" as const,
      icon: AlertCircle,
      color: "bg-blue-500",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "present":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
      case "late":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "rejected":
      case "absent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "half-day":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                <span>Attendance & Leave Management</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track employee attendance, manage leave requests, and monitor
                time-off balances
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Leave Request</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
              {attendanceStats.map((stat, index) => {
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
                          {stat.change} from yesterday
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

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("attendance")}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  activeTab === "attendance"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Attendance Records
              </button>
              <button
                onClick={() => setActiveTab("leave")}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  activeTab === "leave"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Leave Requests
              </button>
            </div>

            {/* Attendance Records */}
            {activeTab === "attendance" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Today's Attendance
                  </h3>

                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title="Filter"
                    >
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
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Check In
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Check Out
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Hours
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
                      {attendanceRecords.map((record) => (
                        <tr
                          key={record.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                            {record.employeeName}
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {record.date}
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {record.checkIn}
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {record.checkOut}
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {record.hoursWorked}h
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                record.status
                              )}`}
                            >
                              {record.status.charAt(0).toUpperCase() +
                                record.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Leave Requests */}
            {activeTab === "leave" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Leave Requests
                  </h3>

                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title="Filter"
                    >
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
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                            {request.employeeName}
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {request.leaveType}
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
                                  <button
                                    type="button"
                                    className="p-1 text-green-600 hover:text-green-700 dark:text-green-400"
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    className="p-1 text-red-600 hover:text-red-700 dark:text-red-400"
                                    title="Reject"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                title="View Details"
                              >
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AttendanceLeave;
