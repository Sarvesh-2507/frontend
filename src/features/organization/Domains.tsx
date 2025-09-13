import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building,
  Building2,
  Calendar,
  Code,
  Eye,
  Globe,
  Plus,
  Search,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Logo from "../../components/ui/Logo";
import { organizationAPI } from "../../services/organizationApi";
// import { Company, Domain, Organization } from "../types/organization";

const Domains: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [organization, setOrganization] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { orgId, companyCode } = useParams<{
    orgId: string;
    companyCode: string;
  }>();

  useEffect(() => {
    if (orgId && companyCode) {
      fetchData(parseInt(orgId), companyCode);
    }
  }, [orgId, companyCode]);

  const fetchData = async (
    organizationId: number,
    companyCodeParam: string
  ) => {
    try {
      setLoading(true);
      const [orgResponse, companyResponse, domainsResponse] = await Promise.all(
        [
          organizationAPI.getOrganization(organizationId),
          organizationAPI.getCompany(organizationId, companyCodeParam),
          organizationAPI.getCompanyDomains(organizationId, companyCodeParam),
        ]
      );
      setOrganization(orgResponse.data);
      setCompany(companyResponse.data);
      setDomains(domainsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch domains");
    } finally {
      setLoading(false);
    }
  };

  const filteredDomains = domains.filter(
    (domain) =>
      domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.domain_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDomain = (domainCode: string) => {
    navigate(
      `/organizations/${orgId}/companies/${companyCode}/domains/${domainCode}`
    );
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
                onClick={() => navigate(`/organizations/${orgId}/companies`)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Back to Companies"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Logo width={100} height={25} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Domains
                </h1>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Building2 className="w-4 h-4" />
                  <span>{organization?.company_name}</span>
                  <span>→</span>
                  <Building className="w-4 h-4" />
                  <span>{company?.name}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Domain</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {company?.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Company Code: {company?.company_code} • {domains.length}{" "}
                    Domains
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search domains..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Domains Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDomains.map((domain) => (
                <motion.div
                  key={domain.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {domain.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                          <Code className="w-3 h-3" />
                          <span>{domain.domain_code}</span>
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        domain.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {domain.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {domain.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {domain.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Created:{" "}
                        {new Date(domain.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleViewDomain(domain.domain_code)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredDomains.length === 0 && (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No domains found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Get started by creating your first domain"}
                </p>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Domain
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Domains;
