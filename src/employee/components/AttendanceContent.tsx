import React from "react";
import { EmployeeDashboard } from "../../features/attendance/AttendanceLeaveModule";

const AttendanceContent: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
      <EmployeeDashboard />
    </div>
  );
};

export default AttendanceContent;
