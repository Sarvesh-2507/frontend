import { UserPlus, FileText, Briefcase, Shield, ClipboardCheck, Upload, Mail, Package } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import ModulePage from "../../components/ModulePage";

const OnboardingFeature = ({ title, description, icon: Icon, path, comingSoon = false }: { 
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  comingSoon?: boolean;
}) => {
  return (
    <Link
      to={comingSoon ? "#" : path}
      className={`block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${
        comingSoon ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
          {comingSoon && (
            <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const Onboarding: React.FC = () => {
  const features = [
    {
      title: "Offer Letter Management",
      description: "Create and manage customizable offer letters for candidates",
      icon: FileText,
      path: "/onboarding/offer-letter",
    },
    {
      title: "Pre-Boarding Documentation",
      description: "Manage pre-employment documentation and verification process",
      icon: Briefcase,
      path: "/onboarding/pre-boarding",
    },
    {
      title: "Background Verification",
      description: "Track background verification documents and processes",
      icon: Shield,
      path: "/onboarding/background-verification",
    },
    {
      title: "Joining Formalities",
      description: "Manage joining documentation and formalities for new hires",
      icon: ClipboardCheck,
      path: "/onboarding/joining-formalities",
    },
    {
      title: "Candidate Uploads",
      description: "Track and manage candidate document uploads",
      icon: Upload,
      path: "/onboarding/candidate-uploads",
    },
    {
      title: "Task & Checklist Tracking",
      description: "Track onboarding tasks and checklists for new employees",
      icon: ClipboardCheck,
      path: "/onboarding/tasks",
    },
    {
      title: "Candidate Invite",
      description: "Send and manage candidate invitations for onboarding",
      icon: Mail,
      path: "/onboarding/candidate-invite",
    },
    {
      title: "Asset Allocation",
      description: "Manage and track company assets assigned to new employees",
      icon: Package,
      path: "/onboarding/asset-allocation",
    },
  ];

  return (
    <ModulePage
      title="Onboarding"
      description="Manage new employee onboarding process, documentation, and orientation"
      icon={UserPlus}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <OnboardingFeature key={index} {...feature} />
        ))}
      </div>
    </ModulePage>
  );
};

export default Onboarding;
