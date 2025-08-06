import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  BookOpen,
  FileText,
  Video,
  Download,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Clock,
  Tag,
  Filter,
  Star,
  TrendingUp,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdDate: string;
  updatedDate: string;
  views: number;
  likes: number;
  dislikes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
  attachments?: string[];
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  articleCount: number;
  icon: React.ComponentType<any>;
}

const KnowledgeBase: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<KnowledgeArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  
  const navigate = useNavigate();

  // Mock data
  const mockCategories: Category[] = [
    {
      id: 'it-support',
      name: 'IT Support',
      description: 'Hardware, software, and technical issues',
      articleCount: 45,
      icon: BookOpen
    },
    {
      id: 'hr-policies',
      name: 'HR Policies',
      description: 'Employee handbook and HR procedures',
      articleCount: 32,
      icon: Users
    },
    {
      id: 'getting-started',
      name: 'Getting Started',
      description: 'New employee onboarding guides',
      articleCount: 18,
      icon: Star
    },
    {
      id: 'software-guides',
      name: 'Software Guides',
      description: 'Application tutorials and how-tos',
      articleCount: 67,
      icon: Video
    },
    {
      id: 'troubleshooting',
      name: 'Troubleshooting',
      description: 'Common problems and solutions',
      articleCount: 54,
      icon: FileText
    }
  ];

  const mockArticles: KnowledgeArticle[] = [
    {
      id: '1',
      title: 'How to Reset Your Password',
      content: 'Step-by-step guide to reset your company password...',
      category: 'it-support',
      tags: ['password', 'security', 'login'],
      author: 'IT Support Team',
      createdDate: '2024-01-15',
      updatedDate: '2024-02-20',
      views: 1250,
      likes: 45,
      dislikes: 2,
      difficulty: 'beginner',
      estimatedReadTime: 3,
      featured: true
    },
    {
      id: '2',
      title: 'Setting Up VPN Access',
      content: 'Complete guide to configure VPN for remote work...',
      category: 'it-support',
      tags: ['vpn', 'remote-work', 'security'],
      author: 'Network Admin',
      createdDate: '2024-01-20',
      updatedDate: '2024-02-15',
      views: 890,
      likes: 38,
      dislikes: 1,
      difficulty: 'intermediate',
      estimatedReadTime: 8,
      featured: true
    },
    {
      id: '3',
      title: 'Leave Policy Guidelines',
      content: 'Understanding company leave policies and procedures...',
      category: 'hr-policies',
      tags: ['leave', 'policy', 'vacation'],
      author: 'HR Department',
      createdDate: '2024-01-10',
      updatedDate: '2024-02-25',
      views: 2100,
      likes: 67,
      dislikes: 3,
      difficulty: 'beginner',
      estimatedReadTime: 5,
      featured: false
    },
    {
      id: '4',
      title: 'New Employee Onboarding Checklist',
      content: 'Complete checklist for new hires...',
      category: 'getting-started',
      tags: ['onboarding', 'new-hire', 'checklist'],
      author: 'HR Team',
      createdDate: '2024-02-01',
      updatedDate: '2024-02-28',
      views: 567,
      likes: 23,
      dislikes: 0,
      difficulty: 'beginner',
      estimatedReadTime: 10,
      featured: true
    },
    {
      id: '5',
      title: 'Troubleshooting Email Issues',
      content: 'Common email problems and their solutions...',
      category: 'troubleshooting',
      tags: ['email', 'outlook', 'troubleshooting'],
      author: 'IT Support',
      createdDate: '2024-01-25',
      updatedDate: '2024-02-10',
      views: 743,
      likes: 31,
      dislikes: 2,
      difficulty: 'intermediate',
      estimatedReadTime: 6,
      featured: false
    }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'likes', label: 'Most Liked' },
    { value: 'recent', label: 'Recently Updated' },
    { value: 'title', label: 'Title A-Z' }
  ];

  const difficultyOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortArticles();
  }, [articles, searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCategories(mockCategories);
      setArticles(mockArticles);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortArticles = () => {
    let filtered = articles;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(article => article.difficulty === selectedDifficulty);
    }

    // Sort articles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'recent':
          return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default: // relevance
          return b.featured ? 1 : -1;
      }
    });

    setFilteredArticles(filtered);
  };

  const handleArticleClick = (article: KnowledgeArticle) => {
    // Increment view count
    setArticles(prev => prev.map(a => 
      a.id === article.id ? { ...a, views: a.views + 1 } : a
    ));
    
    setSelectedArticle(article);
    setShowArticleModal(true);
  };

  const handleLike = (articleId: string, isLike: boolean) => {
    setArticles(prev => prev.map(article => {
      if (article.id === articleId) {
        return {
          ...article,
          likes: isLike ? article.likes + 1 : article.likes,
          dislikes: !isLike ? article.dislikes + 1 : article.dislikes
        };
      }
      return article;
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || categoryId;
  };

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const popularArticles = [...filteredArticles].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/help-desk')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Knowledge Base</h1>
                <p className="text-gray-600 dark:text-gray-400">Find answers and helpful resources</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search Articles
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for articles, topics, or keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          {category.articleCount} articles
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Featured Articles</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featuredArticles.slice(0, 4).map((article) => (
                      <div
                        key={article.id}
                        onClick={() => handleArticleClick(article)}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{article.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(article.difficulty)}`}>
                            {article.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {article.content}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>{article.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{article.estimatedReadTime} min</span>
                            </div>
                          </div>
                          <span>{getCategoryName(article.category)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Articles List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Articles */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Articles ({filteredArticles.length})
                    </h3>
                  </div>
                  
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : filteredArticles.length === 0 ? (
                      <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        No articles found matching your criteria.
                      </div>
                    ) : (
                      filteredArticles.map((article) => (
                        <div
                          key={article.id}
                          onClick={() => handleArticleClick(article)}
                          className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                              {article.title}
                            </h4>
                            {article.featured && (
                              <Star className="w-4 h-4 text-yellow-500 ml-2" />
                            )}
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {article.content}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(article.difficulty)}`}>
                                {article.difficulty}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{article.views}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{article.estimatedReadTime} min</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ThumbsUp className="w-3 h-3" />
                                <span>{article.likes}</span>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {getCategoryName(article.category)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-3">
                            {article.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Popular Articles */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Articles</h3>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {popularArticles.map((article, index) => (
                      <div
                        key={article.id}
                        onClick={() => handleArticleClick(article)}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                              {article.title}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{article.views}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ThumbsUp className="w-3 h-3" />
                                <span>{article.likes}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <Filter className="w-5 h-5 text-gray-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Filters</h3>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Difficulty Level
                      </label>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        {difficultyOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                          setSelectedDifficulty('all');
                          setSortBy('relevance');
                        }}
                        className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Article Modal */}
      {showArticleModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedArticle.title}
                </h3>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>By {selectedArticle.author}</span>
                  <span>•</span>
                  <span>{new Date(selectedArticle.updatedDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{selectedArticle.estimatedReadTime} min read</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(selectedArticle.difficulty)}`}>
                    {selectedArticle.difficulty}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowArticleModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedArticle.content}
                </p>
              </div>
              
              {selectedArticle.attachments && selectedArticle.attachments.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Attachments</h4>
                  <div className="space-y-2">
                    {selectedArticle.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                        <Download className="w-4 h-4" />
                        <span>{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2 mt-6">
                {selectedArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{selectedArticle.views} views</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleLike(selectedArticle.id, false)}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>{selectedArticle.dislikes}</span>
                </button>
                <button
                  onClick={() => handleLike(selectedArticle.id, true)}
                  className="flex items-center space-x-1 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{selectedArticle.likes}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
