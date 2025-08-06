import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Search,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  Upload,
  Edit3,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  avatar?: string;
}

interface AttendanceEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  hoursWorked: number;
  overtime: number;
  notes?: string;
}

const ManualAttendanceUpdate: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [attendanceEntries, setAttendanceEntries] = useState<AttendanceEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const departments = ['All Departments', 'Engineering', 'HR', 'Finance', 'Marketing', 'Sales'];

  // Mock data
  const mockEmployees: Employee[] = [
    { id: '1', name: 'John Doe', employeeId: 'EMP001', department: 'Engineering', designation: 'Software Engineer' },
    { id: '2', name: 'Jane Smith', employeeId: 'EMP002', department: 'HR', designation: 'HR Manager' },
    { id: '3', name: 'Mike Johnson', employeeId: 'EMP003', department: 'Finance', designation: 'Accountant' },
    { id: '4', name: 'Sarah Wilson', employeeId: 'EMP004', department: 'Marketing', designation: 'Marketing Specialist' },
  ];

  const mockAttendanceEntries: AttendanceEntry[] = [
    {
      id: '1',
      employeeId: '1',
      employeeName: 'John Doe',
      date: selectedDate,
      checkIn: '09:00',
      checkOut: '18:00',
      status: 'present',
      hoursWorked: 8,
      overtime: 0,
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Jane Smith',
      date: selectedDate,
      checkIn: '09:15',
      checkOut: '18:00',
      status: 'late',
      hoursWorked: 7.75,
      overtime: 0,
    },
  ];

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmployees(mockEmployees);
      setAttendanceEntries(mockAttendanceEntries);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAttendance = (entryId: string, updates: Partial<AttendanceEntry>) => {
    setAttendanceEntries(prev => 
      prev.map(entry => 
        entry.id === entryId ? { ...entry, ...updates } : entry
      )
    );
  };

  const handleAddNewEntry = () => {
    const newEntry: AttendanceEntry = {
      id: Date.now().toString(),
      employeeId: '',
      employeeName: '',
      date: selectedDate,
      checkIn: '09:00',
      checkOut: '18:00',
      status: 'present',
      hoursWorked: 8,
      overtime: 0,
    };
    setAttendanceEntries(prev => [...prev, newEntry]);
    setEditingEntry(newEntry.id);
  };

  const handleDeleteEntry = (entryId: string) => {
    setAttendanceEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving attendance entries:', attendanceEntries);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = attendanceEntries.filter(entry => {
    const matchesSearch = entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || 
                             employees.find(emp => emp.id === entry.employeeId)?.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-100';
      case 'late': return 'text-yellow-600 bg-yellow-100';
      case 'absent': return 'text-red-600 bg-red-100';
      case 'half-day': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4" />;
      case 'late': return <AlertCircle className="w-4 h-4" />;
      case 'absent': return <XCircle className="w-4 h-4" />;
      case 'half-day': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manual Attendance Update</h1>
                <p className="text-gray-600 dark:text-gray-400">Update employee attendance records manually</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search Employee
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Departments</option>
                    {departments.slice(1).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleAddNewEntry}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Add Entry</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Attendance Records for {new Date(selectedDate).toLocaleDateString()}
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Check In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Check Out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
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
                    ) : filteredEntries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          No attendance records found for the selected date and filters.
                        </td>
                      </tr>
                    ) : (
                      filteredEntries.map((entry) => (
                        <AttendanceRow
                          key={entry.id}
                          entry={entry}
                          employees={employees}
                          isEditing={editingEntry === entry.id}
                          onEdit={() => setEditingEntry(entry.id)}
                          onSave={() => setEditingEntry(null)}
                          onCancel={() => setEditingEntry(null)}
                          onUpdate={(updates) => handleUpdateAttendance(entry.id, updates)}
                          onDelete={() => handleDeleteEntry(entry.id)}
                          getStatusColor={getStatusColor}
                          getStatusIcon={getStatusIcon}
                        />
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

// Separate component for attendance row to keep the main component clean
interface AttendanceRowProps {
  entry: AttendanceEntry;
  employees: Employee[];
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onUpdate: (updates: Partial<AttendanceEntry>) => void;
  onDelete: () => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

const AttendanceRow: React.FC<AttendanceRowProps> = ({
  entry,
  employees,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onUpdate,
  onDelete,
  getStatusColor,
  getStatusIcon,
}) => {
  const employee = employees.find(emp => emp.id === entry.employeeId);

  if (isEditing) {
    return (
      <tr className="bg-blue-50 dark:bg-blue-900/20">
        <td className="px-6 py-4">
          <select
            value={entry.employeeId}
            onChange={(e) => {
              const selectedEmployee = employees.find(emp => emp.id === e.target.value);
              onUpdate({
                employeeId: e.target.value,
                employeeName: selectedEmployee?.name || ''
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.employeeId})
              </option>
            ))}
          </select>
        </td>
        <td className="px-6 py-4">
          <input
            type="time"
            value={entry.checkIn}
            onChange={(e) => onUpdate({ checkIn: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </td>
        <td className="px-6 py-4">
          <input
            type="time"
            value={entry.checkOut}
            onChange={(e) => onUpdate({ checkOut: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </td>
        <td className="px-6 py-4">
          <select
            value={entry.status}
            onChange={(e) => onUpdate({ status: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
            <option value="half-day">Half Day</option>
          </select>
        </td>
        <td className="px-6 py-4">
          <input
            type="number"
            step="0.25"
            value={entry.hoursWorked}
            onChange={(e) => onUpdate({ hoursWorked: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={onSave}
              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={onCancel}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {entry.employeeName || 'Unknown Employee'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {employee?.employeeId || 'N/A'} • {employee?.department || 'N/A'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {entry.checkIn}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {entry.checkOut}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
          {getStatusIcon(entry.status)}
          <span className="capitalize">{entry.status}</span>
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {entry.hoursWorked}h
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ManualAttendanceUpdate;
