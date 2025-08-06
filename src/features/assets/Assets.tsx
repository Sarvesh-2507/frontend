import { Package } from "lucide-react";
import React from "react";
import ModulePage from "../../components/ModulePage";

const Assets: React.FC = () => {
  return (
    <ModulePage
      title="Assets"
      description="Manage company assets, equipment allocation, and inventory tracking"
      icon={Package}
      comingSoon={true}
    />
  );
};

export default Assets;
