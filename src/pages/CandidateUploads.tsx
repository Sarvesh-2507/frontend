import React, { useState } from "react";
import { Eye, Search, RefreshCw, PlusCircle, CheckCircle, User, Building, Calendar, Shield } from "lucide-react";

// Interface for candidates ready for profile creation
interface CandidateProfile {
  id: number;
  candidateName: string;
  email: string;
  mobileNumber: string;
  organization: string;
  inviteDate: string;
  status: "Pending" | "Submitted";
  selected?: boolean;
}

// Interface for role assignment form
interface RoleAssignment {
  candidateId: number;
  candidateName: string;
  role: string;
  department: string;
  accessLevel: string;
  dateOfJoining: string;
}

// Interface for created user
interface CreatedUser {
  empId: string;
  email: string;
  username: string;
  candidateName: string;
  role: string;
  department: string;
  tempPassword: string;
}

const CandidateProfileCreation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<"candidates" | "assignment" | "created">("candidates");
  const [selectedCandidates, setSelectedCandidates] = useState<CandidateProfile[]>([]);
  const [createdUsers, setCreatedUsers] = useState<CreatedUser[]>([]);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  // Mock data for candidates (matching your image)
  const [candidates, setCandidates] = useState<CandidateProfile[]>([
    {
      id: 1,
      candidateName: "Shiva",
      email: "Shiva@gmail.com",
      mobileNumber: "+9109876565",
      organization: "Mh cognition",
      inviteDate: "22/03/2025",
      status: "Pending",
      selected: false,
    },
    {
      id: 2,
      candidateName: "Shiva",
      email: "Shiva@gmail.com",
      mobileNumber: "+9109876565",
      organization: "Mh cognition",
      inviteDate: "22/03/2025",
      status: "Pending",
      selected: false,
    },
    {
      id: 3,
      candidateName: "Shiva",
      email: "Shiva@gmail.com",
      mobileNumber: "+9109876565",
      organization: "Mh cognition",
      inviteDate: "22/03/2025",
      status: "Submitted",
      selected: false,
    },
    {
      id: 4,
      candidateName: "Shiva",
      email: "Shiva@gmail.com",
      mobileNumber: "+9109876565",
      organization: "Mh cognition",
      inviteDate: "22/03/2025",
      status: "Submitted",
      selected: false,
    },
  ]);

  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([]);

  const handleCandidateSelection = (candidateId: number) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, selected: !candidate.selected }
          : candidate
      )
    );
  };

  const handleSelectAll = () => {
    const submittedCandidates = candidates.filter(c => c.status === "Submitted");
    const allSelected = submittedCandidates.every(c => c.selected);
    
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.status === "Submitted"
          ? { ...candidate, selected: !allSelected }
          : candidate
      )
    );
  };

  const handleCreateProfile = () => {
    const selected = candidates.filter(c => c.selected && c.status === "Submitted");
    if (selected.length === 0) {
      alert("Please select at least one submitted candidate");
      return;
    }
    
    setSelectedCandidates(selected);
    setRoleAssignments(selected.map(candidate => ({
      candidateId: candidate.id,
      candidateName: candidate.candidateName,
      role: "",
      department: "",
      accessLevel: "",
      dateOfJoining: "",
    })));
    setCurrentStep("assignment");
  };

  const handleRoleAssignmentChange = (candidateId: number, field: keyof RoleAssignment, value: string) => {
    setRoleAssignments(prev => 
      prev.map(assignment => 
        assignment.candidateId === candidateId
          ? { ...assignment, [field]: value }
          : assignment
      )
    );
  };

  const generateUserCredentials = (candidate: CandidateProfile, assignment: RoleAssignment): CreatedUser => {
    const empId = `EMP${Date.now().toString().slice(-6)}${candidate.id}`;
    const username = candidate.candidateName.toLowerCase().replace(/\s+/g, '.');
    const companyEmail = `${username}@mhcognition.com`;
    const tempPassword = `Temp${Math.random().toString(36).slice(-8)}`;

    return {
      empId,
      email: companyEmail,
      username,
      candidateName: candidate.candidateName,
      role: assignment.role,
      department: assignment.department,
      tempPassword,
    };
  };

  const handleCreateUsers = () => {
    // Validate all assignments are complete
    const incompleteAssignments = roleAssignments.filter(
      assignment => !assignment.role || !assignment.department || !assignment.accessLevel || !assignment.dateOfJoining
    );

    if (incompleteAssignments.length > 0) {
      alert("Please complete all role assignments before creating users");
      return;
    }

    // Generate user credentials
    const newUsers = selectedCandidates.map(candidate => {
      const assignment = roleAssignments.find(a => a.candidateId === candidate.id)!;
      return generateUserCredentials(candidate, assignment);
    });

    setCreatedUsers(newUsers);
    setCurrentStep("created");
  };

  const handleSendEmail = async () => {
    // Simulate sending emails
    try {
      // Here you would call your backend API to send emails
      console.log("Sending credential emails to:", createdUsers);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmailSent(true);
      alert("Credential emails sent successfully to all new users!");
    } catch (error) {
      alert("Failed to send emails. Please try again.");
    }
  };

  const renderAssignmentStep = () => (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => setCurrentStep("candidates")}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          ← Back to Candidates
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Role Assignment</h2>
        <p className="text-gray-600">Assign roles and departments to selected candidates</p>
      </div>

      <div className="space-y-6">
        {roleAssignments.map((assignment) => (
          <div key={assignment.candidateId} className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {assignment.candidateName}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`role-select-${assignment.candidateId}`} className="block text-sm font-medium text-gray-700 mb-2">
                  <Building size={16} className="inline mr-2" />
                  Role
                </label>
                <select
                  id={`role-select-${assignment.candidateId}`}
                  aria-label="Role"
                  value={assignment.role}
                  onChange={(e) => handleRoleAssignmentChange(assignment.candidateId, "role", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Role</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Senior Software Engineer">Senior Software Engineer</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="HR Executive">HR Executive</option>
                  <option value="Business Analyst">Business Analyst</option>
                </select>
              </div>

              <div>
                <label htmlFor={`department-select-${assignment.candidateId}`} className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Department
                </label>
                <select
                  id={`department-select-${assignment.candidateId}`}
                  aria-label="Department"
                  value={assignment.department}
                  onChange={(e) => handleRoleAssignmentChange(assignment.candidateId, "department", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Shield size={16} className="inline mr-2" />
                  Access Level
                </label>
                <select
                  id={`access-level-select-${assignment.candidateId}`}
                  aria-label="Access Level"
                  value={assignment.accessLevel}
                  onChange={(e) => handleRoleAssignmentChange(assignment.candidateId, "accessLevel", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Access Level</option>
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Date of Joining
                </label>
                <input
                  type="date"
                  value={assignment.dateOfJoining}
                  onChange={(e) => handleRoleAssignmentChange(assignment.candidateId, "dateOfJoining", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Select date of joining"
                  title="Date of Joining"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={() => setCurrentStep("candidates")}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateUsers}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <CheckCircle size={16} />
          Create Users
        </button>
      </div>
    </div>
  );

  const renderCreatedUsersStep = () => (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => setCurrentStep("assignment")}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          ← Back to Assignment
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Users Created Successfully</h2>
        <p className="text-gray-600">Review the created user accounts and send credential emails</p>
      </div>

      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <CheckCircle className="text-green-600 mr-3" size={20} />
          <div>
            <h3 className="text-green-800 font-medium">Users Created Successfully!</h3>
            <p className="text-green-700 text-sm">
              {createdUsers.length} user account{createdUsers.length > 1 ? 's' : ''} have been created with auto-generated credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Created Users Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Employee ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Full Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Username
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Company Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Department
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Temporary Password
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {createdUsers.map((user) => (
              <tr key={user.empId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.empId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.candidateName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 bg-gray-50">
                  {user.tempPassword}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Email Status and Send Button */}
      {emailSent ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CheckCircle className="text-blue-600 mr-3" size={20} />
            <div>
              <h3 className="text-blue-800 font-medium">Emails Sent Successfully!</h3>
              <p className="text-blue-700 text-sm">
                Credential emails have been sent to all new users.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentStep("candidates")}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Create More Profiles
        </button>
        
        <button
          onClick={handleSendEmail}
          disabled={emailSent}
          className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            emailSent 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <PlusCircle size={16} />
          {emailSent ? 'Emails Sent' : 'Send Email'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {currentStep === "candidates" && "Candidate Profile Creation"}
            {currentStep === "assignment" && "Role Assignment"}
            {currentStep === "created" && "User Management"}
          </h1>
          <p className="text-gray-600 mt-1">
            {currentStep === "candidates" && "Select submitted candidates to create their profiles"}
            {currentStep === "assignment" && "Assign roles and departments to new employees"}
            {currentStep === "created" && "Manage created user accounts and send credentials"}
          </p>
        </div>
      </div>

      {currentStep === "candidates" && renderCandidatesStep()}
      {currentStep === "assignment" && renderAssignmentStep()}
      {currentStep === "created" && renderCreatedUsersStep()}
    </div>
  );
};

// Render candidates step function
function renderCandidatesStep() {
  // You can customize this UI as needed
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Candidates Ready for Profile Creation</h2>
      {/* Add your candidate selection table or UI here */}
      <p className="text-gray-600">Candidate selection UI goes here.</p>
    </div>
  );
}

export default CandidateProfileCreation;


