import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Download,
  Eye,
  FileText,
  Search,
  Star,
  Tag,
  ThumbsDown,
  ThumbsUp,
  User,
  Video,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Logo from "../../components/ui/Logo";

interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  type: "article" | "video" | "document";
  author: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  dislikes: number;
  rating: number;
  tags: string[];
  featured: boolean;
}

const KnowledgeBase: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Sample knowledge base articles
  const articles: Article[] = [
    {
      id: "KB-001",
      title: "How to Reset Your Password",
      description: "Step-by-step guide to reset your account password",
      content: "Follow these simple steps to reset your password...",
      category: "Account Management",
      type: "article",
      author: "IT Support Team",
      createdAt: "2024-01-10T09:00:00Z",
      updatedAt: "2024-01-15T14:30:00Z",
      views: 1250,
      likes: 45,
      dislikes: 2,
      rating: 4.8,
      tags: ["password", "security", "account"],
      featured: true,
    },
    {
      id: "KB-002",
      title: "Setting Up VPN Connection",
      description: "Configure VPN for secure remote access",
      content: "Learn how to set up VPN connection for remote work...",
      category: "Network & Security",
      type: "video",
      author: "Network Team",
      createdAt: "2024-01-08T11:15:00Z",
      updatedAt: "2024-01-12T16:20:00Z",
      views: 890,
      likes: 38,
      dislikes: 1,
      rating: 4.9,
      tags: ["vpn", "remote", "security"],
      featured: true,
    },
    {
      id: "KB-003",
      title: "Software Installation Guidelines",
      description: "Company policy and procedures for software installation",
      content:
        "Before installing any software, please follow these guidelines...",
      category: "IT Policies",
      type: "document",
      author: "IT Policy Team",
      createdAt: "2024-01-05T13:45:00Z",
      updatedAt: "2024-01-10T10:30:00Z",
      views: 567,
      likes: 23,
      dislikes: 0,
      rating: 4.6,
      tags: ["software", "policy", "installation"],
      featured: false,
    },
    {
      id: "KB-004",
      title: "Troubleshooting Email Issues",
      description: "Common email problems and their solutions",
      content: "If you're experiencing email issues, try these solutions...",
      category: "Email & Communication",
      type: "article",
      author: "Support Team",
      createdAt: "2024-01-03T08:20:00Z",
      updatedAt: "2024-01-08T15:45:00Z",
      views: 1100,
      likes: 52,
      dislikes: 3,
      rating: 4.7,
      tags: ["email", "troubleshooting", "communication"],
      featured: false,
    },
    {
      id: "KB-005",
      title: "Hardware Request Process",
      description: "How to request new hardware equipment",
      content: "To request new hardware, follow this process...",
      category: "Hardware",
      type: "article",
      author: "Hardware Team",
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-05T12:15:00Z",
      views: 345,
      likes: 18,
      dislikes: 1,
      rating: 4.5,
      tags: ["hardware", "request", "equipment"],
      featured: false,
    },
  ];

  const categories = [
    "Account Management",
    "Network & Security",
    "IT Policies",
    "Email & Communication",
    "Hardware",
    "Software",
    "Troubleshooting",
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "video":
        return <Video className="w-4 h-4 text-red-500" />;
      case "document":
        return <Download className="w-4 h-4 text-green-500" />;
      default:
        return <BookOpen className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    const matchesType = selectedType === "all" || article.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const featuredArticles = articles.filter((article) => article.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
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
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => navigate("/help-desk")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Logo width={120} height={30} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Knowledge Base
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Find answers and helpful resources
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search articles, guides, and resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="article">Articles</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Featured Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() =>
                        navigate(`/knowledge-base/article/${article.id}`)
                      }
                    >
                      <div className="flex items-start justify-between mb-3">
                        {getTypeIcon(article.type)}
                        <div className="flex items-center space-x-1">
                          {renderStars(article.rating)}
                          <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                            ({article.rating})
                          </span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{article.views} views</span>
                        </div>
                        <span>{formatDate(article.updatedAt)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* All Articles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                All Articles ({filteredArticles.length})
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() =>
                        navigate(`/knowledge-base/article/${article.id}`)
                      }
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getTypeIcon(article.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                {article.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {article.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <User className="w-3 h-3" />
                                  <span>{article.author}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatDate(article.updatedAt)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{article.views} views</span>
                                </div>
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                                  {article.category}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <div className="flex items-center space-x-1">
                                {renderStars(article.rating)}
                                <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                                  ({article.rating})
                                </span>
                              </div>
                              <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{article.likes}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <ThumbsDown className="w-3 h-3" />
                                  <span>{article.dislikes}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {article.tags.length > 0 && (
                            <div className="flex items-center space-x-2 mt-3">
                              <Tag className="w-3 h-3 text-gray-400" />
                              <div className="flex flex-wrap gap-1">
                                {article.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KnowledgeBase;
