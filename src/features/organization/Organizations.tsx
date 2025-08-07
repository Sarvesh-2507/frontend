import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Eye,
  Plus,
  Search,
  Users,
  Edit,
  Trash2,
  Filter,
  Download,
  BarChart3,
  Settings,
  Globe,
  Building,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Routes, Route } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Logo from "../../components/ui/Logo";
import { organizationAPI } from "../../services/organizationApi";
import { Organization } from "../types/organization";

// Import submodule components
import OrganizationOverview from "./OrganizationOverview";
import Companies from "./Companies";
import Domains from "./Domains";
import CreateOrganization from "./CreateOrganization";

interface SubModule {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  description: string;
}

const Organizations: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubModule, setActiveSubModule] = useState("list");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const navigate = useNavigate();

  const subModules: SubModule[] = [
    {
      id: "overview",
      name: "Overview",
      icon: BarChart3,
      path: "/organizations",
      description: "View all organizations"
    },
    {
      id: "list",
      name: "All Companies",
      icon: Building2,
      path: "/organizations",
      description: "Manage all companies"
    },
    {
      id: "domains",
      name: "Departments",
      icon: Globe,
      path: "/organizations/domains",
      description: "Department management"
    },
    {
      id: "create",
      name: "Create Companies",
      icon: Plus,
      path: "/organizations/create",
      description: "Add new company"
    }
  ];

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await organizationAPI.getOrganizations();
      setOrganizations(response.data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrganization = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this organization?")) {
      return;
    }

    try {
      await organizationAPI.deleteOrganization(id);
      setOrganizations(prev => prev.filter(org => org.id !== id));
      toast.success("Organization deleted successfully");
    } catch (error) {
      console.error("Error deleting organization:", error);
      toast.error("Failed to delete organization");
    }
  };

  const handleCreateOrganization = () => {
    navigate("/organizations/create");
  };

  const handleSubModuleClick = (subModule: SubModule) => {
    setActiveSubModule(subModule.id);
    navigate(subModule.path);
  };

  const filteredOrganizations = organizations.filter((org) =>
    org.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewOrganization = (orgId: number) => {
    navigate(`/organizations/${orgId}`);
  };

  const handleViewCompanies = (orgId: number) => {
    navigate(`/organizations/${orgId}/companies`);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                title="Go back to dashboard"
                onClick={() => navigate("/dashboard")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Logo width={100} height={25} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Organizations
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your organization and companies
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate("/organizations/create")}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Company</span>
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </header>

        {/* Submodule Navigation */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-3">
            <div className="flex space-x-1 overflow-x-auto">
              {subModules.map((subModule) => {
                const Icon = subModule.icon;
                const isActive = activeSubModule === subModule.id;
                return (
                  <button
                    key={subModule.id}
                    onClick={() => handleSubModuleClick(subModule)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{subModule.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Organizations Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrganizations.map((org) => (
                  <motion.div
                    key={org.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {org.company_name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {org.id}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Active
                      </span>
                    </div>

                    {org.industry_type && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        Industry: {org.industry_type}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Created:{" "}
                          {new Date(org.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleViewOrganization(org.id)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleViewCompanies(org.id)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Users className="w-4 h-4" />
                        <span>Companies</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredOrganizations.length === 0 && !loading && (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No organizations found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Get started by creating your first organization"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Organizations;
