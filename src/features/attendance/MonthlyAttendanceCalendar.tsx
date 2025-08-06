import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Download,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

interface AttendanceDay {
  date: number;
  status: 'present' | 'absent' | 'late' | 'holiday' | 'weekend';
  checkIn?: string;
  checkOut?: string;
}

interface MonthlyData {
  [key: string]: AttendanceDay;
}

const MonthlyAttendanceCalendar: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [attendanceData, setAttendanceData] = useState<MonthlyData>({});
  const [loading, setLoading] = useState(true);

  const employees = [
    { id: 'all', name: 'All Employees' },
    { id: 'emp001', name: 'John Doe' },
    { id: 'emp002', name: 'Jane Smith' },
    { id: 'emp003', name: 'Mike Johnson' }
  ];

  // Mock data generation
  useEffect(() => {
    const generateMockData = () => {
      const data: MonthlyData = {};
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayOfWeek = date.getDay();
        
        let status: AttendanceDay['status'];
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          status = 'weekend';
        } else if (Math.random() < 0.1) {
          status = 'holiday';
        } else if (Math.random() < 0.05) {
          status = 'absent';
        } else if (Math.random() < 0.15) {
          status = 'late';
        } else {
          status = 'present';
        }

        data[day.toString()] = {
          date: day,
          status,
          checkIn: status === 'present' ? '09:00 AM' : status === 'late' ? '09:30 AM' : undefined,
          checkOut: status === 'present' || status === 'late' ? '06:00 PM' : undefined
        };
      }
      
      setAttendanceData(data);
      setLoading(false);
    };

    setTimeout(generateMockData, 1000);
  }, [currentDate, selectedEmployee]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'holiday':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'weekend':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-white text-gray-900 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4" />;
      case 'absent':
        return <XCircle className="w-4 h-4" />;
      case 'late':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const stats = {
    totalDays: Object.keys(attendanceData).length,
    presentDays: Object.values(attendanceData).filter(d => d.status === 'present').length,
    absentDays: Object.values(attendanceData).filter(d => d.status === 'absent').length,
    lateDays: Object.values(attendanceData).filter(d => d.status === 'late').length
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monthly Attendance Calendar</h1>
                <p className="text-gray-600 dark:text-gray-400">View monthly attendance patterns</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Working Days</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDays}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.presentDays}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <div className="flex items-center space-x-3">
                  <XCircle className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.absentDays}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <div className="flex items-center space-x-3">
                  <Clock className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Late</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.lateDays}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {dayNames.map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {getDaysInMonth().map((day, index) => {
                  if (day === null) {
                    return <div key={index} className="p-3"></div>;
                  }
                  
                  const dayData = attendanceData[day.toString()];
                  const isToday = day === new Date().getDate() && 
                                 currentDate.getMonth() === new Date().getMonth() && 
                                 currentDate.getFullYear() === new Date().getFullYear();
                  
                  return (
                    <motion.div
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        dayData ? getStatusColor(dayData.status) : 'bg-white border-gray-200'
                      } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <span className="text-sm font-medium">{day}</span>
                          {dayData && getStatusIcon(dayData.status)}
                        </div>
                        {dayData && dayData.checkIn && (
                          <div className="text-xs text-gray-600">
                            {dayData.checkIn}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Present</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Absent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Late</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Holiday</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Weekend</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MonthlyAttendanceCalendar;
