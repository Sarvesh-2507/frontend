import React, { useState } from "react";
import { CheckCircle, FileText, Upload, Download, Search, Clock, CheckSquare, User, Calendar, Eye, Trash2, Edit, Plus } from "lucide-react";
import ModulePage from "../../components/ModulePage";
import { motion } from "framer-motion";
import AccessibleProgressBar from "../../components/ui/AccessibleProgressBar";

interface FormDocument {
  id: string;
  name: string;
  status: "pending" | "submitted" | "verified" | "rejected";
  dateSubmitted?: string;
  dateVerified?: string;
  requiredFor: string[];
  notes?: string;
}

interface JoineeProfile {
  id: string;
  name: string;
  position: string;
  department: string;
  joiningDate: string;
  email: string;
  phone: string;
  formStatus: "incomplete" | "in-progress" | "complete";
  progress: number;
  documents: FormDocument[];
}

const JoiningFormalities: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [selectedJoinee, setSelectedJoinee] = useState<JoineeProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDocName, setNewDocName] = useState("");

  // Mock data for joining formalities
  const mockJoinees: JoineeProfile[] = [
    {
      id: "j1",
      name: "Emma Thompson",
      position: "Senior Developer",
      department: "Engineering",
      joiningDate: "2023-09-15",
      email: "emma.t@company.com",
      phone: "+1 (555) 234-5678",
      formStatus: "in-progress",
      progress: 60,
      documents: [
        { 
          id: "d1", 
          name: "ID Proof", 
          status: "verified", 
          dateSubmitted: "2023-08-25",
          dateVerified: "2023-08-28",
          requiredFor: ["all"]
        },
        { 
          id: "d2", 
          name: "Address Proof", 
          status: "submitted", 
          dateSubmitted: "2023-08-27",
          requiredFor: ["all"]
        },
        { 
          id: "d3", 
          name: "Previous Employment Certificate", 
          status: "pending", 
          requiredFor: ["experienced"]
        },
        { 
          id: "d4", 
          name: "Education Certificates", 
          status: "verified", 
          dateSubmitted: "2023-08-26",
          dateVerified: "2023-08-28",
          requiredFor: ["all"]
        },
        { 
          id: "d5", 
          name: "Bank Account Details", 
          status: "pending", 
          requiredFor: ["all"]
        }
      ]
    },
    {
      id: "j2",
      name: "Michael Chen",
      position: "UI/UX Designer",
      department: "Design",
      joiningDate: "2023-09-20",
      email: "michael.c@company.com",
      phone: "+1 (555) 345-6789",
      formStatus: "incomplete",
      progress: 30,
      documents: [
        { 
          id: "d1", 
          name: "ID Proof", 
          status: "submitted", 
          dateSubmitted: "2023-08-28",
          requiredFor: ["all"]
        },
        { 
          id: "d2", 
          name: "Address Proof", 
          status: "pending", 
          requiredFor: ["all"]
        },
        { 
          id: "d3", 
          name: "Previous Employment Certificate", 
          status: "pending", 
          requiredFor: ["experienced"]
        },
        { 
          id: "d4", 
          name: "Education Certificates", 
          status: "pending", 
          requiredFor: ["all"]
        },
        { 
          id: "d5", 
          name: "Bank Account Details", 
          status: "pending", 
          requiredFor: ["all"]
        }
      ]
    },
    {
      id: "j3",
      name: "Sarah Johnson",
      position: "HR Specialist",
      department: "Human Resources",
      joiningDate: "2023-08-30",
      email: "sarah.j@company.com",
      phone: "+1 (555) 456-7890",
      formStatus: "complete",
      progress: 100,
      documents: [
        { 
          id: "d1", 
          name: "ID Proof", 
          status: "verified", 
          dateSubmitted: "2023-08-15",
          dateVerified: "2023-08-16",
          requiredFor: ["all"]
        },
        { 
          id: "d2", 
          name: "Address Proof", 
          status: "verified", 
          dateSubmitted: "2023-08-15",
          dateVerified: "2023-08-17",
          requiredFor: ["all"]
        },
        { 
          id: "d3", 
          name: "Previous Employment Certificate", 
          status: "verified", 
          dateSubmitted: "2023-08-16",
          dateVerified: "2023-08-18",
          requiredFor: ["experienced"]
        },
        { 
          id: "d4", 
          name: "Education Certificates", 
          status: "verified", 
          dateSubmitted: "2023-08-15",
          dateVerified: "2023-08-17",
          requiredFor: ["all"]
        },
        { 
          id: "d5", 
          name: "Bank Account Details", 
          status: "verified", 
          dateSubmitted: "2023-08-18",
          dateVerified: "2023-08-19",
          requiredFor: ["all"]
        }
      ]
    }
  ];

  // Filter joiners based on active tab and search query
  const filteredJoinees = mockJoinees.filter(joinee => {
    const matchesTab = 
      (activeTab === "pending" && joinee.formStatus !== "complete") ||
      (activeTab === "completed" && joinee.formStatus === "complete");
    
    const matchesSearch = 
      joinee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      joinee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      joinee.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const handleDocumentAction = (docId: string, action: "approve" | "reject" | "delete") => {
    if (!selectedJoinee) return;

    // Update the document status based on action
    // This would be replaced with API calls in a real application
    console.log(`Document ${docId} ${action}ed`);
    
    // For demo purposes, just show what would happen
    alert(`Document ${docId} has been ${action}ed successfully!`);
  };

  const handleAddDocument = () => {
    if (!newDocName.trim() || !selectedJoinee) {
      alert("Please enter a valid document name");
      return;
    }

    // In a real app, this would make an API call to add the document
    console.log(`New document "${newDocName}" added for ${selectedJoinee.name}`);
    alert(`Document "${newDocName}" has been added successfully!`);
    
    setNewDocName("");
    setShowAddModal(false);
  };

  // UI for detailed view of a joinee
  const renderJoineeDetail = () => {
    if (!selectedJoinee) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 space-y-6"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedJoinee.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">{selectedJoinee.position} • {selectedJoinee.department}</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
            Joining: {new Date(selectedJoinee.joiningDate).toLocaleDateString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Contact Information</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-800 dark:text-gray-200"><span className="font-medium">Email:</span> {selectedJoinee.email}</p>
              <p className="text-sm text-gray-800 dark:text-gray-200"><span className="font-medium">Phone:</span> {selectedJoinee.phone}</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckSquare className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Documentation Progress</p>
            </div>
            <div className="relative pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {selectedJoinee.progress}% Complete
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {selectedJoinee.documents.filter(d => d.status === "verified").length}/{selectedJoinee.documents.length} Verified
                  </span>
                </div>
              </div>
              <div className="mt-1">
                <AccessibleProgressBar 
                  value={selectedJoinee.progress} 
                  label="Documentation progress"
                  colorClassName="bg-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Required Documents</h3>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Document</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Document</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submitted</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Verified</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {selectedJoinee.documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{doc.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${doc.status === 'verified' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                      ${doc.status === 'submitted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                      ${doc.status === 'pending' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : ''}
                      ${doc.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                    `}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {doc.dateSubmitted ? new Date(doc.dateSubmitted).toLocaleDateString() : "Not submitted"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {doc.dateVerified ? new Date(doc.dateVerified).toLocaleDateString() : "Not verified"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button 
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" 
                        onClick={() => alert(`View document: ${doc.name}`)}
                        title={`View ${doc.name}`}
                        aria-label={`View ${doc.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {doc.status === 'submitted' && (
                        <>
                          <button 
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300" 
                            onClick={() => handleDocumentAction(doc.id, "approve")}
                            title={`Approve ${doc.name}`}
                            aria-label={`Approve ${doc.name}`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" 
                            onClick={() => handleDocumentAction(doc.id, "reject")}
                            title={`Reject ${doc.name}`}
                            aria-label={`Reject ${doc.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {doc.status === 'pending' && (
                        <button 
                          className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300" 
                          onClick={() => alert(`Send reminder for: ${doc.name}`)}
                          title={`Send reminder for ${doc.name}`}
                          aria-label={`Send reminder for ${doc.name}`}
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex space-x-4 mt-4">
          <button 
            onClick={() => alert("Email sent to candidate with document submission instructions.")}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Send Submission Request</span>
          </button>
          <button 
            onClick={() => alert("Generated onboarding checklist PDF for download.")}
            className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Checklist</span>
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <ModulePage
      title="Joining Formalities"
      description="Track and manage document submission and verification for new hires"
      icon={CheckCircle}
      comingSoon={false}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 space-y-6">
              {/* Search and filters */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Tabs */}
              <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`py-2 font-medium border-b-2 transition-colors ${
                    activeTab === "pending"
                      ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Pending ({mockJoinees.filter(j => j.formStatus !== "complete").length})
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`py-2 font-medium border-b-2 transition-colors ${
                    activeTab === "completed"
                      ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Completed ({mockJoinees.filter(j => j.formStatus === "complete").length})
                </button>
              </div>

              {/* Joinee list */}
              <div className="space-y-3 mt-4 max-h-[500px] overflow-y-auto">
                {filteredJoinees.length > 0 ? (
                  filteredJoinees.map((joinee) => (
                    <motion.div
                      key={joinee.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedJoinee(joinee)}
                      className={`cursor-pointer p-4 rounded-lg border transition-colors ${
                        selectedJoinee?.id === joinee.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{joinee.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{joinee.position}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end space-x-1 mb-1">
                            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(joinee.joiningDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="relative pt-1">
                            <AccessibleProgressBar 
                              value={joinee.progress}
                              label={`Progress for ${joinee.name}`}
                              height="h-1.5"
                              colorClassName={
                                joinee.progress === 100
                                  ? "bg-green-500"
                                  : joinee.progress > 60
                                  ? "bg-blue-500"
                                  : "bg-yellow-500"
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">No candidates found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedJoinee ? (
              renderJoineeDetail()
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-10 shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center min-h-[400px]">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Candidate Selected</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Select a candidate from the list to view and manage their joining formalities
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Document</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="docName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Document Name
                </label>
                <input
                  type="text"
                  id="docName"
                  placeholder="Enter document name"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDocument}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Add Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModulePage>
  );
};

export default JoiningFormalities;
