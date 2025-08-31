import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Plus,
  Send,
  Paperclip,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreHorizontal,
  User,
  Clock,
  Check,
  CheckCheck,
  X,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import BackButton from '../../components/ui/BackButton';
import { useToast } from '../../context/ToastContext';
import http from '../../services/http';

interface Message {
  id: string;
  from: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  to: string[];
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  priority: 'high' | 'normal' | 'low';
  thread?: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'online' | 'offline' | 'away';
}

const Inbox: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false); // Set to false to skip loading
  const [error, setError] = useState<string | null>(null);
  
  const { showError } = useToast();
  
  // Mock messages data - display directly without API calls
  const mockMessages: Message[] = [
    {
      id: '1',
      from: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@mhcognition.com',
        role: 'HR Manager'
      },
      to: ['tamil@mhcognition.com'],
      subject: 'Leave Request Approval Required',
      content: 'Hi Tamil, I need your approval for John Doe\'s leave request for next week. Please review the attached documents and let me know your decision.',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      isStarred: true,
      hasAttachments: true,
      priority: 'high'
    },
    {
      id: '2',
      from: {
        name: 'Mike Chen',
        email: 'mike.chen@mhcognition.com',
        role: 'Team Lead'
      },
      to: ['tamil@mhcognition.com'],
      subject: 'Project Update - Q1 Goals',
      content: 'Hello Tamil, I wanted to update you on our Q1 project progress. We\'re currently ahead of schedule and should meet all our targets by the end of the month.',
      timestamp: '2024-01-15T09:15:00Z',
      isRead: true,
      isStarred: false,
      hasAttachments: false,
      priority: 'normal'
    },
    {
      id: '3',
      from: {
        name: 'IT Support',
        email: 'support@mhcognition.com',
        role: 'IT Department'
      },
      to: ['tamil@mhcognition.com'],
      subject: 'System Maintenance Notification',
      content: 'This is to inform you that we will be performing system maintenance this Saturday from 2 AM to 6 AM. Please save your work and log out before the maintenance window.',
      timestamp: '2024-01-14T16:45:00Z',
      isRead: true,
      isStarred: false,
      hasAttachments: false,
      priority: 'normal'
    },
    {
      id: '4',
      from: {
        name: 'Emily Davis',
        email: 'emily.davis@mhcognition.com',
        role: 'Finance Manager'
      },
      to: ['tamil@mhcognition.com'],
      subject: 'Budget Review Meeting',
      content: 'Hi Tamil, Can we schedule a meeting to review the Q2 budget proposals? I have some questions about the resource allocation for the new projects.',
      timestamp: '2024-01-14T14:20:00Z',
      isRead: false,
      isStarred: false,
      hasAttachments: false,
      priority: 'normal'
    }
  ];

  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@mhcognition.com',
      role: 'HR Manager',
      department: 'Human Resources',
      status: 'online'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@mhcognition.com',
      role: 'Team Lead',
      department: 'Engineering',
      status: 'online'
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily.davis@mhcognition.com',
      role: 'Finance Manager',
      department: 'Finance',
      status: 'away'
    },
    {
      id: '4',
      name: 'John Doe',
      email: 'john.doe@mhcognition.com',
      role: 'Developer',
      department: 'Engineering',
      status: 'offline'
    }
  ]);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeFilter) {
      case 'unread':
        return matchesSearch && !message.isRead;
      case 'starred':
        return matchesSearch && message.isStarred;
      case 'important':
        return matchesSearch && message.priority === 'high';
      default:
        return matchesSearch;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

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
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                  <span>Inbox</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Internal communication and messaging
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCompose(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Compose</span>
            </motion.button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Message List */}
          <div className="w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Search and Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                {['all', 'unread', 'starred', 'important'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      activeFilter === filter
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 p-4">
                  <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">Loading messages...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-64 p-4">
                  <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
                  <p className="text-gray-800 dark:text-gray-200 font-medium mb-2">Failed to load messages</p>
                  <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                    {error}
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-2 inline" />
                    Retry
                  </button>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 p-4">
                  <MessageSquare className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No messages found</p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    } ${!message.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-medium truncate ${
                            !message.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {message.from.name}
                          </p>
                          <div className="flex items-center space-x-1">
                            {message.isStarred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                            {message.hasAttachments && <Paperclip className="w-3 h-3 text-gray-400" />}
                            <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                          </div>
                        </div>
                        <p className={`text-sm truncate mb-1 ${
                          !message.isRead ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {message.subject}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {message.content}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${getPriorityColor(message.priority)}`}>
                            {message.priority === 'high' ? '● High' : message.priority === 'low' ? '● Low' : ''}
                          </span>
                          {!message.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-lg text-gray-800 dark:text-gray-200 font-medium mb-2">Loading messages...</p>
                <p className="text-gray-600 dark:text-gray-400">Please wait while we retrieve your inbox</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
                <p className="text-xl text-gray-800 dark:text-gray-200 font-medium mb-2">Failed to load messages</p>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                  {error}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </button>
              </div>
            ) : selectedMessage ? (
              <>
                {/* Message Header */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                        aria-label={selectedMessage.isStarred ? "Unstar message" : "Star message"}
                        title={selectedMessage.isStarred ? "Unstar message" : "Star message"}
                      >
                        <Star className={`w-5 h-5 ${selectedMessage.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        aria-label="Reply to message"
                        title="Reply to message"
                      >
                        <Reply className="w-5 h-5" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        aria-label="Forward message"
                        title="Forward message"
                      >
                        <Forward className="w-5 h-5" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Delete message"
                        title="Delete message"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedMessage.from.name}</p>
                        <p className="text-xs">{selectedMessage.from.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(selectedMessage.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {selectedMessage.content}
                      </p>
                    </div>
                    {selectedMessage.hasAttachments && (
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Attachments</h4>
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <Paperclip className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">document.pdf</span>
                          <span className="text-xs text-gray-500">(2.3 MB)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reply Box */}
                <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-end space-x-4">
                    <div className="flex-1">
                      <textarea
                        placeholder="Type your reply..."
                        rows={3}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Select a message
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a message from the list to view its content.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contacts Sidebar */}
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contacts</h3>
            </div>
            <div className="p-4 space-y-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(contact.status)}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {contact.role} • {contact.department}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
