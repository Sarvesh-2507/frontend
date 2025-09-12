// Duplicated from Announcements.tsx for employee side, with all navigation and modals scoped to /emp-home/announcements
import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const EmployeeAnnouncementsMainContent: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Mock announcements data
  const mockAnnouncements: Announcement[] = [
    {
      id: '1',
      title: 'New HR Policy Update',
      content: 'We are implementing new leave policies effective from next month.',
      author: 'Sarah Johnson',
      authorRole: 'HR Manager',
      createdAt: '2024-01-15T10:00:00Z',
      priority: 'high',
      type: 'policy',
      status: 'published',
      readBy: 45,
      totalEmployees: 120
    },
    // ... more announcements ...
  ];

  const filteredAnnouncements = mockAnnouncements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || announcement.type === filterType;
    const matchesPriority = filterPriority === 'all' || announcement.priority === filterPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => navigate('/emp-home')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-blue-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <span>Announcements</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Company-wide updates and information
              </p>
            </div>
          </div>
        </div>
      </header>
      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      {/* Announcements List */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAnnouncements.map((announcement) => (
                    <tr key={announcement.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{announcement.title}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{announcement.content.substring(0, 60)}...</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 dark:text-white">{announcement.author}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{new Date(announcement.createdAt).toLocaleDateString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeAnnouncementsMainContent;
