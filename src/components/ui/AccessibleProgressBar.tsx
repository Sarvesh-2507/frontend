import React from 'react';

interface AccessibleProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  colorClassName?: string;
  height?: string;
  showLabel?: boolean;
}

/**
 * An accessible progress bar component that uses native HTML5 progress element
 * with proper ARIA attributes for accessibility.
 */
const AccessibleProgressBar: React.FC<AccessibleProgressBarProps> = ({
  value,
  max = 100,
  label = 'Progress',
  colorClassName = 'bg-blue-600',
  height = 'h-2',
  showLabel = false,
}) => {
  // Ensure value is within bounds
  const safeValue = Math.min(Math.max(0, value), max);
  const percentage = (safeValue / max) * 100;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs font-medium mb-1">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="relative">
        {/* Using HTML5 native progress element for best accessibility */}
        <progress
          value={safeValue}
          max={max}
          className="w-full opacity-0 absolute h-0"
          aria-label={label}
        />
        {/* Visual representation (the native progress element styling is hidden but remains accessible) */}
        <div className={`w-full rounded-full bg-gray-200 dark:bg-gray-700 ${height}`}>
          <div
            className={`rounded-full ${colorClassName} ${height}`}
            style={{ width: `${percentage}%` }}
            role="presentation"
          />
        </div>
      </div>
    </div>
  );
};

export default AccessibleProgressBar;
