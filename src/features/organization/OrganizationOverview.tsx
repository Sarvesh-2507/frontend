import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  Building,
  Building2,
  Eye,
  Globe,
  Plus,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Logo from "../../components/ui/Logo";
import { organizationAPI } from "../../services/organizationApi";
import { Organization } from "../types/organization";

const OrganizationOverview: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    totalCompanies: 0,
    totalDomains: 0,
    activeOrganizations: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await organizationAPI.getOrganizations();
      const orgs = response.data;
      setOrganizations(orgs);

      // Calculate stats
      let totalCompanies = 0;
      let totalDomains = 0;

      for (const org of orgs) {
        try {
          const companiesResponse =
            await organizationAPI.getOrganizationCompanies(org.id);
          totalCompanies += companiesResponse.data.length;

          for (const company of companiesResponse.data) {
            try {
              const domainsResponse = await organizationAPI.getCompanyDomains(
                org.id,
                company.company_code
              );
              totalDomains += domainsResponse.data.length;
            } catch (error) {
              console.warn(
                `Failed to fetch domains for company ${company.company_code}`
              );
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch companies for organization ${org.id}`);
        }
      }

      setStats({
        totalOrganizations: orgs.length,
        totalCompanies,
        totalDomains,
        activeOrganizations: orgs.length, // All organizations are considered active
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch organization data");
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    color: string;
  }> = ({ title, value, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

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
                onClick={() => navigate("/dashboard")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Logo width={100} height={25} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Organization Overview
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete view of your organizational structure
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/organizations")}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>View All Organizations</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Organizations"
                value={stats.totalOrganizations}
                icon={Building2}
                color="bg-blue-500"
              />
              <StatCard
                title="Active Organizations"
                value={stats.activeOrganizations}
                icon={BarChart3}
                color="bg-green-500"
              />
              <StatCard
                title="Total Companies"
                value={stats.totalCompanies}
                icon={Building}
                color="bg-purple-500"
              />
              <StatCard
                title="Total Domains"
                value={stats.totalDomains}
                icon={Globe}
                color="bg-orange-500"
              />
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/organizations")}
                  className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Manage Organizations
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      View and manage all organizations
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/organizations/create")}
                  className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Plus className="w-8 h-8 text-green-600" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Add Organization
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Create a new organization
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/organizations/analytics")}
                  className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      View Analytics
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Organization performance metrics
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Recent Organizations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Organizations
                </h2>
                <button
                  type="button"
                  onClick={() => navigate("/organizations")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {organizations.slice(0, 5).map((org) => (
                  <div
                    key={org.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => navigate(`/organizations/${org.id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {org.company_name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Created:{" "}
                          {new Date(org.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrganizationOverview;
