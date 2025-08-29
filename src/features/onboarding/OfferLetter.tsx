import React, { useState } from "react";
import { FileText, Search, Plus, Mail, Copy, Eye, Download, Edit, Trash2, CheckCircle, XCircle, Save, ArrowRight, ExternalLink, FileDown, Pencil, List } from "lucide-react";
import ModulePage from "../../components/ModulePage";
import { motion } from "framer-motion";

interface OfferTemplate {
  id: string;
  name: string;
  position: string;
  department: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  status: "draft" | "sent" | "accepted" | "rejected" | "negotiating";
  salary?: string;
  joinDate?: string;
  templateId?: string;
  sentAt?: string;
  respondedAt?: string;
}

const OfferLetter: React.FC = () => {
  const [templates, setTemplates] = useState<OfferTemplate[]>([
    {
      id: "t1",
      name: "Standard Software Developer",
      position: "Software Developer",
      department: "Engineering",
      content: `
Dear {{candidateName}},

We are pleased to offer you the position of {{position}} at XYZ Corporation. This letter confirms our offer with the following terms:

Position: {{position}}
Department: {{department}}
Reporting to: {{manager}}
Start Date: {{startDate}}
Compensation: {{salary}} per annum

Benefits:
- Health insurance coverage starting after 30 days of employment
- 401(k) retirement plan with company matching up to 4%
- 15 days of paid time off per year
- Flexible working hours

Your employment with XYZ Corporation will be at-will, which means you or the company may terminate the employment relationship at any time.

To accept this offer, please sign and return this letter by {{responseDeadline}}. 

We look forward to welcoming you to the team!

Sincerely,
HR Department
XYZ Corporation
      `,
      createdAt: "2025-06-15T10:00:00",
      updatedAt: "2025-07-20T14:30:00"
    },
    {
      id: "t2",
      name: "Senior Management",
      position: "Senior Manager",
      department: "Management",
      content: `
Dear {{candidateName}},

We are delighted to offer you the position of {{position}} at XYZ Corporation. Following our recent discussions, we are pleased to confirm the details of our offer:

Position: {{position}}
Department: {{department}}
Reporting to: {{manager}}
Start Date: {{startDate}}
Compensation: {{salary}} per annum

Additional Benefits:
- Comprehensive health, dental, and vision insurance from day one
- 401(k) retirement plan with company matching up to 6%
- 25 days of paid time off per year
- Company car allowance of $750 per month
- Annual performance bonus of up to 20% of your base salary
- Stock options as outlined in our equity incentive plan
- Executive leadership development program

This role includes oversight of a team of {{teamSize}} members and a budget responsibility of approximately {{budget}}.

Your employment with XYZ Corporation will be at-will, which means you or the company may terminate the employment relationship at any time.

To accept this offer, please sign and return this letter by {{responseDeadline}}.

We are excited about the prospect of you joining our leadership team and believe your experience will be invaluable to our continued growth.

Sincerely,
Executive Team
XYZ Corporation
      `,
      createdAt: "2025-06-20T11:00:00",
      updatedAt: "2025-07-25T16:30:00"
    },
    {
      id: "t3",
      name: "Entry Level Marketing",
      position: "Marketing Associate",
      department: "Marketing",
      content: `
Dear {{candidateName}},

We are excited to offer you the position of {{position}} at XYZ Corporation. This letter outlines the terms of our offer:

Position: {{position}}
Department: {{department}}
Reporting to: {{manager}}
Start Date: {{startDate}}
Compensation: {{salary}} per annum

Benefits:
- Health insurance with coverage starting after 60 days
- 401(k) eligibility after 6 months of employment
- 12 days of paid time off per year
- Professional development allowance of $1,000 annually
- Flexible working arrangements with 2 remote days per week

Your primary responsibilities will include supporting our marketing campaigns, social media management, and assisting with market research.

Your employment with XYZ Corporation will be at-will, which means you or the company may terminate the employment relationship at any time.

To accept this offer, please sign and return this letter by {{responseDeadline}}.

We believe your fresh perspective and energy will be a valuable addition to our marketing team!

Sincerely,
HR Department
XYZ Corporation
      `,
      createdAt: "2025-07-05T09:15:00",
      updatedAt: "2025-07-30T13:45:00"
    }
  ]);
  
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "c1",
      name: "David Wilson",
      email: "david.wilson@example.com",
      position: "Software Developer",
      department: "Engineering",
      status: "draft",
      salary: "$95,000",
      joinDate: "2025-10-01"
    },
    {
      id: "c2",
      name: "Jessica Martinez",
      email: "jessica.m@example.com",
      position: "Senior Product Manager",
      department: "Product",
      status: "sent",
      salary: "$120,000",
      joinDate: "2025-09-15",
      templateId: "t2",
      sentAt: "2025-08-20T14:30:00"
    },
    {
      id: "c3",
      name: "Michael Brown",
      email: "michael.b@example.com",
      position: "Marketing Associate",
      department: "Marketing",
      status: "accepted",
      salary: "$65,000",
      joinDate: "2025-09-10",
      templateId: "t3",
      sentAt: "2025-08-15T10:45:00",
      respondedAt: "2025-08-18T09:20:00"
    },
    {
      id: "c4",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      position: "UX Designer",
      department: "Design",
      status: "negotiating",
      salary: "$85,000",
      joinDate: "2025-10-15",
      templateId: "t1",
      sentAt: "2025-08-18T16:20:00",
      respondedAt: "2025-08-21T11:10:00"
    }
  ]);
  
  const [activeTab, setActiveTab] = useState<"candidates" | "templates">("candidates");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<OfferTemplate | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<OfferTemplate>>({
    name: "",
    position: "",
    department: "",
    content: ""
  });
  
  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: Candidate["status"]) => {
    switch (status) {
      case "draft":
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            Draft
          </span>
        );
      case "sent":
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            Sent
          </span>
        );
      case "accepted":
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
            Rejected
          </span>
        );
      case "negotiating":
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
            Negotiating
          </span>
        );
    }
  };
  
  const handleSaveTemplate = () => {
    if (selectedTemplate && editMode) {
      setTemplates(templates.map(template => 
        template.id === selectedTemplate.id
          ? { ...template, content: editContent, updatedAt: new Date().toISOString() }
          : template
      ));
      setSelectedTemplate({
        ...selectedTemplate,
        content: editContent,
        updatedAt: new Date().toISOString()
      });
      setEditMode(false);
    }
  };
  
  const handleCreateNewTemplate = () => {
    const newTemplateId = `t${templates.length + 1}`;
    const createdTemplate = {
      id: newTemplateId,
      name: newTemplate.name || "Untitled Template",
      position: newTemplate.position || "",
      department: newTemplate.department || "",
      content: newTemplate.content || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTemplates([...templates, createdTemplate]);
    setShowNewTemplateModal(false);
    setNewTemplate({
      name: "",
      position: "",
      department: "",
      content: ""
    });
  };
  
  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    if (candidate.templateId) {
      const template = templates.find(t => t.id === candidate.templateId);
      if (template) {
        setSelectedTemplate(template);
        setEditContent(template.content);
      }
    } else {
      // Select a default template based on position or department
      const matchingTemplate = templates.find(
        t => t.position === candidate.position || t.department === candidate.department
      );
      if (matchingTemplate) {
        setSelectedTemplate(matchingTemplate);
        setEditContent(matchingTemplate.content);
      } else if (templates.length > 0) {
        setSelectedTemplate(templates[0]);
        setEditContent(templates[0].content);
      }
    }
  };
  
  const handleSendOffer = (candidateId: string) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === candidateId
        ? { 
            ...candidate, 
            status: "sent", 
            sentAt: new Date().toISOString(),
            templateId: selectedTemplate?.id
          }
        : candidate
    ));
    alert(`Offer letter sent to ${selectedCandidate?.name}`);
    setSelectedCandidate(null);
    setSelectedTemplate(null);
    setEditContent("");
  };
  
  // Function to replace template variables with actual values
  const renderPreview = (template: string, candidate: Candidate) => {
    let preview = template
      .replace(/{{candidateName}}/g, candidate.name)
      .replace(/{{position}}/g, candidate.position)
      .replace(/{{department}}/g, candidate.department)
      .replace(/{{salary}}/g, candidate.salary || "")
      .replace(/{{startDate}}/g, candidate.joinDate || "")
      .replace(/{{manager}}/g, "Department Manager") // Placeholder
      .replace(/{{responseDeadline}}/g, "One week from receipt")
      .replace(/{{teamSize}}/g, "5-10") // Placeholder
      .replace(/{{budget}}/g, "$500,000"); // Placeholder
      
    return preview;
  };

  return (
    <ModulePage
      title="Offer Letter Management"
      description="Create, send, and track offer letters for new hires"
      icon={FileText}
      comingSoon={false}
    >
      <div className="space-y-6">
        {/* Tab navigation */}
        <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
              activeTab === "candidates"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("candidates")}
          >
            Candidates
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
              activeTab === "templates"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("templates")}
          >
            Templates
          </button>
        </div>
        
        {/* Search bar */}
        <div className="flex items-center justify-between">
          <div className="relative w-64">
            <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="bg-transparent border-none focus:outline-none flex-1 text-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {activeTab === "templates" && (
            <button
              onClick={() => setShowNewTemplateModal(true)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </button>
          )}
        </div>
        
        {/* Main content area */}
        {selectedCandidate ? (
          // Offer letter editing view
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => {
                  setSelectedCandidate(null);
                  setSelectedTemplate(null);
                  setEditContent("");
                  setEditMode(false);
                }}
                className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to {activeTab}
              </button>
              
              <div className="flex items-center space-x-3">
                {editMode ? (
                  <>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveTemplate}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Template
                    </button>
                    <button
                      onClick={() => handleSendOffer(selectedCandidate.id)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Offer
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Candidate details */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 h-full">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Candidate Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedCandidate.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedCandidate.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Position</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedCandidate.position}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedCandidate.department}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Offered Salary</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedCandidate.salary || "Not specified"}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedCandidate.joinDate || "Not specified"}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <div>{getStatusBadge(selectedCandidate.status)}</div>
                    </div>
                    
                    {selectedCandidate.sentAt && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Last Sent</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(selectedCandidate.sentAt).toLocaleDateString()} at {new Date(selectedCandidate.sentAt).toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                    
                    {selectedCandidate.respondedAt && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Response Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(selectedCandidate.respondedAt).toLocaleDateString()} at {new Date(selectedCandidate.respondedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Template</h4>
                    {selectedTemplate ? (
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="font-medium text-gray-900 dark:text-white">{selectedTemplate.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Last updated: {new Date(selectedTemplate.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No template selected</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Offer letter preview/editor */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {editMode ? "Edit Offer Letter Template" : "Offer Letter Preview"}
                  </h3>
                  
                  {editMode ? (
                    <textarea
                      className="w-full h-[500px] p-4 font-mono text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                  ) : (
                    <div className="w-full h-[500px] overflow-y-auto p-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg">
                      <div className="prose dark:prose-invert max-w-none">
                        <div className="whitespace-pre-line">
                          {selectedTemplate && renderPreview(selectedTemplate.content, selectedCandidate)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!editMode && (
                    <div className="mt-4 flex justify-end space-x-3">
                      <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        <Download className="w-4 h-4 mr-1" />
                        Download PDF
                      </button>
                      <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Link
                      </button>
                      <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview as Recipient
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "candidates" ? (
          // Candidates list view
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <tr 
                      key={candidate.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 ease-in-out"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{candidate.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{candidate.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{candidate.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{candidate.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(candidate.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {candidate.joinDate || "Not specified"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleCandidateSelect(candidate)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {candidate.status === "draft" ? "Create Offer" : "View/Edit"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No candidates found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          // Templates list view
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{template.position} • {template.department}</p>
                    
                    <div className="mt-4 h-24 overflow-hidden relative">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4">{template.content}</p>
                      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white dark:from-gray-800"></div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Last updated: {new Date(template.updatedAt).toLocaleDateString()}
                        </span>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedTemplate(template);
                              setEditContent(template.content);
                              setEditMode(true);
                            }}
                            className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            title="Edit template"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this template?")) {
                                setTemplates(templates.filter(t => t.id !== template.id));
                              }
                            }}
                            className="p-1 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                            title="Delete template"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTemplate(template);
                              setEditContent(template.content);
                              setEditMode(false);
                            }}
                            className="p-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                            title="Preview template"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center p-8">
                <p className="text-gray-500 dark:text-gray-400">No templates found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* New Template Modal */}
      {showNewTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Template</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Standard Developer Offer"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Software Developer"
                  value={newTemplate.position}
                  onChange={(e) => setNewTemplate({...newTemplate, position: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Engineering"
                  value={newTemplate.department}
                  onChange={(e) => setNewTemplate({...newTemplate, department: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Template Content
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Use placeholders like {"{candidateName}"}, {"{position}"}, {"{salary}"}, etc.
                </p>
                <textarea
                  className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter offer letter template content..."
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                ></textarea>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowNewTemplateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                disabled={!newTemplate.name || !newTemplate.content}
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </ModulePage>
  );
};

export default OfferLetter;
