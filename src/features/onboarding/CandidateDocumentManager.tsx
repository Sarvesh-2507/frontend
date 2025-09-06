import React, { useState, useEffect } from "react";
import { Upload, File, Check, X, User, Eye, Trash2, Plus, Search, Download, AlertCircle, Clock, Loader2 } from "lucide-react";
import ModulePage from "../../components/ModulePage";
import { motion } from "framer-motion";
import { getApiUrl } from "../../config";

// Backend API Schema for CandidateDetails (from your backend)
interface CandidateDetails {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: "pending" | "submitted" | "assigned" | "profile_created";
  invited_at: string;
  submitted_at: string | null;
  form_data: object;
}

// Document interface for the component
interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: "verified" | "pending" | "rejected";
  notes?: string;
  url?: string;
}

// Candidate interface extending backend data
interface Candidate extends CandidateDetails {
  name: string; // Computed from first_name + last_name
  position?: string;
  department?: string;
  phoneNumber?: string; // Mapped from phone_number
  address?: string;
  joinDate?: string;
  salary?: string;
  offerStatus?: string;
  verificationStatus?: string;
  uploadedDocuments?: DocumentItem[];
}

// API Configuration
const API_BASE_URL = getApiUrl();

const documentTypes = [
  "Resume/CV",
  "Cover Letter",
  "Portfolio",
  "ID Proof",
  "Education Certificate",
  "Previous Employment Certificates",
  "References",
  "Other"
];

const CandidateDocumentManager: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentCandidateId, setCurrentCandidateId] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<string>(documentTypes[0]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [updateInProgress, setUpdateInProgress] = useState(false);

  // Fetch candidates when component mounts
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        setError(null);

        // Check both possible token keys
        const token = localStorage.getItem("accessToken") || localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication token not found. Please login again.");
        }

        console.log("🔍 Fetching candidates from backend...");
        const response = await fetch(`${getApiUrl()}/onboarding/candidates/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Candidates fetched successfully:", data);

        // The backend returns an array directly
        const candidatesArray = Array.isArray(data) ? data : [];
        const transformedCandidates = candidatesArray.map((candidate: any) => ({
          ...candidate,
          name: `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim(),
          phoneNumber: candidate.phone_number,
          organization: candidate.assigned_organization_name || '',
          invitedBy: candidate.invited_by_name || '',
          joinDate: candidate.invited_at ? new Date(candidate.invited_at).toLocaleDateString() : '',
          email: candidate.email,
          status: candidate.status,
          uploadedDocuments: [],
        }));

        setCandidates(transformedCandidates);
      } catch (err: any) {
        console.error("❌ Failed to fetch candidates:", err);
        setError(err.message || "Failed to fetch candidates from backend");
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Refresh function to reload candidates
  const refreshCandidates = () => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        setError(null);

        // Check both possible token keys
        const token = localStorage.getItem("accessToken") || localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication token not found. Please login again.");
        }

        console.log("🔍 Refreshing candidates from backend...");
        const response = await fetch(`${getApiUrl()}/profiles/api/candidate-onboarding/candidates_status/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,  // Changed from Bearer to Token
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Candidates refreshed successfully:", data);

        // The backend returns an array directly
        const candidatesArray = Array.isArray(data) ? data : [];
        const transformedCandidates = candidatesArray.map((candidate: any) => ({
          ...candidate,
          // Use the name from backend if available
          name: candidate.name || `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim(),
          phoneNumber: candidate.phone_number,
          position: "Not specified",
          department: "Not specified",
          address: "Not specified",
          joinDate: candidate.invited_at ? new Date(candidate.invited_at).toISOString().split('T')[0] : undefined,
          salary: "Not specified",
          offerStatus: candidate.status === "profile_created" ? "accepted" : "pending",
          verificationStatus: candidate.status === "profile_created" ? "completed" : "pending",
          uploadedDocuments: []
        }));

        setCandidates(transformedCandidates);
      } catch (err: any) {
        console.error("❌ Failed to refresh candidates:", err);
        setError(err.message || "Failed to refresh candidates from backend");
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <Check className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getCandidateStatusClass = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-800";
      case "review":
        return "bg-blue-100 text-blue-800";
      case "incomplete":
        return "bg-yellow-100 text-yellow-800";
      case "onboarding":
        return "bg-purple-100 text-purple-800";
      case "hired":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteDocument = async (candidateId: string, documentId: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setUpdateInProgress(true);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Authentication token not found. Please login again.");
        }

        const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/documents/${documentId}/`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Update the local state after successful deletion
          setCandidates(prevCandidates => 
            prevCandidates.map(candidate => {
              if (candidate.id === candidateId) {
                return {
                  ...candidate,
                  uploadedDocuments: candidate.uploadedDocuments?.filter(doc => doc.id !== documentId) || []
                };
              }
              return candidate;
            })
          );
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
      } catch (err: any) {
        console.error("Error deleting document:", err);
        alert(err.message || "Failed to delete document from backend");
      } finally {
        setUpdateInProgress(false);
      }
    }
  };

  const handleUpdateDocumentStatus = async (candidateId: string, documentId: string, newStatus: "verified" | "pending" | "rejected", notes?: string) => {
    setUpdateInProgress(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/documents/${documentId}/status/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          notes: notes || ""
        }),
      });

      if (response.ok) {
        // Update the local state after successful status update
        setCandidates(prevCandidates => 
          prevCandidates.map(candidate => {
            if (candidate.id === candidateId) {
              return {
                ...candidate,
                uploadedDocuments: candidate.uploadedDocuments?.map(doc => 
                  doc.id === documentId ? { ...doc, status: newStatus, notes } : doc
                ) || []
              };
            }
            return candidate;
          })
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (err: any) {
      console.error("Error updating document status:", err);
      alert(err.message || "Failed to update document status on backend");
    } finally {
      setUpdateInProgress(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileToUpload(event.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!fileToUpload || !currentCandidateId) return;
    
    setUploadingFile(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('type', documentType);

      const response = await fetch(`${API_BASE_URL}/candidates/${currentCandidateId}/documents/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const uploadedDoc = await response.json();
        
        // Transform backend response to component format
        const newDocument: DocumentItem = {
          id: uploadedDoc.id || Date.now().toString(),
          name: fileToUpload.name,
          type: documentType,
          size: `${(fileToUpload.size / 1024 / 1024).toFixed(2)} MB`,
          uploadDate: new Date().toISOString().split('T')[0],
          status: "pending",
          url: uploadedDoc.url || undefined
        };

        // Update the local state after successful upload
        setCandidates(prevCandidates => 
          prevCandidates.map(candidate => {
            if (candidate.id === currentCandidateId) {
              return {
                ...candidate,
                uploadedDocuments: [...(candidate.uploadedDocuments || []), newDocument]
              };
            }
            return candidate;
          })
        );
        
        setShowUploadModal(false);
        setFileToUpload(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (err: any) {
      console.error("Error uploading document:", err);
      alert(err.message || "Failed to upload document to backend");
    } finally {
      setUploadingFile(false);
    }
  };

  const filteredCandidates = Array.isArray(candidates)
    ? candidates.filter(candidate => 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (candidate.position || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (candidate.department || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const selectedCandidateData = selectedCandidate 
    ? candidates.find(c => c.id === selectedCandidate) 
    : null;

  return (
    <ModulePage
      title="Uploaded Candidates"
      description="Browse, search, and manage candidate uploads."
      icon={File}
      comingSoon={false}
    >
      {/* Top Bar with Tabs */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 rounded-t-lg text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none">Uploaded Candidates</button>
          <button className="px-4 py-2 rounded-t-lg text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none">Onboarding Invite</button>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search candidates..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <button
            onClick={refreshCandidates}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <span className="mt-3 text-lg text-gray-600 dark:text-gray-300">Loading candidates...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16">
          <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
          <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={refreshCandidates}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Retrying..." : "Try Again"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredCandidates.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No candidates found matching your search criteria.</p>
            </div>
          ) : (
            filteredCandidates.map(candidate => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between min-h-[320px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{candidate.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{candidate.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getCandidateStatusClass(candidate.status)}`}>{candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>{candidate.position}</span>
                    <span className="mx-2">•</span>
                    <span>{candidate.department}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Invited: {candidate.joinDate || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      <File className="w-4 h-4 mr-1" />
                      {candidate.uploadedDocuments?.length || 0} documents
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      <Check className="w-4 h-4 mr-1 text-green-500" />
                      {candidate.verificationStatus === 'completed' ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCandidate(candidate.id)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setCurrentCandidateId(candidate.id);
                      setShowUploadModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow flex items-center justify-center"
                  >
                    <Upload size={16} className="mr-2" />
                    Upload
                  </button>
                </div>
                {/* Expanded details for selected candidate */}
                {selectedCandidate === candidate.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Uploaded Documents</h4>
                    {candidate.uploadedDocuments && candidate.uploadedDocuments.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {candidate.uploadedDocuments.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="flex items-center space-x-3">
                              <File className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{doc.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{doc.type} • {doc.size} • {doc.uploadDate}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(doc.status)}`}>{getStatusIcon(doc.status)}<span className="ml-1">{doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</span></span>
                              {doc.url && (
                                <button className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-700 text-xs rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                  <Eye size={14} className="mr-1" />View
                                </button>
                              )}
                              <button className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-gray-700 text-xs rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <Download size={14} className="mr-1" />Download
                              </button>
                              <button
                                onClick={() => !updateInProgress && handleDeleteDocument(candidate.id, doc.id)}
                                className="inline-flex items-center px-2 py-1 border border-red-300 text-xs rounded-md text-red-700 bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                                disabled={updateInProgress}
                              >
                                <Trash2 size={14} className="mr-1" />Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <File className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                        <div className="text-gray-600 dark:text-gray-400 text-sm">No documents uploaded</div>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upload Document</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Type</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Document Type"
                  title="Select document type"
                >
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Upload Document"
                  title="Select a file to upload"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setFileToUpload(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  disabled={uploadingFile}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  disabled={!fileToUpload || uploadingFile}
                >
                  {uploadingFile ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={16} className="mr-2" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModulePage>
  );
};

export default CandidateDocumentManager;
