import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Calendar,
  Target,
  Award,
  AlertCircle,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface DepartmentMetric {
  department: string;
  totalEmployees: number;
  presentToday: number;
  attendanceRate: number;
  avgWorkingHours: number;
  lateArrivals: number;
}

interface TrendData {
  date: string;
  present: number;
  late: number;
  absent: number;
  total: number;
}

const AttendanceMetricsDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [departmentMetrics, setDepartmentMetrics] = useState<DepartmentMetric[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  
  const navigate = useNavigate();

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  // Monthly Attendance Trend Data
  const attendanceTrendData = [
    { month: 'Jan', attendance: 92, target: 95, present: 315, absent: 27 },
    { month: 'Feb', attendance: 88, target: 95, present: 301, absent: 41 },
    { month: 'Mar', attendance: 94, target: 95, present: 321, absent: 21 },
    { month: 'Apr', attendance: 91, target: 95, present: 311, absent: 31 },
    { month: 'May', attendance: 96, target: 95, present: 328, absent: 14 },
    { month: 'Jun', attendance: 93, target: 95, present: 318, absent: 24 },
    { month: 'Jul', attendance: 89, target: 95, present: 304, absent: 38 },
    { month: 'Aug', attendance: 95, target: 95, present: 325, absent: 17 },
    { month: 'Sep', attendance: 97, target: 95, present: 332, absent: 10 },
    { month: 'Oct', attendance: 94, target: 95, present: 321, absent: 21 },
    { month: 'Nov', attendance: 92, target: 95, present: 315, absent: 27 },
    { month: 'Dec', attendance: 90, target: 95, present: 308, absent: 34 }
  ];

  // Department Distribution Data
  const departmentDistributionData = [
    { name: 'Engineering', value: 45, employees: 158, color: '#3B82F6' },
    { name: 'Sales & Marketing', value: 25, employees: 88, color: '#10B981' },
    { name: 'Operations', value: 15, employees: 53, color: '#F59E0B' },
    { name: 'Human Resources', value: 8, employees: 28, color: '#EF4444' },
    { name: 'Finance', value: 7, employees: 25, color: '#8B5CF6' }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' }
  ];

  useEffect(() => {
    fetchMetrics();
  }, [selectedPeriod, selectedDepartment]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock metrics data
      const mockMetrics: MetricCard[] = [
        {
          title: 'Overall Attendance Rate',
          value: '94.2%',
          change: '+2.1%',
          changeType: 'increase',
          icon: Target,
          color: 'bg-green-500'
        },
        {
          title: 'Average Working Hours',
          value: '8.3h',
          change: '+0.2h',
          changeType: 'increase',
          icon: Clock,
          color: 'bg-blue-500'
        },
        {
          title: 'Late Arrivals',
          value: '12',
          change: '-3',
          changeType: 'decrease',
          icon: AlertCircle,
          color: 'bg-yellow-500'
        },
        {
          title: 'Perfect Attendance',
          value: '156',
          change: '+8',
          changeType: 'increase',
          icon: Award,
          color: 'bg-purple-500'
        },
        {
          title: 'Total Employees',
          value: '342',
          change: '+5',
          changeType: 'increase',
          icon: Users,
          color: 'bg-indigo-500'
        },
        {
          title: 'Absenteeism Rate',
          value: '5.8%',
          change: '-1.2%',
          changeType: 'decrease',
          icon: TrendingDown,
          color: 'bg-red-500'
        }
      ];

      const mockDepartmentMetrics: DepartmentMetric[] = [
        {
          department: 'Engineering',
          totalEmployees: 85,
          presentToday: 82,
          attendanceRate: 96.5,
          avgWorkingHours: 8.5,
          lateArrivals: 2
        },
        {
          department: 'Sales',
          totalEmployees: 45,
          presentToday: 41,
          attendanceRate: 91.1,
          avgWorkingHours: 8.2,
          lateArrivals: 3
        },
        {
          department: 'Marketing',
          totalEmployees: 32,
          presentToday: 30,
          attendanceRate: 93.8,
          avgWorkingHours: 8.1,
          lateArrivals: 1
        },
        {
          department: 'HR',
          totalEmployees: 18,
          presentToday: 17,
          attendanceRate: 94.4,
          avgWorkingHours: 8.0,
          lateArrivals: 1
        },
        {
          department: 'Finance',
          totalEmployees: 25,
          presentToday: 24,
          attendanceRate: 96.0,
          avgWorkingHours: 8.3,
          lateArrivals: 0
        }
      ];

      const mockTrendData: TrendData[] = [
        { date: '2024-01-15', present: 320, late: 15, absent: 7, total: 342 },
        { date: '2024-01-16', present: 315, late: 18, absent: 9, total: 342 },
        { date: '2024-01-17', present: 325, late: 12, absent: 5, total: 342 },
        { date: '2024-01-18', present: 330, late: 8, absent: 4, total: 342 },
        { date: '2024-01-19', present: 322, late: 14, absent: 6, total: 342 }
      ];

      setMetrics(mockMetrics);
      setDepartmentMetrics(mockDepartmentMetrics);
      setTrendData(mockTrendData);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-600 dark:text-green-400';
      case 'decrease': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="w-4 h-4" />;
      case 'decrease': return <TrendingDown className="w-4 h-4" />;
      default: return null;
    }
  };

  const exportReport = () => {
    // Create CSV content
    const csvContent = `Department,Total Employees,Present Today,Attendance Rate,Avg Working Hours,Late Arrivals
${departmentMetrics.map(dept => 
  `${dept.department},${dept.totalEmployees},${dept.presentToday},${dept.attendanceRate}%,${dept.avgWorkingHours}h,${dept.lateArrivals}`
).join('\n')}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_metrics_${selectedPeriod}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/attendance')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Metrics Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Comprehensive attendance analytics and insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>{period.label}</option>
                ))}
              </select>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {departments.map(dept => (
                  <option key={dept.value} value={dept.value}>{dept.label}</option>
                ))}
              </select>
              <button
                onClick={fetchMetrics}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
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
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {metric.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                          {metric.value}
                        </p>
                        <div className={`flex items-center mt-2 ${getChangeColor(metric.changeType)}`}>
                          {getChangeIcon(metric.changeType)}
                          <span className="text-sm font-medium ml-1">
                            {metric.change} from last {selectedPeriod}
                          </span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${metric.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Trend Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Trend</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Monthly attendance vs target</p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis
                        dataKey="month"
                        stroke="#6B7280"
                        fontSize={12}
                      />
                      <YAxis
                        stroke="#6B7280"
                        fontSize={12}
                        domain={[80, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                        formatter={(value: any, name: string) => [
                          `${value}%`,
                          name === 'attendance' ? 'Attendance Rate' : 'Target'
                        ]}
                      />
                      <Bar dataKey="target" fill="#E5E7EB" name="target" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="attendance" fill="#3B82F6" name="attendance" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span className="text-gray-600 dark:text-gray-400">Actual</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-300 rounded"></div>
                      <span className="text-gray-600 dark:text-gray-400">Target (95%)</span>
                    </div>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Avg: {(attendanceTrendData.reduce((sum, item) => sum + item.attendance, 0) / attendanceTrendData.length).toFixed(1)}%
                  </div>
                </div>
              </motion.div>

              {/* Department Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Department Distribution</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Employee distribution by department</p>
                  </div>
                  <PieChart className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={departmentDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {departmentDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                        formatter={(value: any) => [`${value}%`, 'Percentage']}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry: any) => (
                          <span style={{ color: entry.color }}>{value}</span>
                        )}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Department Performance Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Department Performance</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total Employees
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Present Today
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Attendance Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Avg Working Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Late Arrivals
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      departmentMetrics.map((dept, index) => (
                        <tr key={dept.department} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {dept.department}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {dept.totalEmployees}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {dept.presentToday}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    dept.attendanceRate >= 95 ? 'bg-green-500' :
                                    dept.attendanceRate >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${dept.attendanceRate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {dept.attendanceRate}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {dept.avgWorkingHours}h
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              dept.lateArrivals === 0 ? 'bg-green-100 text-green-800' :
                              dept.lateArrivals <= 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {dept.lateArrivals}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Quick Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Best Performing</span>
                  </div>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                    {departmentMetrics.reduce((best, dept) => 
                      dept.attendanceRate > best.attendanceRate ? dept : best, departmentMetrics[0]
                    )?.department || 'N/A'}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    {departmentMetrics.reduce((best, dept) => 
                      dept.attendanceRate > best.attendanceRate ? dept : best, departmentMetrics[0]
                    )?.attendanceRate || 0}% attendance rate
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Needs Attention</span>
                  </div>
                  <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                    {departmentMetrics.reduce((worst, dept) => 
                      dept.attendanceRate < worst.attendanceRate ? dept : worst, departmentMetrics[0]
                    )?.department || 'N/A'}
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-200">
                    {departmentMetrics.reduce((worst, dept) => 
                      dept.attendanceRate < worst.attendanceRate ? dept : worst, departmentMetrics[0]
                    )?.attendanceRate || 0}% attendance rate
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900 dark:text-green-100">Perfect Attendance</span>
                  </div>
                  <p className="text-lg font-bold text-green-900 dark:text-green-100">
                    {departmentMetrics.filter(dept => dept.lateArrivals === 0).length}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-200">
                    departments with no late arrivals
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AttendanceMetricsDashboard;
