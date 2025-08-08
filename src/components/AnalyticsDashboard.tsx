import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Clock,
  FileText,
  Activity,
  Building2,
  UserCheck,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Plus,
  ChevronLeft,
  ChevronRight
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
import Sidebar from './Sidebar';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ComponentType<any>;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon: Icon, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          <div className="flex items-center mt-2">
            {changeType === 'positive' ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {change}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

const ChartPlaceholder: React.FC<{ title: string; type: 'bar' | 'pie'; icon: React.ComponentType<any> }> = ({ title, type, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
        <div className="text-center">
          {type === 'bar' ? (
            <BarChart3 className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
          ) : (
            <PieChart className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
          )}
          <p className="text-gray-500 dark:text-gray-400">{title} Visualization</p>
        </div>
      </div>
    </motion.div>
  );
};



const AnalyticsDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Monthly Attendance Data
  const monthlyAttendanceData = [
    { month: 'Jan', attendance: 92, target: 95 },
    { month: 'Feb', attendance: 88, target: 95 },
    { month: 'Mar', attendance: 94, target: 95 },
    { month: 'Apr', attendance: 91, target: 95 },
    { month: 'May', attendance: 96, target: 95 },
    { month: 'Jun', attendance: 93, target: 95 },
    { month: 'Jul', attendance: 89, target: 95 },
    { month: 'Aug', attendance: 95, target: 95 },
    { month: 'Sep', attendance: 97, target: 95 },
    { month: 'Oct', attendance: 94, target: 95 },
    { month: 'Nov', attendance: 92, target: 95 },
    { month: 'Dec', attendance: 90, target: 95 }
  ];

  // Department Distribution Data
  const departmentData = [
    { name: 'Engineering', value: 45, employees: 158, color: '#3B82F6' },
    { name: 'Sales', value: 25, employees: 88, color: '#10B981' },
    { name: 'Marketing', value: 15, employees: 53, color: '#F59E0B' },
    { name: 'HR', value: 8, employees: 28, color: '#EF4444' },
    { name: 'Finance', value: 7, employees: 25, color: '#8B5CF6' }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const metrics = [
    {
      title: 'Total employees',
      value: '352',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Employees present',
      value: '330',
      change: '+2%',
      changeType: 'positive' as const,
      icon: UserCheck,
      color: 'bg-green-600'
    },
    {
      title: 'Number of leave',
      value: '22',
      change: '-10%',
      changeType: 'negative' as const,
      icon: Calendar,
      color: 'bg-red-500'
    },
    {
      title: 'New employees',
      value: '32',
      change: '+12%',
      changeType: 'positive' as const,
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      title: 'Organization',
      value: '8',
      change: '+2%',
      changeType: 'positive' as const,
      icon: Building2,
      color: 'bg-purple-500'
    },
    {
      title: 'Open Tickets',
      value: '12',
      change: '+3%',
      changeType: 'positive' as const,
      icon: AlertCircle,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Deep dive into your organization's performance metrics, trends, and detailed analytics.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Export
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Overview Chart - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">Attendance Overview</h3>
            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">On Time</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-300 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Late</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-300 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Absent</span>
              </div>
            </div>
          </div>
          <div className="h-32 flex items-end justify-center space-x-1">
            {/* Attendance bars for each day */}
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="flex flex-col items-center space-y-1">
                <div className="flex flex-col space-y-0.5">
                  <div className="w-6 bg-orange-500 rounded-t" style={{ height: `${40 + Math.random() * 25}px` }}></div>
                  <div className="w-6 bg-blue-300 rounded" style={{ height: `${15 + Math.random() * 15}px` }}></div>
                  <div className="w-6 bg-gray-300 rounded-b" style={{ height: `${8 + Math.random() * 10}px` }}></div>
                </div>
                <span className="text-xs text-gray-500">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
              </div>
            ))}
          </div>
          {/* Additional attendance stats */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-white">94.2%</div>
              <div className="text-gray-500">On Time</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-white">4.8%</div>
              <div className="text-gray-500">Late</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-white">1.0%</div>
              <div className="text-gray-500">Absent</div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Calendar with Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 h-fit"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule</h3>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                <Plus className="w-4 h-4" />
              </button>
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-3">
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <span className="text-sm font-medium text-gray-900 dark:text-white">June 2027</span>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="p-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
            {/* Calendar days with events */}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i < 31 ? i + 1 : '';
              const isToday = day === 19; // June 19th as today
              const hasEvent = [15, 19, 25].includes(day as number);
              return (
                <div
                  key={i}
                  className={`relative p-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded cursor-pointer transition-colors ${
                    isToday ? 'bg-blue-500 text-white font-semibold' : ''
                  }`}
                >
                  {day}
                  {hasEvent && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Today's Events */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">19 June 2027</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Strategy Meeting</span>
                <span className="text-gray-500 text-xs ml-auto">9:00 AM</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Team Review</span>
                <span className="text-gray-500 text-xs ml-auto">2:00 PM</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-xs">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Marketing Strategy Session</span>
                <span className="text-gray-500 text-xs ml-auto">4:00 PM</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

        {/* Monthly Attendance - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Attendance</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Attendance rate vs target (95%)</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyAttendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                    name === 'attendance' ? 'Attendance' : 'Target'
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
                <span className="text-gray-600 dark:text-gray-400">Target</span>
              </div>
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              Avg: {(monthlyAttendanceData.reduce((sum, item) => sum + item.attendance, 0) / monthlyAttendanceData.length).toFixed(1)}%
            </div>
          </div>
        </motion.div>

        {/* Leave Statistics - Demo Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Leave Statistics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly leave trends and type breakdown</p>
            </div>
            <PieChart className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar: Leave taken by month */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { month: 'Jan', leave: 22 },
                  { month: 'Feb', leave: 18 },
                  { month: 'Mar', leave: 26 },
                  { month: 'Apr', leave: 19 },
                  { month: 'May', leave: 31 },
                  { month: 'Jun', leave: 24 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }} />
                  <Bar dataKey="leave" fill="#3B82F6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie: Leave by type */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie dataKey="value" data={[
                    { name: 'Casual', value: 35 },
                    { name: 'Sick', value: 25 },
                    { name: 'Earned', value: 20 },
                    { name: 'Maternity', value: 10 },
                    { name: 'Others', value: 10 },
                  ]} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                    {['#3B82F6','#EF4444','#10B981','#F59E0B','#8B5CF6'].map((c, i) => (
                      <Cell key={i} fill={c} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Department Distribution - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Department Distribution</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Employee distribution across departments</p>
            </div>
            <PieChart className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="flex items-center space-x-8">
            <div className="h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
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
                    formatter={(value: any, name: string) => [`${value}%`, 'Percentage']}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {departmentData.map((dept, index) => (
                <div key={dept.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{dept.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{dept.employees} employees</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{dept.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
        </div>
      </div>
  );
};

export default AnalyticsDashboard;
