import {
  BarChart3,
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  Home as HomeIcon,
  LogOut,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../components/ui/Logo";
import { useAuthStore } from "../../context/authStore";
import Assets from "../../features/assets/Assets";
import Attendance from "../../features/attendance/Attendance";
import EmployeeProfile from "../../features/employee/EmployeeProfile";
import HelpDesk from "../../features/help-desk/HelpDesk";
import Leave from "../../features/leave/Leave";
import Offboarding from "../../features/offboarding/Offboarding";
import Onboarding from "../../features/onboarding/Onboarding";
import Companies from "../../features/organization/Companies";
import Domains from "../../features/organization/Domains";
import OrganizationOverview from "../../features/organization/OrganizationOverview";
import Organizations from "../../features/organization/Organizations";
import Payroll from "../../features/payroll/Payroll";
import Performance from "../../features/performance/Performance";
import Recruitment from "../../features/recruitment/Recruitment";

interface Module {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  submodules?: Module[];
}

const Dashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>("home");
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const modules: Module[] = [
    {
      id: "home",
      name: "Home",
      icon: HomeIcon,
      path: "/home",
    },
    {
      id: "dashboard",
      name: "Dashboard",
      icon: BarChart3,
      path: "/dashboard",
    },
    {
      id: "organizations",
      name: "Organization",
      icon: Building2,
      path: "/organizations",
      submodules: [
        {
          id: "org-overview",
          name: "Overview",
          icon: BarChart3,
          path: "/organizations/overview",
        },
        {
          id: "org-list",
          name: "All Companies",
          icon: Building2,
          path: "/organizations",
        },
        {
          id: "domains",
          name: "Domains",
          icon: Building2,
          path: "/organizations/domains",
        },
      ],
    },
    {
      id: "recruitment",
      name: "Recruitment",
      icon: Search,
      path: "/recruitment",
    },
    {
      id: "onboarding",
      name: "Onboarding",
      icon: Users,
      path: "/onboarding",
    },
    {
      id: "employee",
      name: "Employee",
      icon: Users,
      path: "/employee-profile",
    },
    {
      id: "leave",
      name: "Leave",
      icon: Calendar,
      path: "/leave",
    },
    {
      id: "attendance",
      name: "Attendance",
      icon: Clock,
      path: "/attendance",
    },
    {
      id: "performance",
      name: "Performance",
      icon: TrendingUp,
      path: "/performance",
    },
    {
      id: "payroll",
      name: "Payroll",
      icon: FileText,
      path: "/payroll",
    },
    {
      id: "assets",
      name: "Assets",
      icon: FileText,
      path: "/assets",
    },
    {
      id: "offboarding",
      name: "Offboarding",
      icon: LogOut,
      path: "/offboarding",
    },
    {
      id: "help-desk",
      name: "Help Desk",
      icon: HelpCircle,
      path: "/help-desk",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const toggleModule = (id: string) => {
    setExpandedModules((prev) =>
      prev.includes(id) ? prev.filter((mod) => mod !== id) : [...prev, id]
    );
  };

  const filteredModules = modules.filter((module) =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Logo width={120} height={40} />
        </div>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul>
            {filteredModules.map((module) => (
              <li key={module.id}>
                <div
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                    location.pathname === module.path
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() =>
                    module.submodules
                      ? toggleModule(module.id)
                      : handleNavigate(module.path)
                  }
                >
                  <div className="flex items-center">
                    <module.icon className="w-5 h-5 mr-3" />
                    <span>{module.name}</span>
                  </div>
                  {module.submodules && (
                    <ChevronRight
                      className={`w-5 h-5 transition-transform ${
                        expandedModules.includes(module.id) ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </div>
                {module.submodules && expandedModules.includes(module.id) && (
                  <ul className="pl-8 bg-gray-50 dark:bg-gray-700">
                    {module.submodules.map((submodule) => (
                      <li key={submodule.id}>
                        <div
                          className={`flex items-center px-4 py-2 cursor-pointer transition-colors ${
                            location.pathname === submodule.path
                              ? "text-blue-500 font-semibold"
                              : "text-gray-600 dark:text-gray-400 hover:text-blue-500"
                          }`}
                          onClick={() => handleNavigate(submodule.path)}
                        >
                          <submodule.icon className="w-4 h-4 mr-2" />
                          <span>{submodule.name}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div
            className="flex items-center px-4 py-3 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to MH Cognition HR Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Select a module from the sidebar to get started.
              </p>
            </div>
          } />
          <Route
            path="/organizations/overview"
            element={<OrganizationOverview />}
          />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/organizations/companies" element={<Companies />} />
          <Route path="/organizations/domains" element={<Domains />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/employee-profile" element={<EmployeeProfile />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/offboarding" element={<Offboarding />} />
          <Route path="/help-desk" element={<HelpDesk />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
