import { FileText } from "lucide-react";
import React from "react";
import ModulePage from "../components/ModulePage";

const PolicyDocuments: React.FC = () => {
  return (
    <ModulePage
      title="Policy & Documents"
      description="Manage company policies, employee handbooks, and important documents"
      icon={FileText}
      comingSoon={true}
    />
  );
};

export default PolicyDocuments;
