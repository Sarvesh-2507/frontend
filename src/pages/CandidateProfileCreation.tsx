import React, { useState, useEffect } from "react";
import { Eye, Search, RefreshCw, PlusCircle, CheckCircle, User, Building, Calendar, Shield, Mail } from "lucide-react";

// Backend API interfaces
interface CandidateDetails {
  id: number;
  assigned_organization_name: string;
  assigned_department_name: string;
  invited_by_name: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  assigned_role: string | null;
  date_of_joining: string | null;
  invite_token: string;
  form_data: any | null;
  invited_at: string | null;
  submitted_at: string | null;
  status: "pending" | "invited" | "submitted" | "assigned" | "completed" | "expired";
  generated_emp_id: string | null;
  company_email: string | null;
  temp_password: string | null;
  assigned_organization: number;
  assigned_department: number | null;
  reporting_manager: number | null;
  invited_by: number | null;
}

interface CandidateApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CandidateDetails[];
}

// Frontend interface for easier handling
interface CandidateProfile {
  id: number;
  candidateName: string;
  email: string;
  mobileNumber: string;
  organization: string;
  inviteDate: string;
  status: "Pending" | "Submitted";
  selected?: boolean;
  backendData?: CandidateDetails; // Store original backend data
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
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // API base URL
  const API_BASE_URL = "http://192.168.1.132:8000/api/onboarding/candidates/";

  // Transform backend data to frontend format
  const transformCandidateData = (backendCandidate: CandidateDetails): CandidateProfile => {
    const fullName = `${backendCandidate.first_name || ''} ${backendCandidate.last_name || ''}`.trim();
    const inviteDate = backendCandidate.invited_at 
      ? new Date(backendCandidate.invited_at).toLocaleDateString('en-GB')
      : '';
    
    // Map backend status to frontend status
    const status = backendCandidate.status === "submitted" ? "Submitted" : "Pending";

    return {
      id: backendCandidate.id,
      candidateName: fullName || 'Unknown',
      email: backendCandidate.email,
      mobileNumber: backendCandidate.phone_number || '',
      organization: backendCandidate.assigned_organization_name || '',
      inviteDate,
      status,
      selected: false,
      backendData: backendCandidate,
    };
  };

  // Fetch candidates from API
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CandidateApiResponse = await response.json();
      
      // Transform backend data to frontend format
      const transformedCandidates = data.results.map(transformCandidateData);
      setCandidates(transformedCandidates);
      
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch candidates');
      
      // Fallback to mock data for development
      const mockCandidates: CandidateProfile[] = [
        {
          id: 1,
          candidateName: "Shiva Kumar",
          email: "shiva@gmail.com",
          mobileNumber: "+9109876565",
          organization: "Mh cognition",
          inviteDate: "22/03/2025",
          status: "Pending",
          selected: false,
        },
        {
          id: 2,
          candidateName: "Raj Patel",
          email: "raj@gmail.com",
          mobileNumber: "+9109876566",
          organization: "Mh cognition",
          inviteDate: "23/03/2025",
          status: "Submitted",
          selected: false,
        },
      ];
      setCandidates(mockCandidates);
    } finally {
      setLoading(false);
    }
  };

  // Load candidates on component mount
  useEffect(() => {
    fetchCandidates();
  }, []);

  // Filter candidates based on search term
  const filteredCandidates = candidates.filter(candidate =>
    candidate.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    const submittedCandidates = filteredCandidates.filter(c => c.status === "Submitted");
    const allSelected = submittedCandidates.every(c => c.selected);
    
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.status === "Submitted"
          ? { ...candidate, selected: !allSelected }
          : candidate
      )
    );
  };

  const handleRefresh = () => {
    fetchCandidates();
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

  const handleCreateUsers = async () => {
    // Validate all assignments are complete
    const incompleteAssignments = roleAssignments.filter(
      assignment => !assignment.role || !assignment.department || !assignment.accessLevel || !assignment.dateOfJoining
    );

    if (incompleteAssignments.length > 0) {
      alert("Please complete all role assignments before creating users");
      return;
    }

    try {
      setLoading(true);
      
      // Generate user credentials for display
      const newUsers = selectedCandidates.map(candidate => {
        const assignment = roleAssignments.find(a => a.candidateId === candidate.id)!;
        return generateUserCredentials(candidate, assignment);
      });

      // Here you would typically make API calls to create users in the backend
      // Example API call structure:
      /*
      for (const candidate of selectedCandidates) {
        const assignment = roleAssignments.find(a => a.candidateId === candidate.id)!;
        const updatePayload = {
          assigned_role: assignment.role,
          assigned_department: assignment.department, // This would be department ID
          date_of_joining: assignment.dateOfJoining,
          status: 'assigned'
        };
        
        await fetch(`${API_BASE_URL}${candidate.id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updatePayload),
        });
      }
      */

      setCreatedUsers(newUsers);
      setCurrentStep("created");
      
    } catch (error) {
      console.error('Error creating users:', error);
      alert('Failed to create users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    // Simulate sending emails
    try {
      setLoading(true);
      
      // Here you would call your backend API to send credential emails
      // Example API call:
      /*
      const emailPayload = {
        user_ids: createdUsers.map(user => user.empId),
        send_credentials: true
      };
      
      await fetch(`${API_BASE_URL}send-credentials/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(emailPayload),
      });
      */
      
      console.log("Sending credential emails to:", createdUsers);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmailSent(true);
      alert("Credential emails sent successfully to all new users!");
    } catch (error) {
      console.error('Error sending emails:', error);
      alert("Failed to send emails. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderCandidatesStep = () => (
    <div className="p-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">⚠️</div>
            <div>
              <h3 className="text-red-800 font-medium">API Connection Error</h3>
              <p className="text-red-700 text-sm">
                {error}. Using fallback data for development.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Refresh Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading candidates...</div>
        </div>
      ) : (
        <>
          {/* Candidates Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      onChange={handleSelectAll}
                      checked={filteredCandidates.filter(c => c.status === "Submitted").every(c => c.selected)}
                      aria-label="Select all candidates"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Candidate Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Email Id
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Mobile Number
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Organization
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={candidate.selected || false}
                        onChange={() => handleCandidateSelection(candidate.id)}
                        disabled={candidate.status === "Pending"}
                        aria-label={`Select ${candidate.candidateName}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {candidate.candidateName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.mobileNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.organization}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {candidate.status === "Pending" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                            Pending
                          </span>
                        ) : (
                          <>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                              Submitted
                            </span>
                            <button
                              className="text-gray-600 hover:text-gray-800 p-1"
                              title={`View details for ${candidate.candidateName}`}
                              aria-label={`View details for ${candidate.candidateName}`}
                            >
                              <Eye size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No Results Message */}
          {filteredCandidates.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm ? "No candidates found matching your search criteria." : "No candidates available."}
              </p>
            </div>
          )}

          {/* Create Profile Button */}
          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Total: {filteredCandidates.length} candidates | 
              Submitted: {filteredCandidates.filter(c => c.status === "Submitted").length} | 
              Selected: {filteredCandidates.filter(c => c.selected).length}
            </div>
            <button 
              onClick={handleCreateProfile}
              disabled={filteredCandidates.filter(c => c.selected).length === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <User size={16} />
              Create Profile ({filteredCandidates.filter(c => c.selected).length})
            </button>
          </div>
        </>
      )}
    </div>
  );

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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building size={16} className="inline mr-2" />
                  Role
                </label>
                <select
                  value={assignment.role}
                  onChange={(e) => handleRoleAssignmentChange(assignment.candidateId, "role", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Select role"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Department
                </label>
                <select
                  value={assignment.department}
                  onChange={(e) => handleRoleAssignmentChange(assignment.candidateId, "department", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Select department"
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
                  value={assignment.accessLevel}
                  onChange={(e) => handleRoleAssignmentChange(assignment.candidateId, "accessLevel", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Select access level"
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
                  aria-label="Select date of joining"
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
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <CheckCircle size={16} />
          {loading ? "Creating Users..." : "Create Users"}
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
          disabled={emailSent || loading}
          className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            emailSent || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Mail size={16} />
          {loading ? 'Sending...' : emailSent ? 'Emails Sent' : 'Send Email'}
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

export default CandidateProfileCreation;
