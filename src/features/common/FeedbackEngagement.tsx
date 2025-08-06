import { motion } from "framer-motion";
import {
    ArrowLeft,
    Award,
    Calendar,
    Heart,
    MessageSquare,
    Send,
    Star,
    ThumbsDown,
    ThumbsUp,
    TrendingUp,
    User,
    Users,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Logo from "../../components/ui/Logo";

interface Feedback {
  id: string;
  type: "suggestion" | "complaint" | "compliment" | "feature-request";
  title: string;
  description: string;
  rating: number;
  category: string;
  status: "pending" | "reviewed" | "implemented" | "rejected";
  submittedBy: string;
  submittedAt: string;
  likes: number;
  comments: number;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  type: "satisfaction" | "engagement" | "pulse" | "exit";
  status: "active" | "completed" | "draft";
  responses: number;
  targetResponses: number;
  deadline: string;
  estimatedTime: string;
}

const FeedbackEngagement: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"feedback" | "surveys" | "submit">(
    "feedback"
  );
  const [feedbackForm, setFeedbackForm] = useState({
    type: "suggestion" as const,
    title: "",
    description: "",
    rating: 5,
    category: "",
  });

  // Sample feedback data
  const feedbacks: Feedback[] = [
    {
      id: "FB-001",
      type: "suggestion",
      title: "Improve mobile app performance",
      description:
        "The mobile app is slow when loading employee profiles. Consider optimizing the data loading process.",
      rating: 4,
      category: "Technology",
      status: "reviewed",
      submittedBy: "John Smith",
      submittedAt: "2024-01-15T10:30:00Z",
      likes: 23,
      comments: 5,
    },
    {
      id: "FB-002",
      type: "compliment",
      title: "Excellent customer service",
      description:
        "The HR team was incredibly helpful with my benefits questions. Quick response and very professional.",
      rating: 5,
      category: "HR Services",
      status: "reviewed",
      submittedBy: "Sarah Johnson",
      submittedAt: "2024-01-14T14:20:00Z",
      likes: 18,
      comments: 3,
    },
    {
      id: "FB-003",
      type: "feature-request",
      title: "Add dark mode to portal",
      description:
        "It would be great to have a dark mode option for the employee portal, especially for those working late hours.",
      rating: 4,
      category: "User Experience",
      status: "pending",
      submittedBy: "Mike Chen",
      submittedAt: "2024-01-13T16:45:00Z",
      likes: 31,
      comments: 8,
    },
  ];

  // Sample survey data
  const surveys: Survey[] = [
    {
      id: "SV-001",
      title: "Q1 Employee Satisfaction Survey",
      description:
        "Help us understand your experience and satisfaction with your role and the company.",
      type: "satisfaction",
      status: "active",
      responses: 156,
      targetResponses: 200,
      deadline: "2024-01-31T23:59:59Z",
      estimatedTime: "10-15 minutes",
    },
    {
      id: "SV-002",
      title: "Remote Work Effectiveness",
      description:
        "Share your thoughts on remote work policies and tools to help us improve the experience.",
      type: "pulse",
      status: "active",
      responses: 89,
      targetResponses: 150,
      deadline: "2024-01-25T23:59:59Z",
      estimatedTime: "5-8 minutes",
    },
    {
      id: "SV-003",
      title: "Training & Development Needs",
      description:
        "Tell us about your learning preferences and development goals for the upcoming year.",
      type: "engagement",
      status: "completed",
      responses: 134,
      targetResponses: 120,
      deadline: "2024-01-15T23:59:59Z",
      estimatedTime: "8-12 minutes",
    },
  ];

  const categories = [
    "Technology",
    "HR Services",
    "User Experience",
    "Workplace",
    "Benefits",
    "Training",
    "Communication",
    "Other",
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "suggestion":
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case "complaint":
        return <ThumbsDown className="w-4 h-4 text-red-500" />;
      case "compliment":
        return <Heart className="w-4 h-4 text-pink-500" />;
      case "feature-request":
        return <Star className="w-4 h-4 text-purple-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "reviewed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "implemented":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getSurveyTypeColor = (type: string) => {
    switch (type) {
      case "satisfaction":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "engagement":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pulse":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "exit":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting feedback:", feedbackForm);
    // Reset form
    setFeedbackForm({
      type: "suggestion",
      title: "",
      description: "",
      rating: 5,
      category: "",
    });
    setActiveTab("feedback");
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onChange?: (rating: number) => void
  ) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
        onClick={interactive && onChange ? () => onChange(i + 1) : undefined}
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
                  Feedback & Engagement
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share your thoughts and participate in surveys
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6">
          <div className="flex space-x-8">
            {[
              {
                id: "feedback",
                label: "Community Feedback",
                icon: MessageSquare,
              },
              { id: "surveys", label: "Surveys", icon: Users },
              { id: "submit", label: "Submit Feedback", icon: Send },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {activeTab === "feedback" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Community Feedback
                </h2>
                <div className="space-y-6">
                  {feedbacks.map((feedback, index) => (
                    <motion.div
                      key={feedback.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getTypeIcon(feedback.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                  {feedback.title}
                                </h3>
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                    feedback.status
                                  )}`}
                                >
                                  {feedback.status}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">
                                  {feedback.category}
                                </span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 mb-4">
                                {feedback.description}
                              </p>
                              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <User className="w-4 h-4" />
                                  <span>{feedback.submittedBy}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {formatDate(feedback.submittedAt)}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>{feedback.likes} likes</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>{feedback.comments} comments</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 ml-4">
                              {renderStars(feedback.rating)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "surveys" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Available Surveys
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {surveys.map((survey, index) => (
                    <motion.div
                      key={survey.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {survey.title}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getSurveyTypeColor(
                                survey.type
                              )}`}
                            >
                              {survey.type}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {survey.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {survey.responses}/{survey.targetResponses}{" "}
                            responses
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                (survey.responses / survey.targetResponses) *
                                  100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {formatDate(survey.deadline)}</span>
                          </div>
                          <span>{survey.estimatedTime}</span>
                        </div>
                      </div>

                      {survey.status === "active" && (
                        <button
                          type="button"
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Take Survey
                        </button>
                      )}

                      {survey.status === "completed" && (
                        <div className="flex items-center justify-center py-2 text-green-600 dark:text-green-400">
                          <Award className="w-4 h-4 mr-2" />
                          <span className="font-medium">Completed</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "submit" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Submit Feedback
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <form onSubmit={handleSubmitFeedback} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Feedback Type *
                        </label>
                        <select
                          value={feedbackForm.type}
                          onChange={(e) =>
                            setFeedbackForm((prev) => ({
                              ...prev,
                              type: e.target.value as any,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="suggestion">Suggestion</option>
                          <option value="complaint">Complaint</option>
                          <option value="compliment">Compliment</option>
                          <option value="feature-request">
                            Feature Request
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category *
                        </label>
                        <select
                          value={feedbackForm.category}
                          onChange={(e) =>
                            setFeedbackForm((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={feedbackForm.title}
                        onChange={(e) =>
                          setFeedbackForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Brief summary of your feedback"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={feedbackForm.description}
                        onChange={(e) =>
                          setFeedbackForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        required
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Provide detailed feedback..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Overall Rating
                      </label>
                      <div className="flex items-center space-x-2">
                        {renderStars(feedbackForm.rating, true, (rating) =>
                          setFeedbackForm((prev) => ({ ...prev, rating }))
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          ({feedbackForm.rating}/5)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => setActiveTab("feedback")}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeedbackEngagement;