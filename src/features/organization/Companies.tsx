import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building,
  Calendar,
  Code,
  Eye,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Logo from "../../components/ui/Logo";
import { organizationAPI } from "../../services/organizationApi";
// import { Company, Organization } from "../types/organization";

const Companies: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [organization, setOrganization] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();

  useEffect(() => {
    if (orgId) {
      fetchData(parseInt(orgId));
    }
  }, [orgId]);

  const fetchData = async (organizationId: number) => {
    try {
      setLoading(true);
      const [orgResponse, companiesResponse] = await Promise.all([
        organizationAPI.getOrganization(organizationId),
        organizationAPI.getOrganizationCompanies(organizationId),
      ]);
      setOrganization(orgResponse.data);
      setCompanies(companiesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.company_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewCompany = (companyCode: string) => {
    navigate(`/organizations/${orgId}/companies/${companyCode}`);
  };

  const handleViewDomains = (companyCode: string) => {
    navigate(`/organizations/${orgId}/companies/${companyCode}/domains`);
  };

  const handleAddCompany = () => {
    navigate(`/organizations/${orgId}/companies/add`);
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
                onClick={() => navigate(`/organizations/${orgId}`)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Back to Organization"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Logo width={100} height={25} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Companies
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {organization?.company_name} - Manage companies
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddCompany}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Company</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Search */}
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

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {company.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                          <Code className="w-3 h-3" />
                          <span>{company.company_code}</span>
                        </p>
                      </div>
                    </div>
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

                  {company.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {company.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Created:{" "}
                        {new Date(company.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleViewCompany(company.company_code)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewDomains(company.company_code)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Domains</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredCompanies.length === 0 && (
              <div className="text-center py-12">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No companies found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Get started by creating your first company"}
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
        </main>
      </div>
    </div>
  );
};

export default Companies;
