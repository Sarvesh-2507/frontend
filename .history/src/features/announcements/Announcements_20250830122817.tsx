import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Edit,
  Trash2,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  RefreshCw
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import BackButton from '../../components/ui/BackButton';
import { useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import http from '../../services/http';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  createdAt: string;
  scheduledFor?: string;
  priority: 'high' | 'medium' | 'low';
  type: 'policy' | 'event' | 'general' | 'urgent';
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  readBy: number;
  totalEmployees: number;
}

const Announcements: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const { showError } = useToast();
  const location = useLocation() as any;

  // Handle location state for opening create modal
  React.useEffect(() => {
    if (location?.state?.openCreate) {
      setShowCreateModal(true);
      // Clear the state so back nav doesn't reopen it
      if (history.replaceState) {
        history.replaceState({}, document.title);
      }
    }
  }, [location?.state]);
  
  // Load announcements with error handling
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch announcements from API
        const response = await http.get('/api/announcements');
        setAnnouncements(response.data || []);
        
      } catch (err: any) {
        console.error("📣 Announcements - Error loading:", err);
        
        if (err.response?.status === 401) {
          setError("Not authorized to view announcements");
        } else {
          setError("Failed to load announcements. Please try again.");
        }
        
        // Use mock data as fallback
        setAnnouncements(mockAnnouncements);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnnouncements();
  }, [showError]);

  const mockAnnouncements: Announcement[] = [
    {
      id: '1',
      title: 'New HR Policy Update',
      content: 'We are implementing new leave policies effective from next month. Please review the updated guidelines and ensure compliance.',
      author: 'Sarah Johnson',
      authorRole: 'HR Manager',
      createdAt: '2024-01-15T10:00:00Z',
      priority: 'high',
      type: 'policy',
      status: 'published',
      readBy: 45,
      totalEmployees: 120
    },
    {
      id: '2',
      title: 'Team Building Event - Friday',
      content: 'Join us for our quarterly team building event this Friday at 3 PM in the main conference room. Refreshments will be provided.',
      author: 'Mike Chen',
      authorRole: 'Team Lead',
      createdAt: '2024-01-12T14:30:00Z',
      scheduledFor: '2024-01-19T15:00:00Z',
      priority: 'medium',
      type: 'event',
      status: 'scheduled',
      readBy: 78,
      totalEmployees: 120
    },
    {
      id: '3',
      title: 'Office Maintenance Notice',
      content: 'Scheduled maintenance will occur this Saturday from 9 AM to 5 PM. The office will be closed during this time.',
      author: 'Admin Team',
      authorRole: 'Administration',
      createdAt: '2024-01-10T09:00:00Z',
      priority: 'medium',
      type: 'general',
      status: 'published',
      readBy: 112,
      totalEmployees: 120
    },
    {
      id: '4',
      title: 'Security Alert - Password Update Required',
      content: 'For security reasons, all employees must update their passwords by the end of this week. Please use the password reset link in your email.',
      author: 'IT Security',
      authorRole: 'IT Department',
      createdAt: '2024-01-08T11:00:00Z',
      priority: 'high',
      type: 'urgent',
      status: 'published',
      readBy: 95,
      totalEmployees: 120
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'policy':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'archived':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || announcement.type === filterType;
    const matchesPriority = filterPriority === 'all' || announcement.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

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
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackButton variant="home" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                  <Bell className="w-8 h-8 text-blue-600" />
                  <span>Announcements</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Create, manage, and schedule company announcements
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Announcement</span>
            </motion.button>
          </div>
        </header>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="policy">Policy</option>
                <option value="event">Event</option>
                <option value="general">General</option>
                <option value="urgent">Urgent</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading announcements...</p>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {error && !isLoading && (
              <div className="flex flex-col items-center justify-center h-64">
                <AlertTriangle className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Unable to load announcements</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry</span>
                </button>
              </div>
            )}
            
            {/* Announcements List */}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {filteredAnnouncements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedAnnouncement(announcement)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(announcement.type)}
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(announcement.status)}`}>
                      {announcement.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {announcement.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {announcement.content}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <User className="w-3 h-3" />
                      <span>{announcement.author} • {announcement.authorRole}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        Read by {announcement.readBy}/{announcement.totalEmployees}
                      </span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                        <div
                          className="bg-blue-500 h-1 rounded-full"
                          style={{ width: `${(announcement.readBy / announcement.totalEmployees) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
              </div>
            )}

            {!isLoading && !hasError && filteredAnnouncements.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No announcements found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Announcement Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Announcement</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const newItem: Announcement = {
                    id: String(Date.now()),
                    title: String(formData.get('title') || ''),
                    content: String(formData.get('content') || ''),
                    author: 'HR',
                    authorRole: 'HR Manager',
                    createdAt: new Date().toISOString(),
                    priority: (formData.get('priority') as any) || 'medium',
                    type: (formData.get('type') as any) || 'general',
                    status: 'published',
                    readBy: 0,
                    totalEmployees: 0,
                  };
                  // For demo: just close the modal. Could push to state if needed
                  setShowCreateModal(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input name="title" required className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Content</label>
                  <textarea name="content" rows={4} required className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                    <select name="priority" className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Type</label>
                    <select name="type" className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                      <option value="general">General</option>
                      <option value="policy">Policy</option>
                      <option value="event">Event</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button type="button" onClick={()=>setShowCreateModal(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">Create</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcement Detail Modal */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAnnouncement(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedAnnouncement.title}
                </h2>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm rounded-full ${getPriorityColor(selectedAnnouncement.priority)}`}>
                    {selectedAnnouncement.priority} priority
                  </span>
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedAnnouncement.status)}`}>
                    {selectedAnnouncement.status}
                  </span>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedAnnouncement.content}
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Author:</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedAnnouncement.author} ({selectedAnnouncement.authorRole})
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Created:</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(selectedAnnouncement.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Read by:</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedAnnouncement.readBy} of {selectedAnnouncement.totalEmployees} employees
                      </p>
                    </div>
                    {selectedAnnouncement.scheduledFor && (
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">Scheduled for:</span>
                        <p className="text-gray-600 dark:text-gray-400">
                          {new Date(selectedAnnouncement.scheduledFor).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Announcements;
