import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  FileText,
  DollarSign,
  Users,
  BookOpen,
  UserCircle,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../components/ui/Logo";
import { useEmployeeProfile } from "./useEmployeeProfile";

const sidebarItems = [
  { label: "Home", icon: User, path: "/emp-home" },
  { label: "Profile", icon: Users, path: "profile" },
  { label: "Attendance", icon: Calendar, path: "attendance" },
  { label: "Leave", icon: FileText, path: "leave" },
  { label: "Payroll", icon: DollarSign, path: "payroll" },
  { label: "Policies", icon: BookOpen, path: "policies" },
];

const EmployeeSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, loading, error } = useEmployeeProfile();
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen p-4 flex flex-col items-center relative">
      {/* Logo */}
      <div className="mb-6 w-full flex justify-center">
        <Logo height={40} />
      </div>
      {/* EMP Avatar Badge */}
      <button
        className="mb-4 flex flex-col items-center group focus:outline-none"
        onClick={() => navigate("/emp-home/profile")}
        aria-label="Go to Employee Profile"
      >
        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg border-4 border-blue-200 dark:border-blue-800 mb-1">
          <span className="text-white text-xl font-bold">
            {profile?.first_name
              ? profile.first_name[0] +
                (profile.last_name ? profile.last_name[0] : "")
              : "EMP"}
          </span>
        </div>
        <span className="text-xs text-blue-700 dark:text-blue-200 font-semibold group-hover:underline">
          Profile
        </span>
      </button>
      {/* Sidebar Navigation */}
      <nav className="space-y-2 w-full">
        {sidebarItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900 ${
              location.pathname === item.path
                ? "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white"
                : ""
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      {/* Profile Popup (reuse HR logic, but for employee fields) */}
      {/* Footer with Change Password and Logout */}
      <div className="absolute bottom-4 left-0 w-full flex flex-col gap-2 px-4">
        <button
          className="w-full py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={() => navigate("/emp-home/change-password")}
        >
          Change Password
        </button>
        <button
          className="w-full py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-semibold hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;
