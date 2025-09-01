import React from "react";

interface Highlight {
  type: "celebration" | "birthday" | "anniversary" | "holiday";
  label: string;
  value: string;
}

interface HighlightsWidgetProps {
  highlights: Highlight[];
}

const HighlightsWidget: React.FC<HighlightsWidgetProps> = ({ highlights }) => {
  if (!highlights.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
        <p className="text-gray-700 dark:text-white text-center">No highlights today</p>
      </div>
    );
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Today's Highlights</h3>
      <ul className="space-y-2">
        {highlights.map((h, i) => (
          <li key={i} className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="font-medium capitalize dark:text-white">{h.type}:</span>
            <span className="dark:text-white">{h.label} {h.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HighlightsWidget;
