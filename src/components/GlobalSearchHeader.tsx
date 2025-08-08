import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, Users, Calendar, FileText, Building2, X, BarChart3, Bell } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  type: 'employee' | 'document' | 'leave' | 'organization' | 'feature';
  description: string;
  path: string;
  icon: React.ComponentType<any>;
}

interface GlobalSearchHeaderProps {
  onNavigate: (path: string) => void;
}

const GlobalSearchHeader: React.FC<GlobalSearchHeaderProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Mock search data - in real app, this would come from API
  const searchData: SearchResult[] = [
    {
      id: '1',
      title: 'Employee Directory',
      type: 'feature',
      description: 'View and manage all employees',
      path: '/employee-profile',
      icon: Users
    },
    {
      id: '2',
      title: 'Leave Management',
      type: 'feature',
      description: 'Apply and manage leave requests',
      path: '/leave',
      icon: Calendar
    },
    {
      id: '3',
      title: 'Organizations',
      type: 'feature',
      description: 'Manage company organizations',
      path: '/organizations',
      icon: Building2
    },
    {
      id: '4',
      title: 'Attendance',
      type: 'feature',
      description: 'View attendance records',
      path: '/attendance',
      icon: Clock
    },
    {
      id: '5',
      title: 'Payroll',
      type: 'feature',
      description: 'Manage payroll and compensation',
      path: '/payroll',
      icon: FileText
    },
    {
      id: '6',
      title: 'Performance Reviews',
      type: 'feature',
      description: 'Employee performance management',
      path: '/performance',
      icon: BarChart3
    }
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = (result: SearchResult) => {
    // Add to recent searches
    const newRecentSearches = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    
    // Navigate to result
    onNavigate(result.path);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for actions, pages, requests, reports, people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          className="w-full pl-12 pr-16 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
        />
        {/* Bell button at right of input */}
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => {
            // For now, route to announcements (demo). If there are message notifications, route to inbox.
            const hasMessageNotification = false;
            onNavigate(hasMessageNotification ? '/inbox' : '/announcements');
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          <Bell className="w-5 h-5" />
        </button>
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isSearchFocused && (searchResults.length > 0 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {searchResults.length > 0 ? (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wide">
                  Search Results
                </div>
                {searchResults.map((result) => {
                  const IconComponent = result.icon;
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleSearch(result)}
                      className="w-full flex items-center space-x-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                    >
                      <div className="flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {result.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {result.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : recentSearches.length > 0 ? (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wide">
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(search)}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">{search}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isSearchFocused && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsSearchFocused(false)}
        />
      )}
    </div>
  );
};

export default GlobalSearchHeader;
