import { UserX } from "lucide-react";
import React from "react";
import ModulePage from "../../components/ModulePage";

const Offboarding: React.FC = () => {
  return (
    <ModulePage
      title="Offboarding"
      description="Manage employee offboarding process, exit interviews, and asset recovery"
      icon={UserX}
      comingSoon={true}
    />
  );
};

export default Offboarding;
