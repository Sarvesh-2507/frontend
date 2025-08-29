
import React, { useState, useEffect } from "react";
import { UserPlus, Mail, RefreshCw, FileText, Check, Copy, X, Search, Filter, PlusCircle, Upload } from "lucide-react";
import ModulePage from "../../components/ModulePage";
import { motion } from "framer-motion";
import { 
  CandidateProfile, 
  getAllCandidates, 
  sendCandidateInvite, 
  getPendingCandidates, 
  SendInvitePayload 
} from "../../services/candidateOnboardingService";
import { Organization } from "../../types/organization";
import { organizationAPI } from "../../services/organizationApi";
import { useToast } from "../../context/ToastContext";

// Using the CandidateProfile interface from our service
// Added local UI-specific properties
interface CandidateWithUIProps extends CandidateProfile {
  inviteExpiry?: string;
}

const CandidateInvite: React.FC = () => {
  // Form states
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    joining_date: "",
    organization: 0,
    organization_name_for_email: ""
  });
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOrgLoading, setIsOrgLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [bulkMode, setBulkMode] = useState<boolean>(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
  // Get toast functions
  const { showSuccess, showError, showInfo } = useToast();
  
  // Initialize the candidates state
  const [candidates, setCandidates] = useState<CandidateWithUIProps[]>([]);
  
  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // For organization, convert to number
    if (name === 'organization') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Reset email verification if email changes
    if (name === 'email') {
      setEmailError("");
      setIsEmailVerified(false);
    }
  };
  
  // Verify email format and availability
  const verifyEmail = () => {
    if (!formData.email) {
      setEmailError("Email is required");
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    setIsVerifying(true);
    
    // In a real implementation, you'd check if the email already exists
    setTimeout(() => {
      setIsVerifying(false);
      setIsEmailVerified(true);
    }, 1000);
  };
  
  // Fetch organizations on component mount
  useEffect(() => {
    fetchOrganizations();
    fetchCandidates();
  }, []);
  
  // Log organizations when they change
  useEffect(() => {
    console.log("Organizations state updated:", organizations);
  }, [organizations]);

  // Fetch organizations - direct API call approach
  const fetchOrganizations = async () => {
    try {
      setIsOrgLoading(true);
      console.log("Fetching organizations...");
      
      // Direct API call
      const response = await fetch('/api/organizations/', {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch organizations: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Organizations fetched successfully:", data);
      
      if (Array.isArray(data) && data.length > 0) {
        setOrganizations(data);
      } else {
        console.warn("API returned empty organizations array, using test data");
        // Use test data if API returns empty
        setOrganizations([
          { id: 1, company_name: "Test Organization 1", created_at: "", updated_at: "" },
          { id: 2, company_name: "Test Organization 2", created_at: "", updated_at: "" },
          { id: 3, company_name: "Test Organization 3", created_at: "", updated_at: "" }
        ]);
      }
    } catch (err) {
      console.error("Error fetching organizations:", err);
      showError("Failed to fetch organizations. Using test data instead.");
      
      // Set test data to prevent errors
      setOrganizations([
        { id: 1, company_name: "Test Organization 1", created_at: "", updated_at: "" },
        { id: 2, company_name: "Test Organization 2", created_at: "", updated_at: "" },
        { id: 3, company_name: "Test Organization 3", created_at: "", updated_at: "" }
      ]);
    } finally {
      setIsOrgLoading(false);
    }
  };
  
  // Fetch all candidates from API
  const fetchCandidates = async () => {
    try {
      setIsLoading(true);
      const data = await getAllCandidates();
      // Ensure candidates is always an array even if API returns null or undefined
      setCandidates(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setError("Failed to fetch candidates. Please try again.");
      // Set to empty array to prevent filter errors
      setCandidates([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send invitation to candidate
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.organization) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (!isEmailVerified) {
      setEmailError("Please verify your email first");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const payload: SendInvitePayload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        organization: formData.organization,
        organization_name_for_email: formData.organization_name_for_email || undefined,
        position: formData.position || undefined,
        joining_date: formData.joining_date || undefined
      };
      
      await sendCandidateInvite(payload);
      
      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        position: "",
        joining_date: "",
        organization: 0,
        organization_name_for_email: ""
      });
      setIsEmailVerified(false);
      
      // Refresh candidates list
      fetchCandidates();
      
      showSuccess("Invitation sent successfully!");
    } catch (err) {
      console.error("Error sending invitation:", err);
      setError("Failed to send invitation. Please try again.");
      showError("Failed to send invitation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle bulk upload from CSV
  const handleBulkUpload = async () => {
    if (!csvFile) {
      setError("Please select a CSV file");
      return;
    }

    try {
      setIsLoading(true);

      // Create FormData object to send the file
      const formData = new FormData();
      formData.append('csv_file', csvFile);

      // Send the file to the API
      const response = await fetch('/api/candidate-onboarding/bulk-invite/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process bulk invitations');
      }

      const result = await response.json();
      
      // Reset the file input
      setCsvFile(null);
      
      // Refresh candidates list
      fetchCandidates();
      
      showSuccess(`Successfully processed ${result.success_count || 0} invitations${result.failed_count ? `. ${result.failed_count} failed.` : ''}`);
    } catch (err: any) {
      console.error("Error processing bulk invitations:", err);
      setError(err.message || "Failed to process bulk invitations. Please try again.");
      showError(err.message || "Failed to process bulk invitations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState<Partial<CandidateProfile>>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    position: "",
    department: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "invited" | "accepted" | "expired">("all");
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  
  // Function to handle sending invites
  const handleSendInvite = async (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    
    if (!candidate) return;
    
    try {
      setIsLoading(true);
      
      // Use the first organization in the list or default to 1
      const defaultOrganizationId = organizations.length > 0 ? organizations[0].id : 1;
      
      // Prepare payload for API
      const payload: SendInvitePayload = {
        first_name: candidate.first_name,
        last_name: candidate.last_name,
        email: candidate.email,
        organization: defaultOrganizationId,
        position: candidate.position,
        joining_date: candidate.joining_date
      };
      
      // Call API to send invitation
      await sendCandidateInvite(payload);
      
      // Update the candidate status locally
      setCandidates(prevCandidates => 
        prevCandidates.map(c => 
          c.id === candidateId
            ? { 
                ...c, 
                status: "invited", 
                invited_at: new Date().toISOString().split('T')[0], 
                inviteExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
              }
            : c
        )
      );
      
      alert(`Invite sent to ${candidate.first_name} ${candidate.last_name}`);
    } catch (err) {
      console.error("Error sending invite:", err);
      setError("Failed to send invitation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle resending invites
  const handleResendInvite = async (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    
    if (!candidate) return;
    
    try {
      setIsLoading(true);
      
      // Prepare payload for API
      const payload: SendInvitePayload = {
        first_name: candidate.first_name,
        last_name: candidate.last_name,
        email: candidate.email,
        position: candidate.position,
        joining_date: candidate.joining_date
      };
      
      // Call API to send invitation again
      await sendCandidateInvite(payload);
      
      // Update the candidate status locally
      setCandidates(prevCandidates => 
        prevCandidates.map(c => 
          c.id === candidateId
            ? { 
                ...c, 
                status: "invited", 
                invited_at: new Date().toISOString().split('T')[0],
                inviteExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              }
            : c
        )
      );
      
      alert(`Invite resent to ${candidate.first_name} ${candidate.last_name}`);
    } catch (err) {
      console.error("Error resending invite:", err);
      setError("Failed to resend invitation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add a new candidate
  const handleAddCandidate = async () => {
    const { first_name, last_name, email, phone_number, position, department } = newCandidate;
    
    if (!first_name || !last_name || !email || !phone_number) {
      alert("Please fill all required fields");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real implementation, we would call the API:
      // const createdCandidate = await createCandidate(newCandidate);
      
      // For now, we'll simulate it:
      const newId = `c${candidates.length + 1}`;
      const simulatedNewCandidate = {
        ...newCandidate,
        id: newId,
        status: "pending"
      };
      
      setCandidates(prev => [...prev, simulatedNewCandidate as CandidateWithUIProps]);
      
      setNewCandidate({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        position: "",
        department: ""
      });
      
      setShowModal(false);
      alert(`Candidate ${first_name} ${last_name} added successfully`);
    } catch (err) {
      console.error("Error creating candidate:", err);
      setError("Failed to create candidate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle bulk actions
  const handleBulkInvite = async () => {
    if (selectedCandidates.length === 0) {
      alert("Please select candidates first");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a production environment, we would use Promise.all to send multiple invites at once
      // const invitePromises = selectedCandidates.map(id => {
      //   const candidate = candidates.find(c => c.id === id);
      //   if (!candidate) return Promise.resolve();
      //   return sendCandidateInvite({
      //     first_name: candidate.first_name,
      //     last_name: candidate.last_name,
      //     email: candidate.email,
      //     position: candidate.position,
      //     joining_date: candidate.joining_date
      //   });
      // });
      // await Promise.all(invitePromises);
      
      // For now, simulate the bulk invite by updating local state
      setCandidates(prevCandidates => 
        prevCandidates.map(candidate => {
          if (candidate.id && selectedCandidates.includes(candidate.id) && 
             (candidate.status === "pending" || candidate.status === "rejected")) {
            return { 
              ...candidate, 
              status: "invited", 
              invited_at: new Date().toISOString().split('T')[0],
              inviteExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };
          }
          return candidate;
        })
      );
      
      alert(`Invites sent to ${selectedCandidates.length} candidates`);
      setSelectedCandidates([]);
    } catch (err) {
      console.error("Error sending bulk invites:", err);
      setError("Failed to send bulk invites. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle select candidate
  const toggleSelectCandidate = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  // Select all visible candidates
  const selectAllVisible = () => {
    // Filter out any undefined IDs
    const visibleCandidateIds = filteredCandidates
      .map(c => c.id)
      .filter((id): id is string => id !== undefined);
      
    setSelectedCandidates(prev => {
      const allSelected = visibleCandidateIds.length > 0 && visibleCandidateIds.every(id => prev.includes(id));
      return allSelected ? [] : visibleCandidateIds;
    });
  };

  // Filter candidates based on search and filter
  const filteredCandidates = Array.isArray(candidates) ? candidates.filter(candidate => {
    const fullName = `${candidate?.first_name || ''} ${candidate?.last_name || ''}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      (candidate?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (candidate?.position || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (candidate?.department || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    // Adjust filter matching to match the API's status values
    let matchesFilter = filter === "all";
    if (!matchesFilter && candidate?.status) {
      if (filter === "pending" && candidate.status === "pending") {
        matchesFilter = true;
      } else if (filter === "invited" && candidate.status === "invited") {
        matchesFilter = true;
      } else if (filter === "accepted" && candidate.status === "submitted") {
        matchesFilter = true;
      } else if (filter === "expired" && candidate.status === "rejected") {
        matchesFilter = true;
      }
    }
      
    return matchesSearch && matchesFilter;
  }) : [];

  // Copy invite link to clipboard
  const copyInviteLink = (candidateId: string) => {
    const dummyLink = `https://company.hrapp.com/onboarding/invite/${candidateId}`;
    navigator.clipboard.writeText(dummyLink);
    alert("Invite link copied to clipboard");
  };

  return (
    <ModulePage
      title="Candidate Invite"
      description="Invite candidates to create their profiles and begin the onboarding process"
      icon={UserPlus}
      comingSoon={false}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Header controls */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search candidates..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              
              <div className="relative">
                <select
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  title="Filter candidates by status"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="invited">Invited</option>
                  <option value="accepted">Accepted</option>
                  <option value="expired">Expired</option>
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleBulkInvite}
                disabled={selectedCandidates.length === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm 
                  ${selectedCandidates.length === 0 
                    ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                <Mail className="h-4 w-4" />
                <span>Bulk Invite ({selectedCandidates.length})</span>
              </button>
              
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Candidate</span>
              </button>
            </div>
          </div>
          
          {/* Email Verification Form */}
          <div className="mb-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Send Candidate Invitation
            </h3>
            
            <div className="flex justify-between mb-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${!bulkMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white'}`}
                onClick={() => setBulkMode(false)}
              >
                Single Invite
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${bulkMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white'}`}
                onClick={() => setBulkMode(true)}
              >
                Bulk Invite
              </button>
            </div>
            
            {!bulkMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name *
                    </label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="John"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name *
                    </label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      placeholder="Doe"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="candidateEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enter Candidate Email Address *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                      <input
                        id="candidateEmail"
                        name="email"
                        type="email"
                        placeholder="example@company.com"
                        className={`w-full px-4 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      {emailError && (
                        <p className="mt-1 text-sm text-red-500">{emailError}</p>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      onClick={verifyEmail}
                      disabled={isVerifying || !formData.email}
                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center ${
                        isVerifying 
                          ? 'bg-blue-400 text-white cursor-not-allowed' 
                          : !formData.email
                            ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      title="Verify email address"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : isEmailVerified ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Verified
                        </>
                      ) : (
                        'Verify Email'
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Organization *
                  </label>
                  <select
                    id="organization"
                    name="organization"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={formData.organization}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Organization</option>
                    {isOrgLoading ? (
                      <option disabled>Loading organizations...</option>
                    ) : organizations.length === 0 ? (
                      <option disabled>No organizations found</option>
                    ) : (
                      organizations.map(org => {
                        console.log("Rendering organization option:", org);
                        return (
                          <option key={org.id} value={org.id}>
                            {org.company_name || org.name || `Organization ${org.id}`}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="organization_name_for_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Custom Organization Name (Optional)
                  </label>
                  <input
                    id="organization_name_for_email"
                    name="organization_name_for_email"
                    type="text"
                    placeholder="Custom name for email (if different from organization name)"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={formData.organization_name_for_email}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This name will be used in the invitation email instead of the organization name
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Position (Optional)
                  </label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    placeholder="Software Engineer"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={formData.position}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="joining_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Joining Date (Optional)
                  </label>
                  <input
                    id="joining_date"
                    name="joining_date"
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={formData.joining_date}
                    onChange={handleInputChange}
                  />
                </div>
                
                {isEmailVerified && (
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      <p className="text-sm text-green-800 dark:text-green-200">Email verified successfully. Ready to send invitation.</p>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                    <div className="flex items-center">
                      <X className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                      <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!isEmailVerified || isLoading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                      !isEmailVerified || isLoading
                        ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    title="Send invitation"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Invitation
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="bulk-upload-section">
                <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Upload CSV File for Bulk Invitations
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    CSV format: email,first_name,last_name,organization_id,organization_name_for_email
                  </p>
                  
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => e.target.files && setCsvFile(e.target.files[0])}
                    className="hidden"
                    id="csv-upload"
                  />
                  
                  <div className="flex flex-col items-center">
                    <label
                      htmlFor="csv-upload"
                      className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer mb-4"
                    >
                      Select CSV File
                    </label>
                    
                    {csvFile && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <FileText className="w-4 h-4" />
                        <span>{csvFile.name}</span>
                        <button
                          type="button"
                          onClick={() => setCsvFile(null)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove selected file"
                          aria-label="Remove selected file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      disabled={!csvFile || isLoading}
                      onClick={handleBulkUpload}
                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                        !csvFile || isLoading
                          ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      title="Process bulk invitations"
                      aria-label="Process bulk invitations"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Process Bulk Invites
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">CSV File Format</h4>
                  <p className="mb-2">Your CSV file should contain the following columns:</p>
                  <ul className="list-disc list-inside mb-4">
                    <li>email - The candidate's email address</li>
                    <li>first_name - The candidate's first name</li>
                    <li>last_name - The candidate's last name</li>
                    <li>organization_id - The ID of the organization</li>
                    <li>organization_name_for_email (optional) - Custom organization name for the email</li>
                    <li>position (optional) - The candidate's position</li>
                    <li>joining_date (optional) - The candidate's joining date (YYYY-MM-DD)</li>
                  </ul>
                  <p>
                    <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      Download sample CSV template
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={filteredCandidates.length > 0 && filteredCandidates.every(c => c.id && selectedCandidates.includes(c.id))}
                        onChange={selectAllVisible}
                        title="Select all visible candidates"
                        aria-label="Select all visible candidates"
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Invited On
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Expires
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          checked={selectedCandidates.includes(candidate.id || '')}
                          onChange={() => toggleSelectCandidate(candidate.id || '')}
                          title={`Select ${candidate.first_name} ${candidate.last_name}`}
                          aria-label={`Select ${candidate.first_name} ${candidate.last_name}`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{candidate.first_name} {candidate.last_name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{candidate.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{candidate.position}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{candidate.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${candidate.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''} 
                          ${candidate.status === 'invited' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''} 
                          ${candidate.status === 'submitted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''} 
                          ${candidate.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}`}
                        >
                          {candidate.status === 'submitted' ? 'Accepted' : 
                           candidate.status === 'rejected' ? 'Expired' : 
                           candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {candidate.invited_at || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {candidate.inviteExpiry || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          {candidate.status === "pending" && (
                            <button
                              onClick={() => candidate.id && handleSendInvite(candidate.id)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Send invite"
                              aria-label="Send invite"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                          )}
                          
                          {(candidate.status === "invited" || candidate.status === "rejected") && (
                            <>
                              <button
                                onClick={() => candidate.id && handleResendInvite(candidate.id)}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                title="Resend Invite"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </button>
                              
                              <button
                                onClick={() => candidate.id && copyInviteLink(candidate.id)}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                                title="Copy Invite Link"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          
                          {candidate.status === "submitted" && (
                            <button
                              onClick={() => alert(`View profile for ${candidate.first_name} ${candidate.last_name}`)}
                              className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                              title="View Profile"
                            >
                              <FileText className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                      No candidates found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Add Candidate Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-md p-6 mx-auto my-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
            >
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:text-gray-500 dark:hover:text-gray-300"
                  onClick={() => setShowModal(false)}
                  title="Close modal"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Add New Candidate
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="block w-full mt-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="John"
                      value={newCandidate.first_name}
                      onChange={(e) => setNewCandidate({...newCandidate, first_name: e.target.value})}
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="block w-full mt-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Doe"
                      value={newCandidate.last_name}
                      onChange={(e) => setNewCandidate({...newCandidate, last_name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="block w-full mt-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="john.doe@example.com"
                      value={newCandidate.email}
                      onChange={(e) => setNewCandidate({...newCandidate, email: e.target.value})}
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      className="block w-full mt-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="555-123-4567"
                      value={newCandidate.phone_number}
                      onChange={(e) => setNewCandidate({...newCandidate, phone_number: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Position
                    </label>
                    <input
                      type="text"
                      id="position"
                      className="block w-full mt-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Software Engineer"
                      value={newCandidate.position}
                      onChange={(e) => setNewCandidate({...newCandidate, position: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Department
                    </label>
                    <select
                      id="department"
                      className="block w-full mt-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={newCandidate.department}
                      onChange={(e) => setNewCandidate({...newCandidate, department: e.target.value})}
                    >
                      <option value="">Select Department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Product">Product</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddCandidate}
                >
                  Add Candidate
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </ModulePage>
  );
};

export default CandidateInvite;
