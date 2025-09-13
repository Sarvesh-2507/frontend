import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Edit,
  Plus,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Logo from "../../components/ui/Logo";
import { organizationAPI } from "../../services/organizationApi";
// import { Company, Organization } from "../types/organization";

const OrganizationDetail: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [organization, setOrganization] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchOrganizationData(parseInt(id));
    }
  }, [id]);

  const fetchOrganizationData = async (orgId: number) => {
    try {
      setLoading(true);
      const [orgResponse, companiesResponse] = await Promise.all([
        organizationAPI.getOrganization(orgId),
        organizationAPI.getOrganizationCompanies(orgId),
      ]);
      setOrganization(orgResponse.data);
      setCompanies(companiesResponse.data);
    } catch (error) {
      console.error("Error fetching organization data:", error);
      toast.error("Failed to fetch organization details");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCompany = (companyCode: string) => {
    navigate(`/organizations/${id}/companies/${companyCode}`);
  };

  const handleAddCompany = () => {
    navigate(`/organizations/${id}/companies/add`);
  };

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

  if (!organization) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Organization not found
            </h2>
            <button
              type="button"
              onClick={() => navigate("/organizations")}
              className="text-blue-600 hover:text-blue-700"
            >
              Back to Organizations
            </button>
          </div>
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
                onClick={() => navigate("/organizations")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Back to Organizations"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Logo width={100} height={25} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {organization.company_name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Organization Details
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleAddCompany}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Company</span>
              </button>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Edit Organization"
              >
                <Edit className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Organization Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {organization.company_name}
                    </h2>
                    {organization.industry_type && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Industry: {organization.industry_type}
                      </p>
                    )}
                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Created:{" "}
                          {new Date(
                            organization.created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{companies.length} Companies</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    organization.is_active
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {organization.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </motion.div>

            {/* Companies Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Companies ({companies.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddCompany}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Add Company
                  </button>
                </div>
              </div>

              <div className="p-6">
                {companies.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companies.map((company) => (
                      <div
                        key={company.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleViewCompany(company.company_code)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {company.name}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              company.is_active
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {company.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Code: {company.company_code}
                        </p>
                        {company.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {company.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No companies yet
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Get started by adding your first company to this
                      organization.
                    </p>
                    <button
                      type="button"
                      onClick={handleAddCompany}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Company
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrganizationDetail;
