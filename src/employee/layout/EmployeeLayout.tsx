import React from "react";
import EmployeeSpecificSidebar from "../components/EmployeeSpecificSidebar";
import { Outlet } from "react-router-dom";

const EmployeeLayout: React.FC = () => (
  <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
    <EmployeeSpecificSidebar />
    <div className="flex-1 overflow-y-auto">
      <Outlet />
    </div>
  </div>
);

export default EmployeeLayout;
