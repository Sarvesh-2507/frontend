import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  Shield,
  User,
  Globe,
  Monitor,
  Sun,
  Moon,
  Save,
  Check
} from 'lucide-react';
import { useThemeStore } from '../context/themeStore';

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, description, icon: Icon, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
};

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    desktop: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    activityTracking: false,
    dataSharing: false
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account preferences and application settings.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Theme & Appearance */}
      <SettingsSection
        title="Theme & Appearance"
        description="Customize the look and feel of your application"
        icon={Palette}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Theme Mode</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => !isDark && toggleTheme()}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  !isDark
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                onClick={() => isDark && toggleTheme()}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isDark
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection
        title="Notifications"
        description="Configure how you receive notifications"
        icon={Bell}
      >
        <div className="space-y-2">
          <Toggle
            label="Email Notifications"
            description="Receive notifications via email"
            checked={notifications.email}
            onChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
          />
          <Toggle
            label="Push Notifications"
            description="Receive push notifications in browser"
            checked={notifications.push}
            onChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
          />
          <Toggle
            label="SMS Notifications"
            description="Receive important updates via SMS"
            checked={notifications.sms}
            onChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
          />
          <Toggle
            label="Desktop Notifications"
            description="Show desktop notifications"
            checked={notifications.desktop}
            onChange={(checked) => setNotifications(prev => ({ ...prev, desktop: checked }))}
          />
        </div>
      </SettingsSection>

      {/* Security & Privacy */}
      <SettingsSection
        title="Security & Privacy"
        description="Manage your security and privacy preferences"
        icon={Shield}
      >
        <div className="space-y-2">
          <Toggle
            label="Profile Visibility"
            description="Make your profile visible to other employees"
            checked={privacy.profileVisible}
            onChange={(checked) => setPrivacy(prev => ({ ...prev, profileVisible: checked }))}
          />
          <Toggle
            label="Activity Tracking"
            description="Allow tracking of your activity for analytics"
            checked={privacy.activityTracking}
            onChange={(checked) => setPrivacy(prev => ({ ...prev, activityTracking: checked }))}
          />
          <Toggle
            label="Data Sharing"
            description="Share anonymized data for product improvement"
            checked={privacy.dataSharing}
            onChange={(checked) => setPrivacy(prev => ({ ...prev, dataSharing: checked }))}
          />
        </div>
      </SettingsSection>

      {/* General Settings */}
      <SettingsSection
        title="General Settings"
        description="Basic application preferences"
        icon={SettingsIcon}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Language
            </label>
            <select className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Timezone
            </label>
            <select className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
              <option>UTC-5 (Eastern Time)</option>
              <option>UTC-6 (Central Time)</option>
              <option>UTC-7 (Mountain Time)</option>
              <option>UTC-8 (Pacific Time)</option>
            </select>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

export default Settings;
