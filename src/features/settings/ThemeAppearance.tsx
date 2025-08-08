import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
  Save
} from 'lucide-react';
import { useThemeStore } from '../../context/themeStore';
import BackButton from '../../components/ui/BackButton';

const ThemeAppearance: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    compactMode: false,
    animations: true,
    fontSize: 'medium',
    accentColor: 'blue'
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const themeOptions = [
    {
      id: 'light',
      name: 'Light',
      description: 'Clean and bright interface',
      icon: Sun,
      active: !isDark
    },
    {
      id: 'dark',
      name: 'Dark',
      description: 'Easy on the eyes in low light',
      icon: Moon,
      active: isDark
    },
    {
      id: 'system',
      name: 'System',
      description: 'Follow system preference',
      icon: Monitor,
      active: false
    }
  ];

  const accentColors = [
    { name: 'Blue', value: 'blue', color: 'bg-blue-500' },
    { name: 'Green', value: 'green', color: 'bg-green-500' },
    { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
    { name: 'Red', value: 'red', color: 'bg-red-500' },
    { name: 'Orange', value: 'orange', color: 'bg-orange-500' },
    { name: 'Pink', value: 'pink', color: 'bg-pink-500' }
  ];

  const fontSizes = [
    { name: 'Small', value: 'small' },
    { name: 'Medium', value: 'medium' },
    { name: 'Large', value: 'large' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <BackButton to="/settings" label="Back to Settings" variant="default" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
              <Palette className="w-8 h-8 text-blue-600" />
              <span>Theme & Appearance</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Customize the look and feel of your application
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

      {/* Theme Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Theme Mode</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred theme</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themeOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (option.id === 'light' && isDark) toggleTheme();
                  if (option.id === 'dark' && !isDark) toggleTheme();
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  option.active
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`p-3 rounded-lg ${
                    option.active 
                      ? 'bg-blue-100 dark:bg-blue-900/30' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      option.active 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium text-gray-900 dark:text-white">{option.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{option.description}</p>
                  </div>
                  {option.active && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Accent Color */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Accent Color</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred accent color</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {accentColors.map((color) => (
            <motion.button
              key={color.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSettings(prev => ({ ...prev, accentColor: color.value }))}
              className={`p-3 rounded-lg border-2 transition-all ${
                settings.accentColor === color.value
                  ? 'border-gray-400 dark:border-gray-500'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-8 h-8 rounded-full ${color.color}`} />
                <span className="text-xs font-medium text-gray-900 dark:text-white">{color.name}</span>
                {settings.accentColor === color.value && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Display Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Display Options</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Customize your display preferences</p>
        </div>

        <div className="space-y-6">
          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
              Font Size
            </label>
            <div className="flex space-x-3">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setSettings(prev => ({ ...prev, fontSize: size.value }))}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    settings.fontSize === size.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Compact Mode</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Reduce spacing and padding</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, compactMode: !prev.compactMode }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.compactMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.compactMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Animations</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Enable smooth transitions and animations</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, animations: !prev.animations }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.animations ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.animations ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ThemeAppearance;
