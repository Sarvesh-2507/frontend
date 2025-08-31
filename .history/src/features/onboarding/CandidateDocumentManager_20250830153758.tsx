import React, { useState, useEffect } from "react";
import { Upload, File, Check, X, User, Eye, Trash2, Plus, Search, Download, AlertCircle, Clock, Loader2 } from "lucide-react";
import ModulePage from "../../components/ModulePage";
import { motion } from "framer-motion";

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
const API_BASE_URL = "http://192.168.1.132:8000/api";

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

        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Authentication token not found. Please login again.");
        }

        console.log("🔍 Fetching candidates from backend...");
        const response = await fetch(`http://192.168.1.132:8000/api/profiles/api/candidate-onboarding`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Candidates fetched successfully:", data);

        // Transform backend data to component format
        const candidatesArray = Array.isArray(data) ? data : data.results || [];
        const transformedCandidates: Candidate[] = candidatesArray.map((candidate: CandidateDetails) => ({
          ...candidate,
          name: `${candidate.first_name} ${candidate.last_name}`.trim(),
          phoneNumber: candidate.phone_number,
          position: "Not specified", // Will need to be added to backend schema
          department: "Not specified", // Will need to be added to backend schema
          address: "Not specified", // Will need to be added to backend schema
          joinDate: candidate.invited_at ? new Date(candidate.invited_at).toISOString().split('T')[0] : undefined,
          salary: "Not specified", // Will need to be added to backend schema
          offerStatus: candidate.status === "profile_created" ? "accepted" : "pending",
          verificationStatus: candidate.status === "profile_created" ? "completed" : "pending",
          uploadedDocuments: [] // Documents will be fetched separately if needed
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

        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Authentication token not found. Please login again.");
        }

        console.log("🔍 Refreshing candidates from backend...");
        const response = await fetch(`http://192.168.1.132:8000/api/profiles/api/candidate-onboarding/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Candidates refreshed successfully:", data);

        // Transform backend data to component format
        const candidatesArray = Array.isArray(data) ? data : data.results || [];
        const transformedCandidates: Candidate[] = candidatesArray.map((candidate: CandidateDetails) => ({
          ...candidate,
          name: `${candidate.first_name} ${candidate.last_name}`.trim(),
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
      title="Candidate Documents" 
      description="Manage candidate document uploads and verification"
      icon={File}
      comingSoon={false}
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Candidate Document Management</h2>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <span className="ml-3 text-lg text-gray-600">Loading candidates...</span>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-3" />
              <p className="text-lg text-red-600">{error}</p>
              <button 
                onClick={refreshCandidates} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                disabled={loading}
              >
                {loading ? "Retrying..." : "Try Again"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Candidates List */}
              <div className="md:col-span-1 border-r border-gray-200 pr-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Candidates</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {filteredCandidates.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No candidates found matching your search criteria.</p>
                  ) : (
                    filteredCandidates.map(candidate => (
                      <motion.div
                        key={candidate.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedCandidate === candidate.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => setSelectedCandidate(candidate.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                            <p className="text-sm text-gray-600">{candidate.email}</p>
                            <div className="flex items-center mt-2">
                              <span className="text-xs text-gray-500">{candidate.position}</span>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-xs text-gray-500">{candidate.department}</span>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getCandidateStatusClass(candidate.status)}`}>
                            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                          </span>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center text-sm text-gray-500">
                            <File className="w-4 h-4 mr-1" />
                            <span>{candidate.uploadedDocuments?.length || 0} documents</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Documents */}
              <div className="md:col-span-2">
                {selectedCandidateData ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{selectedCandidateData.name}'s Documents</h3>
                        <p className="text-sm text-gray-600">{selectedCandidateData.position} • {selectedCandidateData.department}</p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentCandidateId(selectedCandidateData.id);
                          setShowUploadModal(true);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Upload size={16} />
                        <span>Upload Document</span>
                      </button>
                    </div>

                    {selectedCandidateData.uploadedDocuments && selectedCandidateData.uploadedDocuments.length > 0 ? (
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {selectedCandidateData.uploadedDocuments.map(doc => (
                          <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-md mr-4">
                                  <File className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{doc.name}</h4>
                                  <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <span>{doc.type}</span>
                                    <span className="mx-2">•</span>
                                    <span>{doc.size}</span>
                                    <span className="mx-2">•</span>
                                    <span>Uploaded on {doc.uploadDate}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(doc.status)}`}>
                                  {getStatusIcon(doc.status)}
                                  <span className="ml-1">{doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</span>
                                </span>
                              </div>
                            </div>

                            {doc.notes && (
                              <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                                <span className="font-medium">Notes:</span> {doc.notes}
                              </div>
                            )}

                            <div className="mt-4 flex justify-end space-x-2">
                              {doc.url && (
                                <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                  <Eye size={16} className="mr-1" />
                                  View
                                </button>
                              )}
                              <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                <Download size={16} className="mr-1" />
                                Download
                              </button>
                              <div className="relative group">
                                <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                  Status
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                                  <div className="py-1">
                                    <button
                                      onClick={() => !updateInProgress && handleUpdateDocumentStatus(selectedCandidateData.id, doc.id, "verified")}
                                      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                      disabled={updateInProgress}
                                    >
                                      <Check className="w-4 h-4 mr-2 text-green-500" />
                                      Mark as Verified
                                    </button>
                                    <button
                                      onClick={() => !updateInProgress && handleUpdateDocumentStatus(selectedCandidateData.id, doc.id, "pending")}
                                      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                      disabled={updateInProgress}
                                    >
                                      <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                                      Mark as Pending
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (!updateInProgress) {
                                          const notes = prompt("Please provide a reason for rejection:");
                                          if (notes !== null) {
                                            handleUpdateDocumentStatus(selectedCandidateData.id, doc.id, "rejected", notes);
                                          }
                                        }
                                      }}
                                      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                      disabled={updateInProgress}
                                    >
                                      <X className="w-4 h-4 mr-2 text-red-500" />
                                      Mark as Rejected
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => !updateInProgress && handleDeleteDocument(selectedCandidateData.id, doc.id)}
                                className="inline-flex items-center px-3 py-1 border border-red-300 text-sm rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
                                disabled={updateInProgress}
                              >
                                <Trash2 size={16} className="mr-1" />
                                Delete
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <File className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h3>
                        <p className="text-gray-600 mb-4">Upload some documents to get started</p>
                        <button
                          onClick={() => {
                            setCurrentCandidateId(selectedCandidateData.id);
                            setShowUploadModal(true);
                          }}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <Upload size={16} className="mr-2" />
                          Upload First Document
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No candidate selected</h3>
                    <p className="text-gray-600">Select a candidate from the list to view their documents</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Document Type"
                  title="Select document type"
                >
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
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
