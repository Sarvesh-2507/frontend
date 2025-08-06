import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

interface AttendanceSummary {
  employeeId: string;
  employeeName: string;
  department: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendanceRate: number;
  avgWorkingHours: string;
  overtime: string;
}

const AttendanceSummaryReport: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [summaryData, setSummaryData] = useState<AttendanceSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [dateRange, setDateRange] = useState('thisMonth');
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockData: AttendanceSummary[] = [
      {
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        department: 'Engineering',
        totalDays: 22,
        presentDays: 20,
        absentDays: 1,
        lateDays: 1,
        attendanceRate: 90.9,
        avgWorkingHours: '8h 30m',
        overtime: '5h 20m'
      },
      {
        employeeId: 'EMP002',
        employeeName: 'Jane Smith',
        department: 'Marketing',
        totalDays: 22,
        presentDays: 21,
        absentDays: 0,
        lateDays: 1,
        attendanceRate: 95.5,
        avgWorkingHours: '8h 15m',
        overtime: '3h 45m'
      },
      {
        employeeId: 'EMP003',
        employeeName: 'Mike Johnson',
        department: 'HR',
        totalDays: 22,
        presentDays: 19,
        absentDays: 2,
        lateDays: 1,
        attendanceRate: 86.4,
        avgWorkingHours: '8h 10m',
        overtime: '2h 30m'
      },
      {
        employeeId: 'EMP004',
        employeeName: 'Sarah Wilson',
        department: 'Finance',
        totalDays: 22,
        presentDays: 22,
        absentDays: 0,
        lateDays: 0,
        attendanceRate: 100,
        avgWorkingHours: '8h 45m',
        overtime: '8h 15m'
      }
    ];
    
    setTimeout(() => {
      setSummaryData(mockData);
      setLoading(false);
    }, 1000);
  }, [dateRange]);

  const filteredData = summaryData.filter(employee => {
    const matchesSearch = employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(summaryData.map(emp => emp.department))];

  const overallStats = {
    totalEmployees: summaryData.length,
    avgAttendanceRate: summaryData.reduce((sum, emp) => sum + emp.attendanceRate, 0) / summaryData.length,
    totalPresentDays: summaryData.reduce((sum, emp) => sum + emp.presentDays, 0),
    totalAbsentDays: summaryData.reduce((sum, emp) => sum + emp.absentDays, 0),
    totalLateDays: summaryData.reduce((sum, emp) => sum + emp.lateDays, 0)
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceRateBg = (rate: number) => {
    if (rate >= 95) return 'bg-green-100 text-green-800';
    if (rate >= 85) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/attendance')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Summary Report</h1>
                <p className="text-gray-600 dark:text-gray-400">Comprehensive attendance analytics and insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="thisQuarter">This Quarter</option>
                <option value="thisYear">This Year</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.totalEmployees}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Attendance</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {overallStats.avgAttendanceRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Present Days</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.totalPresentDays}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <div className="flex items-center space-x-3">
                  <XCircle className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Absent Days</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.totalAbsentDays}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <div className="flex items-center space-x-3">
                  <Clock className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Late Days</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallStats.totalLateDays}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Trends Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Trends</h3>
                  <BarChart3 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Attendance Trends Chart</p>
                  </div>
                </div>
              </div>

              {/* Department Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Department Distribution</h3>
                  <PieChart className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                  <div className="text-center">
                    <PieChart className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Department Distribution Chart</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Present/Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Attendance Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Absent Days
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Late Days
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Avg Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Overtime
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((employee) => (
                        <motion.tr
                          key={employee.employeeId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                                <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                                  {employee.employeeName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {employee.employeeName}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {employee.employeeId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {employee.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {employee.presentDays}/{employee.totalDays}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getAttendanceRateBg(employee.attendanceRate)}`}>
                              {employee.attendanceRate}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {employee.absentDays}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {employee.lateDays}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {employee.avgWorkingHours}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {employee.overtime}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AttendanceSummaryReport;
