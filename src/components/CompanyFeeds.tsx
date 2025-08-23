import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, User } from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    department: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

const CompanyFeeds: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        department: 'Marketing',
      },
      content: 'Excited to share our Q4 achievements! Our team exceeded all targets and delivered exceptional results. Thank you to everyone who contributed to this success! 🎉',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: '2',
      author: {
        name: 'Mike Davis',
        department: 'Engineering',
      },
      content: 'Just completed our latest product feature! The new dashboard is now live and ready for testing. Looking forward to your feedback! 💻',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&h=300&fit=crop',
      timestamp: '4 hours ago',
      likes: 18,
      comments: 5,
      isLiked: true,
      isBookmarked: false,
    },
    {
      id: '3',
      author: {
        name: 'Emily Brown',
        department: 'HR',
      },
      content: 'Welcome to our new team members who joined us this week! We\'re thrilled to have you aboard and look forward to working together. 🤝',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&h=300&fit=crop',
      timestamp: '6 hours ago',
      likes: 32,
      comments: 12,
      isLiked: false,
      isBookmarked: true,
    },
    {
      id: '4',
      author: {
        name: 'David Wilson',
        department: 'Sales',
      },
      content: 'Great team lunch today! Nothing beats good food and even better company. These moments remind us why we love working together! 🍕',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=300&fit=crop',
      timestamp: '1 day ago',
      likes: 45,
      comments: 15,
      isLiked: true,
      isBookmarked: false,
    },
  ]);

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

  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Company Feeds</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Stay updated with company activities</p>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <div className="space-y-4 lg:space-y-6 p-4 lg:p-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    {post.author.avatar ? (
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        {getInitials(post.author.name)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {post.author.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {post.author.department} • {post.timestamp}
                    </p>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
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

              {/* Post Actions */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-1 transition-colors ${
                        post.isLiked 
                          ? 'text-red-500' 
                          : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="text-gray-500 hover:text-green-500 transition-colors">
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
                  >
                    <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyFeeds;
