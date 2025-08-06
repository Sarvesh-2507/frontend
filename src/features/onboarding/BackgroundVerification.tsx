import { Shield } from "lucide-react";
import React from "react";
import ModulePage from "../../components/ModulePage";

const BackgroundVerification: React.FC = () => {
  return (
    <ModulePage
      title="Background Verification"
      description="Manage background checks and verification processes for new hires"
      icon={Shield}
      comingSoon={true}
    />
  );
};

export default BackgroundVerification;
