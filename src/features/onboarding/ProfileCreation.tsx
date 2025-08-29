
import { User } from "lucide-react";
import React from "react";
import ModulePage from "../../components/ModulePage";

const CandidateInvite: React.FC = () => {
  return (
    <ModulePage
      title="Candidate Invite"
      description="Invite and manage candidates as part of onboarding."
      icon={User}
      comingSoon={false}
    />
  );
};

export default CandidateInvite;
