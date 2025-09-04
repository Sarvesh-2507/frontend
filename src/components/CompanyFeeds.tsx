import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';

// Local type definitions
interface Author {
  id: string;
  name: string;
  department: string;
}

interface Post {
  id: string;
  author: Author;
  content: string;
  type?: string;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  created_at: string;
  timestamp?: string;
  image?: string;
  comments?: number;
}

const CompanyFeeds: React.FC = () => {
  // Mock data for company feeds
  const mockPosts: Post[] = [
    {
      id: '1',
      author: { id: 'alice', name: 'Alice', department: 'Engineering' },
      content: 'Welcome to the new HR portal!',
      type: 'Announcement',
      likes: 5,
      isLiked: false,
      isBookmarked: false,
      created_at: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      comments: 2,
    },
    {
      id: '2',
      author: { id: 'bob', name: 'Bob', department: 'Marketing' },
      content: 'Don\'t forget the team meeting tomorrow.',
      type: 'Reminder',
      likes: 2,
      isLiked: false,
      isBookmarked: false,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      comments: 1,
    },
    {
      id: '3',
      author: { id: 'carol', name: 'Carol', department: 'Finance' },
      content: 'Payroll will be processed on Friday.',
      type: 'Update',
      likes: 3,
      isLiked: false,
      isBookmarked: false,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
      comments: 0,
    },
  ];

  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [departments, setDepartments] = useState<string[]>(['Engineering', 'Marketing', 'Finance']);
  const [postTypes, setPostTypes] = useState<string[]>(['Announcement', 'Reminder', 'Update']);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Handle like action
  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  // Handle bookmark action
  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  // Retry just resets error
  const handleRetry = () => {
    setError(null);
  };

  // Format date for display
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Reset all filters
  const clearFilters = () => {
    setDepartmentFilter('');
    setTypeFilter('');
    setSearchQuery('');
    setIsFilterOpen(false);
    setIsSearchOpen(false);
  };

  // Get initials for avatar placeholder
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col"
    >
      <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Company Feeds</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Search feeds"
            >
              <Search className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2 rounded-lg transition-colors ${
                departmentFilter || typeFilter 
                  ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Filter feeds"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button 
              onClick={handleRetry}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Refresh feeds"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3"
            >
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <Search className="w-4 h-4 text-gray-500 ml-3" />
                <input
                  type="text"
                  placeholder="Search company feeds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 p-2 bg-transparent text-gray-900 dark:text-white outline-none"
                />
              </div>
            </motion.div>
          )}
          
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3"
            >
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Department
                  </label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full p-2 text-sm bg-gray-50 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    title="Filter by department"
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Post Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full p-2 text-sm bg-gray-50 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    title="Filter by post type"
                  >
                    <option value="">All Types</option>
                    {postTypes.map((type) => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {(departmentFilter || typeFilter || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="mt-2 text-xs text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Posts Content */}
      <div className="flex-1 overflow-y-auto">
        {error ? (
          <div className="flex items-center justify-center h-64 text-center p-4">
            <div className="space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Unable to load feeds
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {error}
                </p>
                <button
                  onClick={handleRetry}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-4 lg:p-6">
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {getInitials(post.author.name)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {post.author.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {post.author.department} • {formatDate(post.timestamp || post.created_at)}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="More options">
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="text-gray-900 dark:text-white text-sm leading-relaxed break-words">
                      {post.content}
                    </p>
                  </div>

                  {/* Post Image */}
                  {post.image && (
                    <div className="px-4 pb-3">
                      <img 
                        src={post.image} 
                        alt="Post content"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Post Type Badge */}
                  {post.type && (
                    <div className="px-4 pb-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                        {post.type}
                      </span>
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-1 transition-colors ${
                          post.isLiked 
                            ? 'text-red-500' 
                            : 'text-gray-500 hover:text-red-500'
                        }`}
                        title="Like post"
                      >
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors" title="Comment on post">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{post.comments}</span>
                      </button>
                      <button className="text-gray-500 hover:text-green-500 transition-colors" title="Share post">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleBookmark(post.id)}
                      className={`transition-colors ${
                        post.isBookmarked 
                          ? 'text-yellow-500' 
                          : 'text-gray-500 hover:text-yellow-500'
                      }`}
                      title="Bookmark post"
                    >
                      <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {posts.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <MessageCircle className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery || departmentFilter || typeFilter 
                    ? 'Try adjusting your filters to see more posts.' 
                    : 'Be the first to share something with your team!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CompanyFeeds;
