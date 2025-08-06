import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Shield } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import Sidebar from "../../components/Sidebar";

const ChangePassword: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChangeSuccess = () => {
    // You can redirect to dashboard, profile, or show a success modal
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
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
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <span>Change Password</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Update your account password for better security
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
            >
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    Security Notice
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    For your security, you'll be logged out from all devices
                    after changing your password. You'll need to log in again
                    with your new password.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Change Password Form */}
            <ChangePasswordForm
              onSuccess={handlePasswordChangeSuccess}
              onCancel={handleCancel}
              showCancelButton={true}
              title="Update Your Password"
              description="Choose a strong password to keep your account secure"
            />

            {/* Additional Security Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Password Requirements */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Password Requirements</span>
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>At least 8 characters long</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>Contains uppercase and lowercase letters</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>Includes at least one number</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span>Contains special characters (!@#$%^&*)</span>
                  </li>
                </ul>
              </div>

              {/* Security Best Practices */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Security Best Practices</span>
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span>Use a unique password for this account</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span>Avoid personal information</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span>Consider using a password manager</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span>Change passwords regularly</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Having trouble changing your password?{" "}
                <button
                  onClick={() => navigate("/help-desk")}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Contact Support
                </button>
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChangePassword;
