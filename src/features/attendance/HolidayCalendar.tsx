import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  MapPin,
  Users,
  Clock,
  Filter,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'national' | 'regional' | 'company' | 'optional';
  description?: string;
  location?: string;
  isRecurring: boolean;
  applicableToAll: boolean;
  departments?: string[];
}

const HolidayCalendar: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const holidayTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'national', label: 'National' },
    { value: 'regional', label: 'Regional' },
    { value: 'company', label: 'Company' },
    { value: 'optional', label: 'Optional' }
  ];

  const departments = ['Engineering', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations'];

  // Mock holidays data
  const mockHolidays: Holiday[] = [
    {
      id: '1',
      name: 'New Year\'s Day',
      date: '2024-01-01',
      type: 'national',
      description: 'National holiday celebrating the new year',
      isRecurring: true,
      applicableToAll: true
    },
    {
      id: '2',
      name: 'Republic Day',
      date: '2024-01-26',
      type: 'national',
      description: 'National holiday celebrating the constitution',
      isRecurring: true,
      applicableToAll: true
    },
    {
      id: '3',
      name: 'Company Foundation Day',
      date: '2024-03-15',
      type: 'company',
      description: 'Celebrating company anniversary',
      isRecurring: true,
      applicableToAll: true
    },
    {
      id: '4',
      name: 'Good Friday',
      date: '2024-03-29',
      type: 'optional',
      description: 'Optional holiday for Christian employees',
      isRecurring: true,
      applicableToAll: false,
      departments: ['HR', 'Finance']
    },
    {
      id: '5',
      name: 'Independence Day',
      date: '2024-08-15',
      type: 'national',
      description: 'National independence day',
      isRecurring: true,
      applicableToAll: true
    }
  ];

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHolidays(mockHolidays);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isHoliday = (date: string) => {
    return holidays.some(holiday => {
      if (filterType !== 'all' && holiday.type !== filterType) return false;
      return holiday.date === date;
    });
  };

  const getHolidaysForDate = (date: string) => {
    return holidays.filter(holiday => {
      if (filterType !== 'all' && holiday.type !== filterType) return false;
      return holiday.date === date;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = formatDate(clickedDate);
    setSelectedDate(dateString);
  };

  const handleAddHoliday = () => {
    setEditingHoliday({
      id: '',
      name: '',
      date: selectedDate || formatDate(new Date()),
      type: 'company',
      description: '',
      isRecurring: false,
      applicableToAll: true,
      departments: []
    });
    setShowAddModal(true);
  };

  const handleEditHoliday = (holiday: Holiday) => {
    setEditingHoliday({ ...holiday });
    setShowAddModal(true);
  };

  const handleSaveHoliday = () => {
    if (!editingHoliday) return;

    if (editingHoliday.id) {
      // Update existing holiday
      setHolidays(prev => prev.map(h => h.id === editingHoliday.id ? editingHoliday : h));
    } else {
      // Add new holiday
      const newHoliday = { ...editingHoliday, id: Date.now().toString() };
      setHolidays(prev => [...prev, newHoliday]);
    }

    setShowAddModal(false);
    setEditingHoliday(null);
  };

  const handleDeleteHoliday = (holidayId: string) => {
    setHolidays(prev => prev.filter(h => h.id !== holidayId));
  };

  const getHolidayTypeColor = (type: string) => {
    switch (type) {
      case 'national': return 'bg-red-500';
      case 'regional': return 'bg-orange-500';
      case 'company': return 'bg-blue-500';
      case 'optional': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getHolidayTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'national': return 'bg-red-100 text-red-800';
      case 'regional': return 'bg-orange-100 text-orange-800';
      case 'company': return 'bg-blue-100 text-blue-800';
      case 'optional': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = formatDate(date);
      const dayHolidays = getHolidaysForDate(dateString);
      const isToday = dateString === formatDate(new Date());
      const isSelected = dateString === selectedDate;

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`relative p-2 min-h-[60px] border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            isToday ? 'bg-blue-100 dark:bg-blue-900' : ''
          } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className={`text-sm font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
            {day}
          </div>
          
          {dayHolidays.length > 0 && (
            <div className="mt-1 space-y-1">
              {dayHolidays.slice(0, 2).map((holiday, index) => (
                <div
                  key={holiday.id}
                  className={`text-xs px-1 py-0.5 rounded text-white truncate ${getHolidayTypeColor(holiday.type)}`}
                  title={holiday.name}
                >
                  {holiday.name}
                </div>
              ))}
              {dayHolidays.length > 2 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  +{dayHolidays.length - 2} more
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Holiday Calendar</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage company holidays and observances</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {holidayTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <button
                onClick={handleAddHoliday}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Holiday</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Today
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="p-6">
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-0 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-0 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    {renderCalendar()}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Holiday Types Legend */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Holiday Types</h3>
                  <div className="space-y-3">
                    {holidayTypes.slice(1).map(type => (
                      <div key={type.value} className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${getHolidayTypeColor(type.value)}`}></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{type.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Date Info */}
                {selectedDate && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    
                    {getHolidaysForDate(selectedDate).length > 0 ? (
                      <div className="space-y-3">
                        {getHolidaysForDate(selectedDate).map(holiday => (
                          <div key={holiday.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium text-gray-900 dark:text-white">{holiday.name}</h4>
                                  <span className={`px-2 py-1 text-xs rounded-full ${getHolidayTypeBadgeColor(holiday.type)}`}>
                                    {holiday.type}
                                  </span>
                                </div>
                                {holiday.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{holiday.description}</p>
                                )}
                                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                  {holiday.applicableToAll ? (
                                    <div className="flex items-center space-x-1">
                                      <Users className="w-3 h-3" />
                                      <span>All employees</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-1">
                                      <Users className="w-3 h-3" />
                                      <span>{holiday.departments?.join(', ')}</span>
                                    </div>
                                  )}
                                  {holiday.isRecurring && (
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3" />
                                      <span>Recurring</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 ml-2">
                                <button
                                  onClick={() => handleEditHoliday(holiday)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteHoliday(holiday.id)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No holidays on this date</p>
                        <button
                          onClick={handleAddHoliday}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          Add holiday
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Holidays</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{holidays.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {holidays.filter(h => {
                          const holidayDate = new Date(h.date);
                          return holidayDate.getMonth() === currentDate.getMonth() && 
                                 holidayDate.getFullYear() === currentDate.getFullYear();
                        }).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Upcoming</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {holidays.filter(h => new Date(h.date) > new Date()).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Holiday Modal */}
      {showAddModal && editingHoliday && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingHoliday.id ? 'Edit Holiday' : 'Add Holiday'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Holiday Name
                </label>
                <input
                  type="text"
                  value={editingHoliday.name}
                  onChange={(e) => setEditingHoliday({ ...editingHoliday, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter holiday name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={editingHoliday.date}
                  onChange={(e) => setEditingHoliday({ ...editingHoliday, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={editingHoliday.type}
                  onChange={(e) => setEditingHoliday({ ...editingHoliday, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {holidayTypes.slice(1).map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editingHoliday.description || ''}
                  onChange={(e) => setEditingHoliday({ ...editingHoliday, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Enter holiday description"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={editingHoliday.isRecurring}
                  onChange={(e) => setEditingHoliday({ ...editingHoliday, isRecurring: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="recurring" className="text-sm text-gray-700 dark:text-gray-300">
                  Recurring holiday
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="applicable-all"
                  checked={editingHoliday.applicableToAll}
                  onChange={(e) => setEditingHoliday({ ...editingHoliday, applicableToAll: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="applicable-all" className="text-sm text-gray-700 dark:text-gray-300">
                  Applicable to all employees
                </label>
              </div>
              
              {!editingHoliday.applicableToAll && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Applicable Departments
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {departments.map(dept => (
                      <div key={dept} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`dept-${dept}`}
                          checked={editingHoliday.departments?.includes(dept) || false}
                          onChange={(e) => {
                            const departments = editingHoliday.departments || [];
                            if (e.target.checked) {
                              setEditingHoliday({ 
                                ...editingHoliday, 
                                departments: [...departments, dept] 
                              });
                            } else {
                              setEditingHoliday({ 
                                ...editingHoliday, 
                                departments: departments.filter(d => d !== dept) 
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`dept-${dept}`} className="text-sm text-gray-700 dark:text-gray-300">
                          {dept}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHoliday}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Holiday</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HolidayCalendar;
