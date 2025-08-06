import { Key } from "lucide-react";
import React from "react";
import ModulePage from "../components/ModulePage";

const UserAuthRoles: React.FC = () => {
  return (
    <ModulePage
      title="User Authentication & Roles"
      description="Manage user accounts, permissions, and role-based access control"
      icon={Key}
      comingSoon={true}
    />
  );
};

export default UserAuthRoles;
