import { Bell, ChevronDown, Settings, User } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HRProfile from './HRProfile';

interface HeaderProfileButtonProps {
  profileData: {
    firstName: string;
    lastName: string;
    position: string;
  };
}

const HeaderProfileButton: React.FC<HeaderProfileButtonProps> = ({ profileData }) => {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={toggleProfile}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-medium">
            {profileData.firstName.charAt(0)}
            {profileData.lastName.charAt(0)}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {profileData.firstName} {profileData.lastName}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {profileData.position}
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Profile Dropdown/Modal */}
      {showProfile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end p-4">
              <button
                onClick={toggleProfile}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <HRProfile />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderProfileButton;
