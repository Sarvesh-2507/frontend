import { ClipboardList } from "lucide-react";
import React from "react";
import ModulePage from "../../components/ModulePage";

const PreBoarding: React.FC = () => {
  return (
    <ModulePage
      title="Pre-boarding Documentation"
      description="Manage pre-boarding documents and requirements for new employees"
      icon={ClipboardList}
      comingSoon={true}
    />
  );
};

export default PreBoarding;
