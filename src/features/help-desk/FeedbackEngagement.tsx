import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  BarChart3,
  Users,
  Award,
  Target,
  Lightbulb,
  Heart,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

interface FeedbackForm {
  type: 'general' | 'service' | 'suggestion' | 'complaint';
  rating: number;
  category: string;
  subject: string;
  message: string;
  anonymous: boolean;
  department?: string;
}

interface FeedbackStats {
  totalFeedback: number;
  averageRating: number;
  satisfactionRate: number;
  responseRate: number;
  topCategories: { name: string; count: number; percentage: number }[];
  recentTrends: { month: string; rating: number; count: number }[];
}

const FeedbackEngagement: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'submit' | 'stats'>('submit');
  const [feedback, setFeedback] = useState<FeedbackForm>({
    type: 'general',
    rating: 0,
    category: '',
    subject: '',
    message: '',
    anonymous: false,
    department: ''
  });
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const navigate = useNavigate();

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback', icon: MessageSquare, description: 'Share your thoughts about the company' },
    { value: 'service', label: 'Service Feedback', icon: Star, description: 'Rate our services and support' },
    { value: 'suggestion', label: 'Suggestion', icon: Lightbulb, description: 'Suggest improvements or new ideas' },
    { value: 'complaint', label: 'Complaint', icon: Frown, description: 'Report issues or concerns' }
  ];

  const categories = [
    'IT Support',
    'HR Services',
    'Facilities',
    'Management',
    'Communication',
    'Work Environment',
    'Benefits & Compensation',
    'Training & Development',
    'Other'
  ];

  const departments = [
    'Engineering',
    'HR',
    'Finance',
    'Marketing',
    'Sales',
    'Operations',
    'Legal',
    'Customer Support'
  ];

  // Mock stats data
  const mockStats: FeedbackStats = {
    totalFeedback: 1247,
    averageRating: 4.2,
    satisfactionRate: 84,
    responseRate: 92,
    topCategories: [
      { name: 'IT Support', count: 234, percentage: 18.8 },
      { name: 'HR Services', count: 187, percentage: 15.0 },
      { name: 'Facilities', count: 156, percentage: 12.5 },
      { name: 'Work Environment', count: 143, percentage: 11.5 },
      { name: 'Communication', count: 98, percentage: 7.9 }
    ],
    recentTrends: [
      { month: 'Jan', rating: 4.1, count: 98 },
      { month: 'Feb', rating: 4.3, count: 112 },
      { month: 'Mar', rating: 4.2, count: 134 },
      { month: 'Apr', rating: 4.4, count: 156 },
      { month: 'May', rating: 4.2, count: 143 },
      { month: 'Jun', rating: 4.5, count: 167 }
    ]
  };

  useEffect(() => {
    if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!feedback.subject.trim() || !feedback.message.trim() || feedback.rating === 0) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Submitting feedback:', feedback);
      
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFeedback({
          type: 'general',
          rating: 0,
          category: '',
          subject: '',
          message: '',
          anonymous: false,
          department: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingIcon = (rating: number, index: number) => {
    if (index <= rating) {
      return <Star className="w-6 h-6 text-yellow-500 fill-current" />;
    }
    return <Star className="w-6 h-6 text-gray-300" />;
  };

  const getRatingEmoji = (rating: number) => {
    if (rating <= 2) return <Frown className="w-8 h-8 text-red-500" />;
    if (rating <= 3) return <Meh className="w-8 h-8 text-yellow-500" />;
    return <Smile className="w-8 h-8 text-green-500" />;
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = feedbackTypes.find(t => t.value === type);
    const Icon = typeConfig?.icon || MessageSquare;
    return <Icon className="w-5 h-5" />;
  };

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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Feedback & Engagement</h1>
                <p className="text-gray-600 dark:text-gray-400">Share your feedback and help us improve</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('submit')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'submit'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'stats'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Feedback Stats
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'submit' ? (
              <div className="space-y-6">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center"
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Thank You for Your Feedback!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your feedback has been submitted successfully. We appreciate your input and will review it carefully.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Feedback Type Selection */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        What type of feedback would you like to share?
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {feedbackTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <button
                              key={type.value}
                              onClick={() => setFeedback({ ...feedback, type: type.value as any })}
                              className={`p-4 border-2 rounded-lg transition-colors text-left ${
                                feedback.type === type.value
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                              }`}
                            >
                              <div className="flex items-center space-x-3 mb-2">
                                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span className="font-medium text-gray-900 dark:text-white">{type.label}</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        How would you rate your overall experience?
                      </h3>
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setFeedback({ ...feedback, rating: star })}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            {getRatingIcon(feedback.rating, star)}
                          </button>
                        ))}
                      </div>
                      {feedback.rating > 0 && (
                        <div className="flex items-center justify-center space-x-2">
                          {getRatingEmoji(feedback.rating)}
                          <span className="text-lg font-medium text-gray-900 dark:text-white">
                            {feedback.rating === 1 && 'Very Poor'}
                            {feedback.rating === 2 && 'Poor'}
                            {feedback.rating === 3 && 'Average'}
                            {feedback.rating === 4 && 'Good'}
                            {feedback.rating === 5 && 'Excellent'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Feedback Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Tell us more about your experience
                      </h3>
                      
                      <div className="space-y-6">
                        {/* Category and Department */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Category
                            </label>
                            <select
                              value={feedback.category}
                              onChange={(e) => setFeedback({ ...feedback, category: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                              <option value="">Select category</option>
                              {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Related Department (Optional)
                            </label>
                            <select
                              value={feedback.department}
                              onChange={(e) => setFeedback({ ...feedback, department: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                              <option value="">Select department</option>
                              {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Subject */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Subject *
                          </label>
                          <input
                            type="text"
                            value={feedback.subject}
                            onChange={(e) => setFeedback({ ...feedback, subject: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Brief summary of your feedback"
                          />
                        </div>

                        {/* Message */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Your Feedback *
                          </label>
                          <textarea
                            value={feedback.message}
                            onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Please share your detailed feedback, suggestions, or concerns..."
                          />
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {feedback.message.length}/1000 characters
                          </p>
                        </div>

                        {/* Anonymous Option */}
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="anonymous"
                            checked={feedback.anonymous}
                            onChange={(e) => setFeedback({ ...feedback, anonymous: e.target.checked })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="anonymous" className="text-sm text-gray-700 dark:text-gray-300">
                            Submit this feedback anonymously
                          </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                          <button
                            onClick={handleSubmit}
                            disabled={loading || !feedback.subject.trim() || !feedback.message.trim() || feedback.rating === 0}
                            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="w-4 h-4" />
                            <span>{loading ? 'Submitting...' : 'Submit Feedback'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Stats Tab */
              <div className="space-y-6">
                {loading ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : stats ? (
                  <>
                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Feedback</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFeedback}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-blue-500">
                            <MessageSquare className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating}/5</p>
                          </div>
                          <div className="p-3 rounded-lg bg-yellow-500">
                            <Star className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Satisfaction Rate</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.satisfactionRate}%</p>
                          </div>
                          <div className="p-3 rounded-lg bg-green-500">
                            <ThumbsUp className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Rate</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.responseRate}%</p>
                          </div>
                          <div className="p-3 rounded-lg bg-purple-500">
                            <Target className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Top Categories */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow"
                      >
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Feedback Categories</h3>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            {stats.topCategories.map((category, index) => (
                              <div key={category.name} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                  </span>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {category.name}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-blue-500 h-2 rounded-full"
                                      style={{ width: `${category.percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                                    {category.count}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>

                      {/* Trends */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow"
                      >
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rating Trends</h3>
                        </div>
                        <div className="p-6">
                          <div className="h-48 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                            <div className="text-center">
                              <TrendingUp className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                              <p className="text-gray-500 dark:text-gray-400">Rating Trends Chart</p>
                              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                6 months of data
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Recent Feedback Summary */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow"
                    >
                      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Feedback Insights</h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Most Appreciated</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              IT Support team received the highest ratings this month
                            </p>
                          </div>
                          
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Improving Areas</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Communication and work environment feedback is trending up
                            </p>
                          </div>
                          
                          <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Engagement</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              92% of employees actively participate in feedback surveys
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeedbackEngagement;
