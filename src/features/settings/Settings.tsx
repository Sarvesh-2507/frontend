import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Database,
  Globe,
  Palette,
  Settings as SettingsIcon,
  Shield,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import Sidebar from "../../components/Sidebar";

const Settings: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const navigate = useNavigate();

  const settingsTabs = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "language", label: "Language", icon: Globe },
    { id: "data", label: "Data & Storage", icon: Database },
  ];

  const handlePasswordChangeSuccess = () => {
    // You can add any additional logic here after successful password change
    console.log("Password changed successfully in Settings page");
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
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                  <SettingsIcon className="w-8 h-8 text-blue-600" />
                  <span>Settings</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your account preferences and security settings
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Settings Navigation */}
              <div className="lg:col-span-1">
                <div className="card p-4">
                  <nav className="space-y-1">
                    {settingsTabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            activeTab === tab.id
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                              : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Settings Content */}
              <div className="lg:col-span-3">
                {/* Account Settings */}
                {activeTab === "account" && (
                  <ChangePasswordForm
                    onSuccess={handlePasswordChangeSuccess}
                    title="Change Password"
                    description="Update your account password for better security"
                    className="shadow-none border border-gray-200 dark:border-gray-700"
                  />
                )}

                {/* Other Settings Tabs */}
                {activeTab !== "account" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6"
                  >
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <SettingsIcon className="w-16 h-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {
                          settingsTabs.find((tab) => tab.id === activeTab)
                            ?.label
                        }{" "}
                        Settings
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        This section is coming soon.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
