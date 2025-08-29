
import React, { useState } from "react";
import { Users, Calendar, Clock, MapPin, Check, Info, User, ChevronRight, Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import ModulePage from "../../components/ModulePage";
import { motion } from "framer-motion";

interface SessionAttendee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  status: "confirmed" | "pending" | "declined";
}

interface OrientationSession {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  facilitator: string;
  status: "scheduled" | "completed" | "cancelled";
  attendees: SessionAttendee[];
  materials?: string[];
}

const CandidateApproach: React.FC = () => {
  // Sample orientation session data
  const [sessions, setSessions] = useState<OrientationSession[]>([
    {
      id: "s1",
      title: "Company Overview & Culture",
      description: "Introduction to company history, vision, mission, values, and culture. Meet key leaders and understand organizational structure.",
      date: "2023-09-15",
      startTime: "09:00",
      endTime: "11:00",
      location: "Main Conference Room",
      facilitator: "Emily Johnson, HR Director",
      status: "scheduled",
      attendees: [
        { id: "a1", name: "David Wilson", email: "david.w@example.com", position: "Frontend Developer", department: "Engineering", status: "confirmed" },
        { id: "a2", name: "Jessica Martinez", email: "jessica.m@example.com", position: "Product Manager", department: "Product", status: "confirmed" },
        { id: "a3", name: "Michael Chen", email: "michael.c@example.com", position: "UX Designer", department: "Design", status: "pending" },
      ],
      materials: ["Company Handbook.pdf", "Organizational Chart.pdf"]
    },
    {
      id: "s2",
      title: "HR Policies & Benefits",
      description: "Detailed overview of HR policies, employee benefits, leave policies, and compliance requirements.",
      date: "2023-09-16",
      startTime: "10:00",
      endTime: "12:00",
      location: "Training Room B",
      facilitator: "Sarah Parker, HR Manager",
      status: "scheduled",
      attendees: [
        { id: "a1", name: "David Wilson", email: "david.w@example.com", position: "Frontend Developer", department: "Engineering", status: "confirmed" },
        { id: "a2", name: "Jessica Martinez", email: "jessica.m@example.com", position: "Product Manager", department: "Product", status: "pending" },
        { id: "a4", name: "Robert Chang", email: "robert.c@example.com", position: "Backend Developer", department: "Engineering", status: "confirmed" },
      ],
      materials: ["Benefits Guide.pdf", "Employee Handbook.pdf"]
    },
    {
      id: "s3",
      title: "IT Systems & Security",
      description: "Introduction to company systems, security protocols, and IT policies. Setup of accounts and access permissions.",
      date: "2023-09-17",
      startTime: "14:00",
      endTime: "16:00",
      location: "IT Training Lab",
      facilitator: "Alex Rivera, IT Manager",
      status: "scheduled",
      attendees: [
        { id: "a1", name: "David Wilson", email: "david.w@example.com", position: "Frontend Developer", department: "Engineering", status: "confirmed" },
        { id: "a3", name: "Michael Chen", email: "michael.c@example.com", position: "UX Designer", department: "Design", status: "confirmed" },
        { id: "a4", name: "Robert Chang", email: "robert.c@example.com", position: "Backend Developer", department: "Engineering", status: "declined" },
      ],
      materials: ["IT Security Guidelines.pdf", "Systems Access Guide.pdf"]
    },
    {
      id: "s4",
      title: "Team Introduction & Department Overview",
      description: "Meet your team members and understand your department's goals, projects, and workflows.",
      date: "2023-08-25",
      startTime: "11:00",
      endTime: "13:00",
      location: "Department Meeting Rooms",
      facilitator: "Department Managers",
      status: "completed",
      attendees: [
        { id: "a5", name: "Lisa Johnson", email: "lisa.j@example.com", position: "Marketing Specialist", department: "Marketing", status: "confirmed" },
        { id: "a6", name: "James Smith", email: "james.s@example.com", position: "Sales Representative", department: "Sales", status: "confirmed" },
      ],
      materials: ["Department Guidelines.pdf"]
    }
  ]);

  const [selectedSession, setSelectedSession] = useState<OrientationSession | null>(null);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sessionFormData, setSessionFormData] = useState<Partial<OrientationSession>>({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    facilitator: "",
    attendees: []
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "scheduled" | "completed" | "cancelled">("all");

  // Filter sessions based on search and status filter
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.facilitator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = 
      filter === "all" || session.status === filter;
      
    return matchesSearch && matchesFilter;
  });

  // Calculate upcoming sessions (for today and future dates)
  const today = new Date().toISOString().split('T')[0];
  const upcomingSessions = sessions
    .filter(session => session.date >= today && session.status === "scheduled")
    .sort((a, b) => a.date.localeCompare(b.date));

  // Handle session selection
  const handleSelectSession = (session: OrientationSession) => {
    setSelectedSession(session);
  };

  // Handle create/edit session form submission
  const handleSubmitSessionForm = () => {
    if (!sessionFormData.title || !sessionFormData.date || !sessionFormData.startTime || !sessionFormData.endTime) {
      alert("Please fill in all required fields");
      return;
    }

    if (isEditing && selectedSession) {
      // Update existing session
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === selectedSession.id 
            ? { ...session, ...sessionFormData as OrientationSession } 
            : session
        )
      );
      alert("Session updated successfully");
    } else {
      // Create new session
      const newSession: OrientationSession = {
        id: `s${sessions.length + 1}`,
        ...sessionFormData as any,
        status: "scheduled",
        attendees: sessionFormData.attendees || []
      };
      
      setSessions(prevSessions => [...prevSessions, newSession]);
      alert("New session created successfully");
    }
    
    setShowSessionForm(false);
    setSessionFormData({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      facilitator: "",
      attendees: []
    });
    setIsEditing(false);
  };

  // Handle edit session
  const handleEditSession = () => {
    if (!selectedSession) return;
    
    setSessionFormData({
      title: selectedSession.title,
      description: selectedSession.description,
      date: selectedSession.date,
      startTime: selectedSession.startTime,
      endTime: selectedSession.endTime,
      location: selectedSession.location,
      facilitator: selectedSession.facilitator,
      attendees: [...selectedSession.attendees],
      materials: selectedSession.materials
    });
    
    setIsEditing(true);
    setShowSessionForm(true);
  };

  // Handle delete session
  const handleDeleteSession = () => {
    if (!selectedSession) return;
    
    if (confirm(`Are you sure you want to delete the session "${selectedSession.title}"?`)) {
      setSessions(prevSessions => prevSessions.filter(session => session.id !== selectedSession.id));
      setSelectedSession(null);
      alert("Session deleted successfully");
    }
  };

  // Handle adding a new session
  const handleAddSession = () => {
    setSessionFormData({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      facilitator: "",
      attendees: []
    });
    setIsEditing(false);
    setShowSessionForm(true);
  };

  // Handle session status change
  const handleChangeSessionStatus = (newStatus: "scheduled" | "completed" | "cancelled") => {
    if (!selectedSession) return;
    
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === selectedSession.id 
          ? { ...session, status: newStatus } 
          : session
      )
    );
    
    setSelectedSession(prev => prev ? { ...prev, status: newStatus } : null);
    
    alert(`Session marked as ${newStatus}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <ModulePage
      title="Candidate Approach"
      description="Plan and manage orientation programs for new employees"
      icon={Users}
      comingSoon={false}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upcoming sessions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Sessions</h2>
              
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.slice(0, 3).map((session) => (
                    <div 
                      key={session.id}
                      className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
                    >
                      <h3 className="font-medium text-blue-800 dark:text-blue-300">{session.title}</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{formatDate(session.date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{session.startTime} - {session.endTime}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{session.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {upcomingSessions.length > 3 && (
                    <p className="text-sm text-center text-blue-600 dark:text-blue-400">
                      +{upcomingSessions.length - 3} more upcoming sessions
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming sessions scheduled</p>
              )}
              
              <button
                onClick={handleAddSession}
                className="mt-4 flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span>Add New Session</span>
              </button>
            </div>
            
            {/* Session search and filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search sessions..."
                    className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                <div>
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filter by Status
                  </label>
                  <div className="relative">
                    <select
                      id="status-filter"
                      className="w-full p-2 pl-10 appearance-none border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as any)}
                    >
                      <option value="all">All Sessions</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {/* Session list */}
              <div className="mt-6 space-y-2 max-h-[400px] overflow-y-auto">
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleSelectSession(session)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedSession?.id === session.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{session.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(session.date)}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium
                          ${session.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                          ${session.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                          ${session.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                        `}>
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <User className="w-3 h-3 mr-1" />
                        <span>{session.attendees.length} attendees</span>
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No sessions found matching your search
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-2">
            {selectedSession ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedSession.title}</h2>
                    <div className="flex items-center mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${selectedSession.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${selectedSession.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${selectedSession.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                      `}>
                        {selectedSession.status.charAt(0).toUpperCase() + selectedSession.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleEditSession}
                      className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      aria-label="Edit session"
                      title="Edit session"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleDeleteSession}
                      className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      aria-label="Delete session"
                      title="Delete session"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                  <p className="text-gray-700 dark:text-gray-300">{selectedSession.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Session Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(selectedSession.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSession.startTime} - {selectedSession.endTime}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSession.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Facilitator</h3>
                    <div className="flex items-center">
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2 mr-3">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedSession.facilitator}</p>
                      </div>
                    </div>
                    
                    {selectedSession.materials && selectedSession.materials.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Materials</h4>
                        <div className="space-y-2">
                          {selectedSession.materials.map((material, index) => (
                            <div key={index} className="flex items-center">
                              <Info className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                              <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                {material}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Attendees ({selectedSession.attendees.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Position</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {selectedSession.attendees.map((attendee) => (
                          <tr key={attendee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{attendee.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{attendee.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">{attendee.position}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">{attendee.department}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                ${attendee.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                                ${attendee.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                                ${attendee.status === 'declined' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                              `}>
                                {attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {selectedSession.status === "scheduled" && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleChangeSessionStatus("completed")}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      <span>Mark as Completed</span>
                    </button>
                    <button
                      onClick={() => handleChangeSessionStatus("cancelled")}
                      className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      <span>Cancel Session</span>
                    </button>
                  </div>
                )}
                
                {selectedSession.status === "cancelled" && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleChangeSessionStatus("scheduled")}
                      className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Reschedule Session</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-10 shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center min-h-[400px]">
                <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Session Selected</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Select a session from the list to view details or create a new orientation session
                </p>
                <button
                  onClick={handleAddSession}
                  className="mt-6 flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span>Create New Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session form modal */}
      {showSessionForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowSessionForm(false)}></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-2xl p-6 mx-auto my-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
            >
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                {isEditing ? "Edit Orientation Session" : "Create New Orientation Session"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Session Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g. Company Overview & Culture"
                    value={sessionFormData.title || ""}
                    onChange={(e) => setSessionFormData({...sessionFormData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Detailed description of the orientation session"
                    value={sessionFormData.description || ""}
                    onChange={(e) => setSessionFormData({...sessionFormData, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date*
                  </label>
                  <input
                    type="date"
                    id="date"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={sessionFormData.date || ""}
                    onChange={(e) => setSessionFormData({...sessionFormData, date: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Start Time*
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={sessionFormData.startTime || ""}
                      onChange={(e) => setSessionFormData({...sessionFormData, startTime: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      End Time*
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={sessionFormData.endTime || ""}
                      onChange={(e) => setSessionFormData({...sessionFormData, endTime: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g. Main Conference Room"
                    value={sessionFormData.location || ""}
                    onChange={(e) => setSessionFormData({...sessionFormData, location: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="facilitator" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Facilitator
                  </label>
                  <input
                    type="text"
                    id="facilitator"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g. John Doe, HR Manager"
                    value={sessionFormData.facilitator || ""}
                    onChange={(e) => setSessionFormData({...sessionFormData, facilitator: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSessionForm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitSessionForm}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {isEditing ? "Update Session" : "Create Session"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </ModulePage>
  );
};

export default CandidateApproach;
