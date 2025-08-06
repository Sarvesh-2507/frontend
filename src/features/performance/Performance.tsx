import { motion } from "framer-motion";
import {
  Award,
  BarChart3,
  Calendar,
  Edit,
  Eye,
  Plus,
  Star,
  Target,
} from "lucide-react";
import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

interface PerformanceReview {
  id: string;
  employeeName: string;
  department: string;
  reviewPeriod: string;
  overallRating: number;
  goals: number;
  competencies: number;
  status: "draft" | "pending" | "completed";
  reviewDate: string;
}

interface Goal {
  id: string;
  employeeName: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  status: "not-started" | "in-progress" | "completed" | "overdue";
}

const Performance: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("reviews");

  const performanceReviews: PerformanceReview[] = [
    {
      id: "1",
      employeeName: "John Doe",
      department: "Engineering",
      reviewPeriod: "Q4 2023",
      overallRating: 4.2,
      goals: 85,
      competencies: 90,
      status: "completed",
      reviewDate: "2024-01-15",
    },
    {
      id: "2",
      employeeName: "Sarah Wilson",
      department: "Marketing",
      reviewPeriod: "Q4 2023",
      overallRating: 4.5,
      goals: 92,
      competencies: 88,
      status: "completed",
      reviewDate: "2024-01-20",
    },
    {
      id: "3",
      employeeName: "Mike Johnson",
      department: "HR",
      reviewPeriod: "Q1 2024",
      overallRating: 0,
      goals: 0,
      competencies: 0,
      status: "pending",
      reviewDate: "2024-02-15",
    },
  ];

  const goals: Goal[] = [
    {
      id: "1",
      employeeName: "John Doe",
      title: "Complete React Certification",
      description:
        "Obtain React Developer Certification to improve frontend skills",
      targetDate: "2024-03-31",
      progress: 75,
      status: "in-progress",
    },
    {
      id: "2",
      employeeName: "Sarah Wilson",
      title: "Lead Marketing Campaign",
      description:
        "Successfully launch and manage Q1 product marketing campaign",
      targetDate: "2024-03-15",
      progress: 60,
      status: "in-progress",
    },
    {
      id: "3",
      employeeName: "Mike Johnson",
      title: "Implement New HR System",
      description:
        "Research and implement new HRIS for better employee management",
      targetDate: "2024-04-30",
      progress: 30,
      status: "in-progress",
    },
  ];

  const performanceStats = [
    {
      title: "Avg. Performance",
      value: "4.3/5",
      change: "+0.2",
      changeType: "increase" as const,
      icon: BarChart3,
      color: "bg-blue-500",
    },
    {
      title: "Goals Completed",
      value: "87%",
      change: "+5%",
      changeType: "increase" as const,
      icon: Target,
      color: "bg-green-500",
    },
    {
      title: "Reviews Pending",
      value: "12",
      change: "-3",
      changeType: "decrease" as const,
      icon: Calendar,
      color: "bg-yellow-500",
    },
    {
      title: "Top Performers",
      value: "24",
      change: "+2",
      changeType: "increase" as const,
      icon: Award,
      color: "bg-purple-500",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "in-progress":
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "overdue":
      case "not-started":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
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
        <header className="header-modern px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <span>Performance Management</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage employee performance reviews, goals, and development
                plans
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Review</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Target className="w-4 h-4" />
                <span>Set Goals</span>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="stat-card"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p
                          className={`text-sm ${
                            stat.changeType === "increase"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {stat.change} from last quarter
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  activeTab === "reviews"
                    ? "bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Performance Reviews
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("goals")}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  activeTab === "goals"
                    ? "bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Goals & Objectives
              </button>
            </div>

            {/* Performance Reviews */}
            {activeTab === "reviews" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Performance Reviews
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Employee
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Department
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Period
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Overall Rating
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Goals
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceReviews.map((review) => (
                        <tr
                          key={review.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {review.employeeName}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {review.department}
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {review.reviewPeriod}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {getRatingStars(review.overallRating)}
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {review.overallRating > 0
                                  ? review.overallRating.toFixed(1)
                                  : "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {review.goals > 0 ? `${review.goals}%` : "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                review.status
                              )}`}
                            >
                              {review.status.charAt(0).toUpperCase() +
                                review.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                title="View Review"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400"
                                title="Edit Review"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Goals & Objectives */}
            {activeTab === "goals" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Goals & Objectives
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goals.map((goal) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {goal.title}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            goal.status
                          )}`}
                        >
                          {goal.status.replace("-", " ")}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {goal.description}
                      </p>

                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {goal.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Due: {goal.targetDate}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {goal.employeeName}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Performance;
