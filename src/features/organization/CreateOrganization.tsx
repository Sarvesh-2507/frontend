import { motion } from "framer-motion";
import { ArrowLeft, Building2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import CreateOrganizationForm from "../../components/CreateOrganizationForm";
import Sidebar from "../../components/Sidebar";
// import { Organization } from "../types/organization";

const CreateOrganization: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (organization: any) => {
    console.log("✅ Organization created successfully:", organization);
    // Navigate back to organizations list or dashboard
    navigate("/organizations", {
      state: {
        message: `Organization "${organization.company_name}" created successfully!`,
        type: "success",
      },
    });
  };

  const handleCancel = () => {
    navigate("/organizations");
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
  <div />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/organizations")}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Organizations</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Create Organization
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add a new organization to the system
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CreateOrganizationForm
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                  className="w-full"
                />
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateOrganization;
