import { FileText } from "lucide-react";
import React from "react";
import ModulePage from "../../components/ModulePage";

const OfferLetter: React.FC = () => {
  return (
    <ModulePage
      title="Offer Letter Management"
      description="Create, send, and track offer letters for new hires"
      icon={FileText}
      comingSoon={true}
    />
  );
};

export default OfferLetter;
