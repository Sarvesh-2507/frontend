import { UserPlus } from "lucide-react";
import React from "react";
import ModulePage from "../../components/ModulePage";

const Onboarding: React.FC = () => {
  return (
    <ModulePage
      title="Onboarding"
      description="Manage new employee onboarding process, documentation, and orientation"
      icon={UserPlus}
      comingSoon={true}
    />
  );
};

export default Onboarding;
