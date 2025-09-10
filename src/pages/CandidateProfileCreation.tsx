import React, { useState, useEffect } from "react";
import { useThemeStore } from "../context/themeStore";
import { Eye, Search, RefreshCw, PlusCircle, CheckCircle, User, Building, Calendar, Shield, Mail, Briefcase } from "lucide-react";
import { makeAuthenticatedRequest, refreshAuthToken } from "../utils/auth";
import Sidebar from "../components/Sidebar";

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
  designation: string;
  accessLevel: string;
  dateOfJoining: string;
}

// Backend interfaces for dropdown APIs
interface Role {
  id: number;
  role_name: string;
  organization_id: number;
}

interface Department {
  id: number;
  department_name: string;
  organization_id: number;
}

interface AccessLevel {
  value: string;
  label: string;
}

// Dropdown API response interfaces
interface RolesApiResponse {
  roles: Role[];
}

interface DepartmentsApiResponse {
  departments: Department[];
}

interface AccessLevelsApiResponse {
  access_levels: AccessLevel[];
}

// Interface for created user
interface CreatedUser {
  candidateId: number; // Original candidate ID for API calls
  empId: string;
  email: string;
  username: string;
  candidateName: string;
  role: string;
  department: string;
  tempPassword: string;
}

const CandidateProfileCreation: React.FC = () => {
  // Assignment state
  const [assignmentDone, setAssignmentDone] = useState(false);
  const [assigning, setAssigning] = useState(false);
  // Use global dark mode from theme store
  const isDark = useThemeStore((state) => state.isDark);
  const [currentStep, setCurrentStep] = useState<"candidates" | "assignment" | "created">("candidates");
  const [selectedCandidates, setSelectedCandidates] = useState<CandidateProfile[]>([]);
  const [createdUsers, setCreatedUsers] = useState<CreatedUser[]>([]);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  // New state for roles, departments, and access levels
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
  const [rolesLoading, setRolesLoading] = useState<boolean>(false);
  const [departmentsLoading, setDepartmentsLoading] = useState<boolean>(false);
  const [accessLevelsLoading, setAccessLevelsLoading] = useState<boolean>(false);

  // API base URLs
  const API_BASE_URL = "http://192.168.1.132:8000/api/onboarding/candidates/";
  const ROLES_API_URL = "http://192.168.1.132:8000/api/dropdown/roles/";
  const DEPARTMENTS_API_URL = "http://192.168.1.132:8000/api/dropdown/departments/";
  const ACCESS_LEVELS_API_URL = "http://192.168.1.132:8000/api/dropdown/access-levels/";

  // Transform backend data to frontend format
  const transformCandidateData = (backendCandidate: CandidateDetails): CandidateProfile | null => {
    const fullName = `${backendCandidate.first_name || ''} ${backendCandidate.last_name || ''}`.trim();
    const inviteDate = backendCandidate.invited_at 
      ? new Date(backendCandidate.invited_at).toLocaleDateString('en-GB')
      : '';

    // Map backend status to display status
    let status: string;
    switch (backendCandidate.status) {
      case "invited":
        status = "Invited";
        break;
      case "pending":
        status = "Pending";
        break;
      case "submitted":
        status = "Submitted";
        break;
      case "assigned":
        status = "Assigned";
        break;
      case "completed":
        // Do not show completed candidates in this page
        return null;
      default:
        status = backendCandidate.status;
    }

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
  const fetchCandidates = async (useRefreshToken: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      // If explicitly requested to use refresh token, refresh it first
      if (useRefreshToken) {
        console.log('🔄 Refreshing token before fetching candidates...');
        const refreshSuccess = await refreshAuthToken();
        if (!refreshSuccess) {
          throw new Error('Failed to refresh authentication token');
        }
        console.log('✅ Token refreshed successfully');
      }

      const response = await makeAuthenticatedRequest(API_BASE_URL, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CandidateApiResponse = await response.json();
      
  // Transform backend data to frontend format, filter out nulls (completed)
  const transformedCandidates = data.results.map(transformCandidateData).filter(Boolean) as CandidateProfile[];
  setCandidates(transformedCandidates);

      console.log(`✅ Successfully fetched ${transformedCandidates.length} candidates${useRefreshToken ? ' (with token refresh)' : ''}`);
      
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

  // Fetch roles from backend (from roles dropdown API)
  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      console.log('🔄 Fetching roles from dropdown API...');

      const response = await makeAuthenticatedRequest(ROLES_API_URL, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RolesApiResponse = await response.json();
      setRoles(data.roles);
      
      console.log(`✅ Successfully fetched ${data.roles.length} roles from dropdown API`);
      
    } catch (err) {
      console.error('Error fetching roles:', err);
      setRoles([]);
      console.log('⚠️ No fallback data used as requested');
    } finally {
      setRolesLoading(false);
    }
  };

  // Fetch departments from backend (from departments dropdown API)
  const fetchDepartments = async () => {
    try {
      setDepartmentsLoading(true);
      console.log('🔄 Fetching departments from dropdown API...');

      const response = await makeAuthenticatedRequest(DEPARTMENTS_API_URL, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DepartmentsApiResponse = await response.json();
      setDepartments(data.departments);
      
      console.log(`✅ Successfully fetched ${data.departments.length} departments from dropdown API`);
      
    } catch (err) {
      console.error('Error fetching departments:', err);
      setDepartments([]);
      console.log('⚠️ No fallback data used as requested');
    } finally {
      setDepartmentsLoading(false);
    }
  };

  // Fetch access levels from backend (from access levels dropdown API)
  const fetchAccessLevels = async () => {
    try {
      setAccessLevelsLoading(true);
      console.log('🔄 Fetching access levels from dropdown API...');

      const response = await makeAuthenticatedRequest(ACCESS_LEVELS_API_URL, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AccessLevelsApiResponse = await response.json();
      setAccessLevels(data.access_levels);
      
      console.log(`✅ Successfully fetched ${data.access_levels.length} access levels from dropdown API`);
      
    } catch (err) {
      console.error('Error fetching access levels:', err);
      setAccessLevels([]);
      console.log('⚠️ No fallback data used as requested');
    } finally {
      setAccessLevelsLoading(false);
    }
  };

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

  const handleCreateProfile = async () => {
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
      designation: "",
      accessLevel: "",
      dateOfJoining: "",
    })));
    
    // Fetch roles, departments, and access levels when moving to assignment step
    console.log('🔄 Fetching roles, departments, and access levels for assignment step...');
    await Promise.all([
      fetchRoles(),
      fetchDepartments(),
      fetchAccessLevels()
    ]);
    
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
      candidateId: candidate.id, // Store original candidate ID
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
      assignment => !assignment.role || !assignment.department || !assignment.designation || !assignment.accessLevel || !assignment.dateOfJoining
    );
    if (incompleteAssignments.length > 0) {
      alert("Please complete all role assignments before creating users");
      return;
    }
    try {
      setLoading(true);
      const createdUsersFromApi = [];
      for (const candidate of selectedCandidates) {
        // Find the corresponding role assignment for this candidate
        const assignment = roleAssignments.find(a => a.candidateId === candidate.id);
        if (!assignment) {
          throw new Error(`No role assignment found for candidate ${candidate.candidateName}`);
        }

        // Generate company email based on candidate name
        const sanitizedName = candidate.candidateName
          .toLowerCase()
          .replace(/[^a-z\s]/g, '') // Remove special characters
          .replace(/\s+/g, '.') // Replace spaces with dots
          .replace(/\.+/g, '.') // Replace multiple dots with single dot
          .replace(/^\.+|\.+$/g, ''); // Remove leading/trailing dots
        
        const companyEmail = `${sanitizedName}@mhcognition.com`;

        // Prepare payload with assignment data and company email
        const payload = {
          assigned_role: assignment.role,
          assigned_department: assignment.department,
          designation: assignment.designation,
          assigned_access_level: assignment.accessLevel,
          date_of_joining: assignment.dateOfJoining,
          company_email: companyEmail,
        };

        // POST to /onboarding/candidates/{id}/create-user/
        const response = await makeAuthenticatedRequest(`${API_BASE_URL}${candidate.id}/create-user/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to create user for candidate ${candidate.candidateName}: ${errorData.detail || response.statusText}`);
        }
        const userData = await response.json();
        createdUsersFromApi.push({
          candidateId: userData.candidate_id || userData.id,
          empId: userData.emp_id || userData.profile_id || '',
          email: userData.company_email || userData.email,
          username: userData.company_email?.split('@')[0] || '',
          candidateName: candidate.candidateName,
          role: assignment.role,
          department: assignment.department,
          tempPassword: userData.temp_password || '',
        });
      }
      setCreatedUsers(createdUsersFromApi);
      setCurrentStep("created");
    } catch (error) {
      console.error('Error creating users:', error);
      alert(`Failed to create users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Assignment API handler
  const handleAssign = async () => {
    // Validate all assignments are complete
    const incompleteAssignments = roleAssignments.filter(
      assignment => !assignment.role || !assignment.department || !assignment.designation || !assignment.accessLevel || !assignment.dateOfJoining
    );
    if (incompleteAssignments.length > 0) {
      alert("Please complete all role assignments before assigning");
      return;
    }
    setAssigning(true);
    try {
      // POST to /onboarding/candidates/{id}/assign/ for each candidate individually
      for (const assignment of roleAssignments) {
        const payload = {
          assigned_role: assignment.role,
          assigned_department: assignment.department,
          assigned_access_level: assignment.accessLevel,
          designation: assignment.designation,
          date_of_joining: assignment.dateOfJoining,
        };
        
        const response = await makeAuthenticatedRequest(
          `http://192.168.1.132:8000/api/onboarding/candidates/${assignment.candidateId}/assign/`, 
          {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to assign role for ${assignment.candidateName}: ${errorData.detail || response.statusText}`);
        }
      }
      setAssignmentDone(true);
    } catch (error) {
      alert(`Failed to assign roles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setAssigning(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      
      console.log('📧 Sending credential emails to individual candidates...');
      
      // Send credentials to each candidate individually using the new API format
      const results = [];
      
      for (const user of createdUsers) {
        try {
          console.log(`📧 Sending credentials to candidate ID: ${user.candidateId}`);
          
          const response = await makeAuthenticatedRequest(
            `${API_BASE_URL}${user.candidateId}/send-credentials/`, 
            {
              method: 'POST',
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to send email to ${user.candidateName}: ${errorData.detail || response.statusText}`);
          }
          
          results.push({ success: true, candidate: user.candidateName });
          console.log(`✅ Credentials sent successfully to: ${user.candidateName}`);
          
        } catch (error) {
          console.error(`❌ Failed to send email to ${user.candidateName}:`, error);
          results.push({ 
            success: false, 
            candidate: user.candidateName, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }
      
      // Check results
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;
      
      if (successCount === createdUsers.length) {
        console.log("✅ All credential emails sent successfully");
        setEmailSent(true);
        alert(`Credential emails sent successfully to all ${successCount} users!`);
      } else if (successCount > 0) {
        console.log(`⚠️ Partial success: ${successCount}/${createdUsers.length} emails sent`);
        alert(`Emails sent to ${successCount} users. ${failureCount} failed. Check console for details.`);
        setEmailSent(true); // Mark as sent even if partial success
      } else {
        console.log("❌ All email sends failed");
        alert("Failed to send any credential emails. Please try again.");
      }
      
    } catch (error) {
      console.error('Error in email sending process:', error);
      alert(`Failed to send emails: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const renderCandidatesStep = () => (
  <div className={"p-6 transition-colors duration-300 " + (isDark ? "bg-gray-900" : "bg-white") }>
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-800 rounded-lg p-4 mb-6 dark:bg-red-900 dark:border-red-700 dark:text-red-200">
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

      {/* Search Bar */}
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading candidates...</div>
        </div>
      ) : (
        <>
          {/* Candidates Table */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-white dark:bg-gray-900">
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
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
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {candidate.candidateName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {candidate.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {candidate.mobileNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {candidate.organization}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {candidate.status === "Pending" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800 border border-red-200 dark:bg-red-700 dark:text-white dark:border-red-600">
                            Pending
                          </span>
                        ) : (
                          <>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800 border border-green-200 dark:bg-green-700 dark:text-white dark:border-green-600">
                              Submitted
                            </span>
                            <button
                              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-1"
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
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total: {filteredCandidates.length} candidates | 
              Submitted: {filteredCandidates.filter(c => c.status === "Submitted").length} | 
              Selected: {filteredCandidates.filter(c => c.selected).length}
            </div>
            <button 
              onClick={handleCreateProfile}
              disabled={filteredCandidates.filter(c => c.selected).length === 0}
              className="bg-blue-500 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800 text-white px-8 py-3 rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <User size={16} />
              Next ({filteredCandidates.filter(c => c.selected).length})
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
        
        {/* Retry button for roles and departments */}
        {(roles.length === 0 || departments.length === 0) && !rolesLoading && !departmentsLoading && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-yellow-800 font-medium">Missing Data</h3>
                <p className="text-yellow-700 text-sm">
                  {roles.length === 0 && "Roles not loaded. "}
                  {departments.length === 0 && "Departments not loaded. "}
                  {accessLevels.length === 0 && "Access levels not loaded. "}
                  Try refreshing the data.
                </p>
              </div>
              <button
                onClick={async () => {
                  await Promise.all([fetchRoles(), fetchDepartments(), fetchAccessLevels()]);
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Retry Loading
              </button>
            </div>
          </div>
        )}
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
                  disabled={rolesLoading}
                >
                  <option value="">
                    {rolesLoading ? "Loading roles..." : "Select Role"}
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.role_name}>
                      {role.role_name}
                    </option>
                  ))}
                </select>
                {rolesLoading && (
                  <p className="text-sm text-gray-500 mt-1">Fetching roles from backend...</p>
                )}
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
                  disabled={departmentsLoading}
                >
                  <option value="">
                    {departmentsLoading ? "Loading departments..." : "Select Department"}
                  </option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.department_name}>
                      {department.department_name}
                    </option>
                  ))}
                </select>
                {departmentsLoading && (
                  <p className="text-sm text-gray-500 mt-1">Fetching departments from backend...</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase size={16} className="inline mr-2" />
                  Designation
                </label>
                <input
                  type="text"
                  value={assignment.designation}
                  onChange={(e) => handleRoleAssignmentChange(assignment.candidateId, "designation", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter designation"
                  aria-label="Enter designation"
                />
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
                  disabled={accessLevelsLoading}
                >
                  <option value="">
                    {accessLevelsLoading ? "Loading access levels..." : "Select Access Level"}
                  </option>
                  {accessLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {accessLevelsLoading && (
                  <p className="text-sm text-gray-500 mt-1">Fetching access levels from backend...</p>
                )}
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
          onClick={handleAssign}
          disabled={assignmentDone || assigning}
          className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${assignmentDone || assigning ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {assigning ? 'Assigning...' : assignmentDone ? 'Assigned' : 'Assign'}
        </button>
        <button
          onClick={handleCreateUsers}
          disabled={!assignmentDone || loading}
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
    <div className={"flex h-screen transition-colors duration-300 " + (isDark ? "bg-gray-900" : "bg-gray-50") }>
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className={"border-b border-gray-200 dark:border-gray-700 " + (isDark ? "bg-gray-800" : "bg-white") }>
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentStep === "candidates" && "Candidate Profile Creation"}
              {currentStep === "assignment" && "Role Assignment"}
              {currentStep === "created" && "User Management"}
            </h1>
            <p className="text-gray-600 dark:text-gray-200 mt-1">
              {currentStep === "candidates" && "Select submitted candidates to create their profiles"}
              {currentStep === "assignment" && "Assign roles and departments to new employees"}
              {currentStep === "created" && "Manage created user accounts and send credentials"}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {currentStep === "candidates" && renderCandidatesStep()}
          {currentStep === "assignment" && renderAssignmentStep()}
          {currentStep === "created" && renderCreatedUsersStep()}
        </div>
      </div>
    </div>
  );
};
  
export default CandidateProfileCreation;