import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Monitor,
  Clock,
  Users,
  Calendar,
  AlertTriangle,
  Check,
  Save
} from 'lucide-react';
import BackButton from '../../components/ui/BackButton';

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  settings: {
    email: boolean;
    push: boolean;
    sms: boolean;
    desktop: boolean;
  };
}

const NotificationSettings: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [globalSettings, setGlobalSettings] = useState({
    doNotDisturb: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: 'leave',
      title: 'Leave Requests',
      description: 'Notifications about leave applications and approvals',
      icon: Calendar,
      settings: {
        email: true,
        push: true,
        sms: false,
        desktop: true
      }
    },
    {
      id: 'attendance',
      title: 'Attendance',
      description: 'Daily attendance reminders and reports',
      icon: Clock,
      settings: {
        email: true,
        push: false,
        sms: false,
        desktop: false
      }
    },
    {
      id: 'team',
      title: 'Team Updates',
      description: 'Team announcements and collaboration updates',
      icon: Users,
      settings: {
        email: true,
        push: true,
        sms: false,
        desktop: true
      }
    },
    {
      id: 'system',
      title: 'System Alerts',
      description: 'Important system notifications and maintenance',
      icon: AlertTriangle,
      settings: {
        email: true,
        push: true,
        sms: true,
        desktop: true
      }
    }
  ]);

  const handleCategoryToggle = (categoryId: string, type: keyof NotificationCategory['settings'], value: boolean) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, settings: { ...cat.settings, [type]: value } }
        : cat
    ));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const notificationTypes = [
    { key: 'email' as const, label: 'Email', icon: Mail, description: 'Receive notifications via email' },
    { key: 'push' as const, label: 'Push', icon: Smartphone, description: 'Browser push notifications' },
    { key: 'sms' as const, label: 'SMS', icon: MessageSquare, description: 'Text message notifications' },
    { key: 'desktop' as const, label: 'Desktop', icon: Monitor, description: 'Desktop notifications' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BackButton to="/settings" label="Back to Settings" variant="default" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
              <Bell className="w-8 h-8 text-blue-600" />
              <span>Notifications</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Configure how you receive notifications
            </p>
          </div>
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

      {/* Global Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Global Settings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">General notification preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Do Not Disturb</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Temporarily disable all notifications</p>
            </div>
            <button
              onClick={() => setGlobalSettings(prev => ({ ...prev, doNotDisturb: !prev.doNotDisturb }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                globalSettings.doNotDisturb ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  globalSettings.doNotDisturb ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Quiet Hours</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Reduce notifications during specified hours</p>
            </div>
            <button
              onClick={() => setGlobalSettings(prev => ({ 
                ...prev, 
                quietHours: { ...prev.quietHours, enabled: !prev.quietHours.enabled }
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                globalSettings.quietHours.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  globalSettings.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {globalSettings.quietHours.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={globalSettings.quietHours.start}
                  onChange={(e) => setGlobalSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, start: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={globalSettings.quietHours.end}
                  onChange={(e) => setGlobalSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, end: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Notification Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notification Categories</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Choose how you want to be notified for different types of events</p>
        </div>

        <div className="space-y-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{category.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{category.description}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {notificationTypes.map((type) => {
                        const TypeIcon = type.icon;
                        return (
                          <div key={type.key} className="flex items-center space-x-2">
                            <button
                              onClick={() => handleCategoryToggle(category.id, type.key, !category.settings[type.key])}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                category.settings[type.key] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  category.settings[type.key] ? 'translate-x-5' : 'translate-x-1'
                                }`}
                              />
                            </button>
                            <div className="flex items-center space-x-1">
                              <TypeIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                              <span className="text-xs text-gray-600 dark:text-gray-400">{type.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationSettings;
