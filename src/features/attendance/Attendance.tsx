import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  Plus,
  Users,
  XCircle,
  BarChart3,
  Upload,
  Edit,
  CalendarDays,
  TrendingUp,
  FileSpreadsheet,
  Settings,
  MapPin,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Sidebar from "../../components/Sidebar";
import Logo from "../../components/ui/Logo";
import { dashboardAPI } from "../../services/api";

interface AttendanceRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
  status: "present" | "late" | "absent" | "half-day" | "overtime";
  location: string;
  department?: string;
  breakTime?: number;
  overtime?: number;
}

interface SubModule {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  description: string;
  count?: number;
}

interface AttendanceStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  averageHours: number;
  overtimeHours: number;
}

const Attendance: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [activeSubModule, setActiveSubModule] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AttendanceStats>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    averageHours: 0,
    overtimeHours: 0,
  });
  const navigate = useNavigate();

  const subModules: SubModule[] = [
    {
      id: "daily",
      name: "Daily View",
      icon: Calendar,
      path: "/attendance/daily",
      description: "View daily attendance records",
      count: stats.presentToday,
    },
    {
      id: "monthly",
      name: "Monthly Calendar",
      icon: CalendarDays,
      path: "/attendance/monthly",
      description: "Monthly attendance overview",
    },
    {
      id: "summary",
      name: "Summary Report",
      icon: BarChart3,
      path: "/attendance/summary",
      description: "Generate attendance reports",
    },
    {
      id: "manual-update",
      name: "Manual Update",
      icon: Edit,
      path: "/attendance/manual-update",
      description: "Update attendance manually",
    },
    {
      id: "import",
      name: "Import Data",
      icon: Upload,
      path: "/attendance/import",
      description: "Import attendance from Excel/CSV",
    },
    {
      id: "holidays",
      name: "Holiday Calendar",
      icon: Calendar,
      path: "/attendance/holidays",
      description: "Manage holiday calendar",
    },
    {
      id: "metrics",
      name: "Metrics Dashboard",
      icon: TrendingUp,
      path: "/attendance/metrics",
      description: "View attendance analytics",
    },
  ];

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedDate]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      // Fetch attendance data from backend
      const response = await dashboardAPI.getStats();
      if (
        response.data &&
        typeof response.data === 'object' &&
        'totalEmployees' in response.data &&
        'presentToday' in response.data &&
        'absentToday' in response.data &&
        'lateToday' in response.data &&
        'averageHours' in response.data &&
        'overtimeHours' in response.data
      ) {
        const statsData = response.data as AttendanceStats;
        setStats({
          totalEmployees: statsData.totalEmployees || attendanceRecords.length,
          presentToday: statsData.presentToday || attendanceRecords.filter(r => r.status === 'present').length,
          absentToday: statsData.absentToday || attendanceRecords.filter(r => r.status === 'absent').length,
          lateToday: statsData.lateToday || attendanceRecords.filter(r => r.status === 'late').length,
          averageHours: statsData.averageHours || 8.2,
          overtimeHours: statsData.overtimeHours || attendanceRecords.filter(r => r.status === 'overtime').length,
        });
      }
      toast.success("Attendance data loaded successfully");
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      // Use mock data as fallback
      setStats({
        totalEmployees: attendanceRecords.length,
        presentToday: attendanceRecords.filter(r => r.status === 'present').length,
        absentToday: attendanceRecords.filter(r => r.status === 'absent').length,
        lateToday: attendanceRecords.filter(r => r.status === 'late').length,
        averageHours: 8.2,
        overtimeHours: attendanceRecords.filter(r => r.status === 'overtime').length,
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

  const handleManualEntry = () => {
    navigate("/attendance/manual-update");
  };

  const handleImportData = () => {
    navigate("/attendance/import");
  };

  const handleExportData = () => {
    // Export attendance data to CSV
    const csvData = attendanceRecords.map(record => ({
      'Employee ID': record.employeeId,
      'Employee Name': record.employeeName,
      'Date': record.date,
      'Check In': record.checkIn,
      'Check Out': record.checkOut,
      'Hours Worked': record.hoursWorked,
      'Status': record.status,
      'Location': record.location,
    }));

    const csvContent = "data:text/csv;charset=utf-8,"
      + Object.keys(csvData[0]).join(",") + "\n"
      + csvData.map(row => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Attendance data exported successfully");
  };

  const attendanceRecords: AttendanceRecord[] = [
    {
      id: "1",
      employeeName: "John Doe",
      employeeId: "EMP001",
      date: "2024-02-01",
      checkIn: "09:00",
      checkOut: "17:30",
      hoursWorked: 8.5,
      status: "present",
      location: "Office",
    },
    {
      id: "2",
      employeeName: "Sarah Wilson",
      employeeId: "EMP002",
      date: "2024-02-01",
      checkIn: "09:15",
      checkOut: "17:45",
      hoursWorked: 8.5,
      status: "late",
      location: "Office",
    },
    {
      id: "3",
      employeeName: "Mike Johnson",
      employeeId: "EMP003",
      date: "2024-02-01",
      checkIn: "09:00",
      checkOut: "13:00",
      hoursWorked: 4,
      status: "half-day",
      location: "Remote",
    },
    {
      id: "4",
      employeeName: "Emily Davis",
      employeeId: "EMP004",
      date: "2024-02-01",
      checkIn: "-",
      checkOut: "-",
      hoursWorked: 0,
      status: "absent",
      location: "-",
    },
    {
      id: "5",
      employeeName: "David Chen",
      employeeId: "EMP005",
      date: "2024-02-01",
      checkIn: "08:30",
      checkOut: "19:00",
      hoursWorked: 10.5,
      status: "overtime",
      location: "Office",
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
      title: "Overtime",
      value: "15",
      change: "+3",
      changeType: "increase" as const,
      icon: AlertCircle,
      color: "bg-blue-500",
    },
  ];

  // Monthly Attendance Data for Bar Chart
  const monthlyAttendanceData = [
    { month: 'Jan', present: 4850, absent: 150, late: 200, overtime: 300 },
    { month: 'Feb', present: 4920, absent: 120, late: 180, overtime: 280 },
    { month: 'Mar', present: 5100, absent: 100, late: 150, overtime: 350 },
    { month: 'Apr', present: 4980, absent: 140, late: 170, overtime: 320 },
    { month: 'May', present: 5050, absent: 110, late: 160, overtime: 290 },
    { month: 'Jun', present: 5200, absent: 80, late: 140, overtime: 380 },
  ];

  // Department Distribution Data for Pie Chart
  const departmentData = [
    { name: 'Engineering', value: 45, employees: 112, color: '#3B82F6' },
    { name: 'Marketing', value: 20, employees: 50, color: '#10B981' },
    { name: 'Sales', value: 15, employees: 38, color: '#F59E0B' },
    { name: 'HR', value: 8, employees: 20, color: '#EF4444' },
    { name: 'Finance', value: 7, employees: 18, color: '#8B5CF6' },
    { name: 'Operations', value: 5, employees: 12, color: '#06B6D4' },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "late":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "absent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "half-day":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "overtime":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "late":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "absent":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "half-day":
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case "overtime":
        return <Clock className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
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
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                  <Clock className="w-8 h-8 text-blue-600" />
                  <span>Attendance</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Track employee attendance, check-ins, and working hours
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Manual Entry</span>
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

        {/* Submodule Navigation */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-3">
            <div className="flex space-x-1 overflow-x-auto">
              {subModules.map((subModule) => {
                const Icon = subModule.icon;
                const isActive = activeSubModule === subModule.id;
                return (
                  <button
                    key={subModule.id}
                    onClick={() => handleSubModuleClick(subModule)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{subModule.name}</span>
                    {subModule.count !== undefined && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isActive
                          ? "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      }`}>
                        {subModule.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

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

            {/* Attendance Graph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Daily Attendance Trend (Last 7 Days)
              </h3>

              <div className="space-y-4">
                {[
                  {
                    date: "Feb 1",
                    present: 234,
                    absent: 14,
                    late: 8,
                    percentage: 94,
                  },
                  {
                    date: "Feb 2",
                    present: 241,
                    absent: 7,
                    late: 5,
                    percentage: 97,
                  },
                  {
                    date: "Feb 3",
                    present: 238,
                    absent: 10,
                    late: 6,
                    percentage: 96,
                  },
                  {
                    date: "Feb 4",
                    present: 235,
                    absent: 13,
                    late: 9,
                    percentage: 95,
                  },
                  {
                    date: "Feb 5",
                    present: 242,
                    absent: 6,
                    late: 4,
                    percentage: 98,
                  },
                  {
                    date: "Feb 6",
                    present: 239,
                    absent: 9,
                    late: 7,
                    percentage: 96,
                  },
                  {
                    date: "Feb 7",
                    present: 245,
                    absent: 3,
                    late: 2,
                    percentage: 99,
                  },
                ].map((data, index) => (
                  <div key={data.date} className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {data.date}
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full flex items-center justify-end pr-2"
                      >
                        <span className="text-white text-xs font-medium">
                          {data.percentage}%
                        </span>
                      </motion.div>
                    </div>
                    <div className="flex space-x-4 text-sm">
                      <div className="text-green-600 dark:text-green-400">
                        Present: {data.present}
                      </div>
                      <div className="text-yellow-600 dark:text-yellow-400">
                        Late: {data.late}
                      </div>
                      <div className="text-red-600 dark:text-red-400">
                        Absent: {data.absent}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Attendance Records */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Daily Attendance Records
                </h3>

                <div className="flex items-center space-x-4">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />

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
                        Location
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
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                                {record.employeeName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {record.employeeName}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {record.employeeId}
                              </p>
                            </div>
                          </div>
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
                          {record.hoursWorked > 0
                            ? `${record.hoursWorked}h`
                            : "-"}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {record.location}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(record.status)}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                record.status
                              )}`}
                            >
                              {record.status.charAt(0).toUpperCase() +
                                record.status.slice(1).replace("-", " ")}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400">
                            <Eye className="w-4 h-4" />
                          </button>
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
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Check In/Out
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Record employee attendance manually
                </p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Manual Entry
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="card p-6 text-center"
              >
                <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Monthly Report
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Generate attendance reports
                </p>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Generate Report
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="card p-6 text-center"
              >
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Team Overview
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  View team attendance summary
                </p>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  View Summary
                </button>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Attendance;
