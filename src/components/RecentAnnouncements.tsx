import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, ChevronRight } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  type: 'policy' | 'event' | 'general';
}

const RecentAnnouncements: React.FC = () => {
  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'New HR Policy Update',
      description: 'Please review the updated leave policy effective from next month.',
      date: '2024-01-15',
      priority: 'high',
      type: 'policy'
    },
    {
      id: '2',
      title: 'Team Building Event',
      description: 'Join us for the quarterly team building event this Friday.',
      date: '2024-01-12',
      priority: 'medium',
      type: 'event'
    },
    {
      id: '3',
      title: 'Office Maintenance',
      description: 'Scheduled maintenance on Saturday. Office will be closed.',
      date: '2024-01-10',
      priority: 'medium',
      type: 'general'
    },
    {
      id: '4',
      title: 'Holiday Schedule',
      description: 'Updated holiday schedule for the upcoming quarter.',
      date: '2024-01-08',
      priority: 'low',
      type: 'general'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return '📋';
      case 'event':
        return '🎉';
      case 'general':
        return '📢';
      default:
        return '📢';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 h-fit"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Announcements</h3>
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement, index) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getTypeIcon(announcement.type)}</span>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  {announcement.title}
                </h4>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(announcement.priority)}`}>
                {announcement.priority}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
              {announcement.description}
            </p>
            
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{new Date(announcement.date).toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
      >
        View All Announcements
      </motion.button>
    </motion.div>
  );
};

export default RecentAnnouncements;
