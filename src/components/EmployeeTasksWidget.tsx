import React from 'react';
import { ClipboardList, CheckCircle } from 'lucide-react';

const tasks = [
  { id: 1, title: 'Submit expense report', done: false },
  { id: 2, title: 'Update profile details', done: true },
  { id: 3, title: 'Review leave balance', done: false },
];

const EmployeeTasksWidget: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
      <ClipboardList className="w-5 h-5 text-purple-500" /> My Tasks
    </h3>
    <ul className="space-y-2">
      {tasks.map(task => (
        <li key={task.id} className="flex items-center gap-2">
          <CheckCircle className={`w-4 h-4 ${task.done ? 'text-green-500' : 'text-gray-300'}`} />
          <span className={`text-sm ${task.done ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>{task.title}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default EmployeeTasksWidget;
