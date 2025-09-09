import React from 'react';
import { Gift, Calendar, Users } from 'lucide-react';

interface Highlight {
  type: 'birthday' | 'anniversary';
  label: string;
  value: string;
}

const highlights: Highlight[] = [
  { type: 'birthday', label: "It's your birthday!", value: 'Employee' },
  { type: 'anniversary', label: "Work Anniversary", value: '2 years at Company' },
];

const iconMap = {
  birthday: Gift,
  anniversary: Calendar,
};

const HighlightsWidget: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
      <Users className="w-5 h-5 text-blue-500" /> Highlights
    </h3>
    <div className="space-y-2">
      {highlights.map((h, i) => {
        const Icon = iconMap[h.type];
        return (
          <div key={i} className="flex items-center gap-3 bg-blue-50/60 dark:bg-blue-900/40 rounded-lg px-3 py-2">
            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{h.label}: {h.value}</span>
          </div>
        );
      })}
    </div>
  </div>
);

export default HighlightsWidget;
