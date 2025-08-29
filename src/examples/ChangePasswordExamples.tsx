import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import ChangePasswordForm from '../components/ChangePasswordForm';

// Example 1: Modal Usage
export const ChangePasswordModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSuccess = () => {
    console.log('Password changed successfully in modal!');
    // Close modal after success
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Change Password
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close modal"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4">
          <ChangePasswordForm
            onSuccess={handleSuccess}
            onCancel={onClose}
            showCancelButton={true}
            className="shadow-none border-0 p-0"
            title=""
            description="Update your password to keep your account secure"
          />
        </div>
      </motion.div>
    </div>
  );
};

// Example 2: Inline Card Usage
export const InlineChangePassword: React.FC = () => {
  const handleSuccess = () => {
    console.log('Password changed successfully inline!');
    // You could show a success message, redirect, etc.
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ChangePasswordForm
        onSuccess={handleSuccess}
        title="Security Settings"
        description="Keep your account secure by updating your password regularly"
      />
    </div>
  );
};

// Example 3: Compact Version
export const CompactChangePassword: React.FC = () => {
  const handleSuccess = () => {
    console.log('Password changed successfully in compact form!');
  };

  return (
    <div className="max-w-md mx-auto">
      <ChangePasswordForm
        onSuccess={handleSuccess}
        className="shadow-sm border border-gray-200 dark:border-gray-700"
        title="Quick Password Change"
        description="Update your password"
      />
    </div>
  );
};

// Example 4: Usage with Custom Success Handler
export const CustomSuccessChangePassword: React.FC = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSuccess = () => {
    setShowSuccessMessage(true);
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
    
    // You could also:
    // - Redirect to another page
    // - Update user state
    // - Show a different UI
    // - Log the user out and require re-login
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-green-800 dark:text-green-300 font-medium">
              Password updated successfully! You'll be logged out from all devices for security.
            </p>
          </div>
        </motion.div>
      )}
      
      <ChangePasswordForm
        onSuccess={handleSuccess}
        title="Account Security"
        description="Change your password to maintain account security"
      />
    </div>
  );
};

// Example 5: Demo Component with All Examples
export const ChangePasswordDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeExample, setActiveExample] = useState<string>('inline');

  const examples = [
    { id: 'inline', label: 'Inline Form', component: <InlineChangePassword /> },
    { id: 'compact', label: 'Compact Form', component: <CompactChangePassword /> },
    { id: 'custom', label: 'Custom Success Handler', component: <CustomSuccessChangePassword /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Change Password Component Examples
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Different ways to use the ChangePasswordForm component
          </p>
        </div>

        {/* Modal Example Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Open Modal Example
          </button>
        </div>

        {/* Example Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => setActiveExample(example.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeExample === example.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Example */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {examples.find(e => e.id === activeExample)?.label}
          </h2>
          {examples.find(e => e.id === activeExample)?.component}
        </div>

        {/* Modal */}
        <ChangePasswordModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default ChangePasswordDemo;
