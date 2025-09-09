import React from 'react';
import { EmployeeDashboard } from '../../features/attendance/AttendanceLeaveModule';

const AttendancePage: React.FC = () => (
	<div className="p-6"><h1 className="text-2xl font-bold mb-4">Attendance</h1><div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700"><EmployeeDashboard /></div></div>
);

export default AttendancePage;
