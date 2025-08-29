import { Shield, FileCheck, AlertCircle, Check, Clock, X, ChevronDown, Upload, Search } from "lucide-react";
import React, { useState } from "react";
import ModulePage from "../../components/ModulePage";
import { motion } from "framer-motion";

interface Candidate {
  id: string;
  name: string;
  position: string;
  status: "pending" | "in_progress" | "completed" | "issues";
  documentsRequired: VerificationDocument[];
  email: string;
}

interface VerificationDocument {
  id: string;
  name: string;
  status: "pending" | "verified" | "rejected" | "awaiting";
  uploadedDate?: string;
  verifiedDate?: string;
  rejectionReason?: string;
  documentType: "identity" | "education" | "employment" | "address" | "criminal" | "other";
}

const BackgroundVerification: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "1",
      name: "Alex Johnson",
      position: "Senior Developer",
      status: "in_progress",
      email: "alex.johnson@example.com",
      documentsRequired: [
        { id: "d1", name: "Identity Proof", status: "verified", documentType: "identity", uploadedDate: "2023-10-15", verifiedDate: "2023-10-18" },
        { id: "d2", name: "Education Certificate", status: "pending", documentType: "education" },
        { id: "d3", name: "Previous Employment Letter", status: "awaiting", documentType: "employment", uploadedDate: "2023-10-16" },
        { id: "d4", name: "Address Proof", status: "rejected", documentType: "address", uploadedDate: "2023-10-14", rejectionReason: "Document unclear or expired" },
      ]
    },
    {
      id: "2",
      name: "Sarah Miller",
      position: "UX Designer",
      status: "pending",
      email: "sarah.miller@example.com",
      documentsRequired: [
        { id: "d5", name: "Identity Proof", status: "pending", documentType: "identity" },
        { id: "d6", name: "Education Certificate", status: "pending", documentType: "education" },
        { id: "d7", name: "Previous Employment Letter", status: "pending", documentType: "employment" },
      ]
    },
    {
      id: "3",
      name: "Michael Chen",
      position: "Project Manager",
      status: "completed",
      email: "michael.chen@example.com",
      documentsRequired: [
        { id: "d8", name: "Identity Proof", status: "verified", documentType: "identity", uploadedDate: "2023-09-10", verifiedDate: "2023-09-12" },
        { id: "d9", name: "Education Certificate", status: "verified", documentType: "education", uploadedDate: "2023-09-10", verifiedDate: "2023-09-13" },
        { id: "d10", name: "Previous Employment Letter", status: "verified", documentType: "employment", uploadedDate: "2023-09-11", verifiedDate: "2023-09-14" },
        { id: "d11", name: "Criminal Record Check", status: "verified", documentType: "criminal", uploadedDate: "2023-09-12", verifiedDate: "2023-09-15" },
      ]
    },
    {
      id: "4",
      name: "Emily Wilson",
      position: "HR Specialist",
      status: "issues",
      email: "emily.wilson@example.com",
      documentsRequired: [
        { id: "d12", name: "Identity Proof", status: "verified", documentType: "identity", uploadedDate: "2023-10-05", verifiedDate: "2023-10-07" },
        { id: "d13", name: "Education Certificate", status: "rejected", documentType: "education", uploadedDate: "2023-10-05", rejectionReason: "Incomplete document" },
        { id: "d14", name: "Previous Employment Letter", status: "rejected", documentType: "employment", uploadedDate: "2023-10-06", rejectionReason: "Information mismatch" },
      ]
    },
  ]);

  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedVerification, setExpandedVerification] = useState<string | null>(null);
  
  const getStatusIcon = (status: "pending" | "in_progress" | "completed" | "issues" | "verified" | "rejected" | "awaiting") => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-gray-400" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <Check className="h-5 w-5 text-green-500" />;
      case "issues":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "verified":
        return <Check className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <X className="h-5 w-5 text-red-500" />;
      case "awaiting":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: "pending" | "in_progress" | "completed" | "issues" | "verified" | "rejected" | "awaiting") => {
    switch (status) {
      case "pending":
        return "Pending";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "issues":
        return "Issues Found";
      case "verified":
        return "Verified";
      case "rejected":
        return "Rejected";
      case "awaiting":
        return "Awaiting Review";
      default:
        return "Unknown";
    }
  };

  const getStatusClass = (status: "pending" | "in_progress" | "completed" | "issues" | "verified" | "rejected" | "awaiting") => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-600";
      case "in_progress":
        return "bg-blue-100 text-blue-600";
      case "completed":
        return "bg-green-100 text-green-600";
      case "issues":
        return "bg-red-100 text-red-600";
      case "verified":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      case "awaiting":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateDocumentStatus = (candidateId: string, documentId: string, newStatus: "pending" | "verified" | "rejected" | "awaiting") => {
    setCandidates(prev => 
      prev.map(candidate => {
        if (candidate.id === candidateId) {
          const updatedDocuments = candidate.documentsRequired.map(doc => {
            if (doc.id === documentId) {
              return {
                ...doc,
                status: newStatus,
                verifiedDate: newStatus === "verified" ? new Date().toISOString().split('T')[0] : doc.verifiedDate,
                rejectionReason: newStatus === "rejected" ? "Document does not meet requirements" : doc.rejectionReason
              };
            }
            return doc;
          });
          
          // Update candidate status based on document statuses
          let newCandidateStatus: "pending" | "in_progress" | "completed" | "issues" = "pending";
          
          if (updatedDocuments.some(d => d.status === "rejected")) {
            newCandidateStatus = "issues";
          } else if (updatedDocuments.every(d => d.status === "verified")) {
            newCandidateStatus = "completed";
          } else if (updatedDocuments.some(d => d.status === "verified" || d.status === "awaiting")) {
            newCandidateStatus = "in_progress";
          }
          
          return {
            ...candidate,
            documentsRequired: updatedDocuments,
            status: newCandidateStatus
          };
        }
        return candidate;
      })
    );
  };

  const uploadDocument = (candidateId: string, documentId: string) => {
    setCandidates(prev => 
      prev.map(candidate => {
        if (candidate.id === candidateId) {
          const updatedDocuments = candidate.documentsRequired.map(doc => {
            if (doc.id === documentId) {
              return {
                ...doc,
                status: "awaiting" as const,
                uploadedDate: new Date().toISOString().split('T')[0]
              };
            }
            return doc;
          });
          
          // Update candidate status
          let newCandidateStatus: "pending" | "in_progress" | "completed" | "issues" = "pending";
          
          if (updatedDocuments.some(d => d.status === "awaiting" || d.status === "verified")) {
            newCandidateStatus = "in_progress";
          }
          
          return {
            ...candidate,
            documentsRequired: updatedDocuments,
            status: newCandidateStatus
          };
        }
        return candidate;
      })
    );
  };

  return (
    <ModulePage
      title="Background Verification"
      description="Track and manage background verification documents for candidates"
      icon={Shield}
    >
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Verification Tracking</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search candidates..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => (
                <React.Fragment key={candidate.id}>
                  <tr 
                    className={`hover:bg-gray-50 cursor-pointer ${selectedCandidate === candidate.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedCandidate(selectedCandidate === candidate.id ? null : candidate.id)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-gray-900">{candidate.name}</div>
                          <div className="text-sm text-gray-500">{candidate.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">{candidate.position}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(candidate.status)}`}>
                        {getStatusIcon(candidate.status)}
                        <span className="ml-1">{getStatusText(candidate.status)}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {candidate.documentsRequired.length} Required
                    </td>
                    <td className="py-4 px-4 text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 flex items-center justify-end w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCandidate(selectedCandidate === candidate.id ? null : candidate.id);
                        }}
                      >
                        <span>Details</span>
                        <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${selectedCandidate === candidate.id ? 'rotate-180' : ''}`} />
                      </button>
                    </td>
                  </tr>
                  
                  {selectedCandidate === candidate.id && (
                    <tr>
                      <td colSpan={5} className="py-0">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-4"
                        >
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-md font-medium mb-3">Document Verification Status</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {candidate.documentsRequired.map((doc) => (
                                <div 
                                  key={doc.id} 
                                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h4 className="font-medium">{doc.name}</h4>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(doc.status)}`}>
                                        {getStatusIcon(doc.status)}
                                        <span className="ml-1">{getStatusText(doc.status)}</span>
                                      </span>
                                    </div>
                                    <div className="flex space-x-2">
                                      {doc.status !== "verified" && (
                                        <button 
                                          onClick={() => uploadDocument(candidate.id, doc.id)}
                                          className="text-blue-600 hover:text-blue-800"
                                          title="Upload Document"
                                        >
                                          <Upload className="h-5 w-5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="text-sm text-gray-500 mt-2">
                                    {doc.uploadedDate && (
                                      <div className="mb-1">Uploaded: {doc.uploadedDate}</div>
                                    )}
                                    {doc.verifiedDate && (
                                      <div className="mb-1">Verified: {doc.verifiedDate}</div>
                                    )}
                                    {doc.rejectionReason && (
                                      <div className="mb-1 text-red-500">Reason: {doc.rejectionReason}</div>
                                    )}
                                  </div>
                                  
                                  {(doc.status === "awaiting" || doc.status === "rejected") && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end space-x-2">
                                      <button 
                                        onClick={() => updateDocumentStatus(candidate.id, doc.id, "verified")}
                                        className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium hover:bg-green-200"
                                      >
                                        Approve
                                      </button>
                                      <button 
                                        onClick={() => updateDocumentStatus(candidate.id, doc.id, "rejected")}
                                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200"
                                      >
                                        Reject
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ModulePage>
  );
};

export default BackgroundVerification;
