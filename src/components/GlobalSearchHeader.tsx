import React, { useState, useEffect, useRef } from 'react';
import { useThemeStore } from '../context/themeStore';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, Users, Calendar, FileText, Building2, X, BarChart3, Bell } from 'lucide-react';
import { createPortal } from 'react-dom';

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
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

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

  const updateDropdownPosition = () => {
    if (searchContainerRef.current) {
      const rect = searchContainerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownMaxHeight = 384; // max-h-96 = 24rem = 384px
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Position dropdown below if there's enough space, otherwise above
      const shouldPositionAbove = spaceBelow < dropdownMaxHeight + 16 && spaceAbove > spaceBelow;

      setDropdownPosition({
        top: shouldPositionAbove
          ? rect.top + window.scrollY - dropdownMaxHeight - 8
          : rect.bottom + window.scrollY + 8,
        left: Math.max(8, Math.min(rect.left + window.scrollX, window.innerWidth - rect.width - 8)),
        width: rect.width
      });
    }
  };

  const handleFocus = () => {
    setIsSearchFocused(true);
    updateDropdownPosition();
  };

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (isSearchFocused) {
      updateDropdownPosition();
      const handleResize = () => updateDropdownPosition();
      const handleScroll = () => updateDropdownPosition();

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isSearchFocused]);

  const { isDark, toggleTheme } = useThemeStore();
  return (
    <div ref={searchContainerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        {/* Theme Toggle Button */}
        <button
          className="absolute right-16 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors z-10"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for actions, pages, requests, reports, people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
          className="w-full pl-12 pr-20 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
        />

        {/* Clear search button (X) - only show when there's text */}
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
          </button>
        )}

        {/* Bell button at right of input - separate from X button */}
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => {
            // For now, route to announcements (demo). If there are message notifications, route to inbox.
            const hasMessageNotification = false;
            onNavigate(hasMessageNotification ? '/inbox' : '/announcements');
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
        >
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Search Results Dropdown - Rendered via Portal */}
      {isSearchFocused && (searchResults.length > 0 || recentSearches.length > 0) && document.body && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-96 overflow-y-auto"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 999999
            }}
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
        </AnimatePresence>,
        document.body
      )}

      {/* Click outside to close */}
      {isSearchFocused && document.body && createPortal(
        <div
          className="fixed inset-0"
          style={{ zIndex: 999998 }}
          onClick={() => setIsSearchFocused(false)}
        />,
        document.body
      )}
    </div>
  );
};

export default GlobalSearchHeader;
