import React from 'react';
import { Calendar, Star } from 'lucide-react';

const holidays = [
  { date: '2025-09-15', name: 'Ganesh Chaturthi' },
  { date: '2025-10-02', name: 'Gandhi Jayanti' },
  { date: '2025-11-01', name: 'Diwali' },
];

const UpcomingHolidaysWidget: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
      <Calendar className="w-5 h-5 text-green-500" /> Upcoming Holidays
    </h3>
    <ul className="space-y-2">
      {holidays.map((h, i) => (
        <li key={i} className="flex items-center gap-3">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-800 dark:text-gray-200">{h.name} - {new Date(h.date).toLocaleDateString()}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default UpcomingHolidaysWidget;
