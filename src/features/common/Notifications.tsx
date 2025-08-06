import { motion } from "framer-motion";
import {
  AlertCircle,
  Bell,
  Check,
  CheckCircle,
  Clock,
  Info,
  X,
} from "lucide-react";
import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "info",
      title: "New Employee Onboarding",
      message: "Sarah Wilson has completed her onboarding process.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      type: "warning",
      title: "Leave Request Pending",
      message: "You have 3 leave requests waiting for approval.",
      time: "4 hours ago",
      read: false,
    },
    {
      id: "3",
      type: "success",
      title: "Payroll Processed",
      message: "Monthly payroll has been successfully processed.",
      time: "1 day ago",
      read: true,
    },
    {
      id: "4",
      type: "error",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur this weekend.",
      time: "2 days ago",
      read: true,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "info":
        return "border-l-blue-500";
      case "warning":
        return "border-l-yellow-500";
      case "success":
        return "border-l-green-500";
      case "error":
        return "border-l-red-500";
      default:
        return "border-l-gray-500";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notifications`
                  : "All notifications are read"}
              </p>
            </div>

            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Mark All as Read</span>
              </motion.button>
            )}
          </div>
        </header>

        {/* Notifications Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No notifications
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You're all caught up! Check back later for new notifications.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 ${getBorderColor(
                      notification.type
                    )} ${
                      !notification.read
                        ? "ring-2 ring-blue-100 dark:ring-blue-900"
                        : ""
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3
                                className={`text-lg font-medium ${
                                  !notification.read
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                            <p
                              className={`mt-1 ${
                                !notification.read
                                  ? "text-gray-600 dark:text-gray-400"
                                  : "text-gray-500 dark:text-gray-500"
                              }`}
                            >
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-4 mt-3">
                              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>{notification.time}</span>
                              </div>
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
