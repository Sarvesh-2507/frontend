import React, { useState } from "react";
import { ClipboardList, Upload, Check, X, File, FileText, Eye, Download, Plus, AlertCircle, Search } from "lucide-react";
import ModulePage from "../../components/ModulePage";
import { motion } from "framer-motion";
import AccessibleProgressBar from "../../components/ui/AccessibleProgressBar";

interface Document {
  id: string;
  name: string;
  type: string;
  status: "pending" | "uploaded" | "verified" | "rejected";
  uploadedAt?: string;
  verifiedAt?: string;
  file?: File;
  comments?: string | undefined;
}

interface Candidate {
  id: string;
  name: string;
  position: string;
  department: string;
  documents: Document[];
  progress: number;
}

const documentTypes = [
  "Identity Proof",
  "Address Proof",
  "Educational Certificates",
  "Previous Employment Documents",
  "Bank Account Details",
  "Tax Documents",
  "Medical History",
  "Emergency Contact",
  "Employment Contract",
  "Non-Disclosure Agreement"
];

const PreBoarding: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "c1",
      name: "David Wilson",
      position: "Frontend Developer",
      department: "Engineering",
      progress: 70,
      documents: [
        {
          id: "d1",
          name: "Identity Card",
          type: "Identity Proof",
          status: "verified",
          uploadedAt: "2025-08-10T10:30:00",
          verifiedAt: "2025-08-12T14:20:00"
        },
        {
          id: "d2",
          name: "Residential Proof",
          type: "Address Proof",
          status: "verified",
          uploadedAt: "2025-08-10T10:35:00"
        },
        {
          id: "d3",
          name: "Offer Letter",
          type: "Previous Employment Documents",
          status: "pending",
          uploadedAt: "2025-08-10T10:45:00",
          comments: "Document is incomplete. Please upload the complete offer letter."
        },
        {
          id: "d5",
          name: "Bank Details",
          type: "Bank Account Details",
          status: "pending"
        },
        {
          id: "d6",
          name: "Tax Declaration",
          type: "Tax Documents",
          status: "pending"
        }
      ]
    },
    {
      id: "c2",
      name: "Jessica Martinez",
      position: "Product Manager",
      department: "Product",
      progress: 90,
      documents: [
        {
          id: "d7",
          name: "Passport",
          type: "Identity Proof",
          status: "verified",
          uploadedAt: "2025-08-05T09:30:00",
          verifiedAt: "2025-08-06T11:20:00"
        },
        {
          id: "d8",
          name: "Lease Agreement",
          type: "Address Proof",
          status: "verified",
          uploadedAt: "2025-08-05T09:35:00",
          verifiedAt: "2025-08-06T11:25:00"
        },
        {
          id: "d9",
          name: "MBA Certificate",
          type: "Educational Certificates",
          status: "verified",
          uploadedAt: "2025-08-05T09:40:00",
          verifiedAt: "2025-08-06T11:30:00"
        },
        {
          id: "d10",
          name: "Experience Letter",
          type: "Previous Employment Documents",
          status: "verified",
          uploadedAt: "2025-08-05T09:45:00",
          verifiedAt: "2025-08-06T11:35:00"
        },
        {
          id: "d11",
          name: "Bank Account Details",
          type: "Bank Account Details",
          status: "uploaded",
          uploadedAt: "2025-08-05T09:50:00"
        },
        {
          id: "d12",
          name: "PAN Card",
          type: "Tax Documents",
          status: "uploaded",
          uploadedAt: "2025-08-05T09:55:00"
        }
      ]
    }
  ]);
  
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [newDocumentType, setNewDocumentType] = useState("");
  
  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleVerifyDocument = (candidateId: string, documentId: string) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === candidateId
        ? {
            ...candidate,
            documents: candidate.documents.map(doc => 
              doc.id === documentId
                ? { ...doc, status: "verified", verifiedAt: new Date().toISOString() }
                : doc
            ),
            progress: calculateProgress([...candidate.documents.map(doc => 
              doc.id === documentId ? { ...doc, status: "verified" as "verified" } : doc
            )])
          }
        : candidate
    ));
  };
  
  const handleRejectDocument = (candidateId: string, documentId: string, reason: string) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === candidateId
        ? {
            ...candidate,
            documents: candidate.documents.map(doc => 
              doc.id === documentId
                ? { ...doc, status: "rejected", comments: reason }
                : doc
            ),
            progress: calculateProgress([...candidate.documents.map(doc => 
              doc.id === documentId ? { ...doc, status: "rejected" as "rejected" } : doc
            )])
          }
        : candidate
    ));
  };
  
  const calculateProgress = (documents: Document[]): number => {
    if (documents.length === 0) return 0;
    
    const completedDocuments = documents.filter(doc => doc.status === "verified").length;
    return Math.round((completedDocuments / documents.length) * 100);
  };
  
  return (
    <ModulePage
      title="Pre-boarding Documentation"
      description="Manage pre-boarding documents and requirements for new employees"
      icon={ClipboardList}
      comingSoon={false}
    >
      <div className="space-y-6">
        {/* Search bar */}
        <div className="relative">
          <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search candidates..."
              className="bg-transparent border-none focus:outline-none flex-1 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {selectedCandidate ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to all candidates
              </button>
              
              <button
                onClick={() => setShowAddDocumentModal(true)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Document
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCandidate.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{selectedCandidate.position} • {selectedCandidate.department}</p>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                      Document Completion:
                    </span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {selectedCandidate.progress}%
                    </span>
                  </div>
                  <div className="w-48">
                    <AccessibleProgressBar 
                      value={selectedCandidate.progress} 
                      label="Document completion progress"
                      colorClassName="bg-blue-600"
                      height="h-2"
                    />
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Document
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Verified
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {selectedCandidate.documents.map((document) => (
                      <tr key={document.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-400 mr-3" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{document.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{document.type}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {document.status === "verified" && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              Verified
                            </span>
                          )}
                          {document.status === "uploaded" && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                              Pending Verification
                            </span>
                          )}
                          {document.status === "rejected" && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                              Rejected
                            </span>
                          )}
                          {document.status === "pending" && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {document.uploadedAt 
                            ? new Date(document.uploadedAt).toLocaleDateString() 
                            : "-"
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {document.verifiedAt 
                            ? new Date(document.verifiedAt).toLocaleDateString() 
                            : "-"
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-3">
                            {document.status === "uploaded" && (
                              <>
                                <button
                                  onClick={() => handleVerifyDocument(selectedCandidate.id, document.id)}
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                  title="Verify document"
                                >
                                  <Check className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleRejectDocument(selectedCandidate.id, document.id, "Document doesn't meet requirements.")}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Reject document"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            {document.status !== "pending" && (
                              <button
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="View document"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                            )}
                            {document.status === "pending" && (
                              <button
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Upload document"
                              >
                                <Upload className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {selectedCandidate.documents.some(doc => doc.comments) && (
                <div className="mt-6 p-4 border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Notes/Comments:</h4>
                      {selectedCandidate.documents
                        .filter(doc => doc.comments)
                        .map((doc, index) => (
                          <p key={index} className="mt-1 text-sm text-yellow-700 dark:text-yellow-200">
                            {doc.name}: {doc.comments}
                          </p>
                        ))
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{candidate.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.position} • {candidate.department}</p>
                    
                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Document Completion</span>
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{candidate.progress}%</span>
                      </div>
                      <div className="w-full">
                        <AccessibleProgressBar 
                          value={candidate.progress} 
                          label={`Document completion for ${candidate.name}`}
                          height="h-2"
                          colorClassName={
                            candidate.progress < 30 ? 'bg-red-600' : 
                            candidate.progress < 70 ? 'bg-yellow-600' : 
                            'bg-green-600'
                          }
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {candidate.documents.filter(d => d.status === "verified").length} of {candidate.documents.length} documents verified
                        </span>
                      </div>
                      
                      <button
                        onClick={() => setSelectedCandidate(candidate)}
                        className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center p-8">
                <p className="text-gray-500 dark:text-gray-400">No candidates found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Modal to add new document */}
      {showAddDocumentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Document</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Document Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter document name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Document Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newDocumentType}
                  onChange={(e) => setNewDocumentType(e.target.value)}
                  aria-label="Document type"
                  title="Select a document type"
                  id="document-type-select"
                >
                  <option value="">Select a document type</option>
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Upload File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF, DOC, DOCX, JPG or PNG up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddDocumentModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle adding document logic here
                  setShowAddDocumentModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Add Document
              </button>
            </div>
          </div>
        </div>
      )}
    </ModulePage>
  );
};

export default PreBoarding;
