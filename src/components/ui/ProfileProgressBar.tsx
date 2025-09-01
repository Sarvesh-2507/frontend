import React from "react";

interface ProfileProgressBarProps {
  percent: number;
}

const getColor = (percent: number) => {
  if (percent <= 30) return "bg-red-500";
  if (percent <= 70) return "bg-yellow-400";
  return "bg-green-500";
};

const ProfileProgressBar: React.FC<ProfileProgressBarProps> = ({ percent }) => {
  const color = getColor(percent);
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Profile Completion</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{percent}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProfileProgressBar;
