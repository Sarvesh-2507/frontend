
import { Users } from "lucide-react";
import React from "react";
import ModulePage from "../../components/ModulePage";

const CandidateApproach: React.FC = () => {
  return (
    <ModulePage
      title="Candidate Approach"
      description="Manage candidate approach and orientation programs for new hires."
      icon={Users}
      comingSoon={false}
    />
  );
};

export default CandidateApproach;
