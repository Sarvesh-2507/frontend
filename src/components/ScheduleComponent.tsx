import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight, Users, MapPin } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  time: string;
  type: 'meeting' | 'reminder' | 'announcement' | 'holiday';
  attendees?: number;
  location?: string;
  color: string;
}

const ScheduleComponent: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock events data
  const events: Event[] = [
    {
      id: '1',
      title: 'Strategy Meeting',
      time: '9:00 AM',
      type: 'meeting',
      attendees: 8,
      location: 'Conference Room A',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Team Review',
      time: '2:00 PM',
      type: 'meeting',
      attendees: 5,
      location: 'Meeting Room 2',
      color: 'bg-green-500'
    },
    {
      id: '3',
      title: 'Marketing Strategy Session',
      time: '4:00 PM',
      type: 'meeting',
      attendees: 12,
      location: 'Main Hall',
      color: 'bg-purple-500'
    }
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
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

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === currentDate.getMonth() && 
                     new Date().getFullYear() === currentDate.getFullYear();
      const isSelected = selectedDate.getDate() === day && 
                        selectedDate.getMonth() === currentDate.getMonth() && 
                        selectedDate.getFullYear() === currentDate.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
          className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
            isToday
              ? 'bg-blue-600 text-white'
              : isSelected
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return '👥';
      case 'reminder':
        return '⏰';
      case 'announcement':
        return '📢';
      case 'holiday':
        return '🎉';
      default:
        return '📅';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule</h3>
        </div>
        <button className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
          <Plus className="w-4 h-4 text-blue-600" />
        </button>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        <h4 className="font-semibold text-gray-900 dark:text-white">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h4>
        <button
          onClick={() => navigateMonth('next')}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
      </div>

      {/* Today's Events */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>Today's Events</span>
        </h4>
        <div className="space-y-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm">{getEventTypeIcon(event.type)}</span>
                  <h5 className="font-medium text-gray-900 dark:text-white text-sm whitespace-normal break-words">
                    {event.title}
                  </h5>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{event.time}</span>
                  </div>
                  {event.attendees && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{event.attendees}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
      >
        View Full Calendar
      </motion.button>
    </motion.div>
  );
};

export default ScheduleComponent;
