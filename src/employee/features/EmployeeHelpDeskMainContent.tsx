import React, { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  MoreVertical,
  Plus,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  assignee?: string;
  requester: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

const EmployeeHelpDeskMainContent: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  // Sample tickets data
  const tickets: Ticket[] = [
    {
      id: "HD-001",
      title: "Unable to access payroll system",
      description:
        "Employee cannot log into the payroll portal to view pay stubs",
      status: "open",
      priority: "high",
      category: "System Access",
      requester: "John Smith",
      assignee: "IT Support",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      tags: ["payroll", "access", "urgent"],
    },
    {
      id: "HD-002",
      title: "Request for new employee laptop",
      description: "New hire needs laptop setup for remote work",
      status: "in-progress",
      priority: "medium",
      category: "Hardware Request",
      requester: "Sarah Johnson",
      assignee: "Hardware Team",
      createdAt: "2024-01-14T14:20:00Z",
      updatedAt: "2024-01-15T09:15:00Z",
      tags: ["hardware", "laptop", "new-hire"],
    },
    {
      id: "HD-003",
      title: "Password reset for HR system",
      description: "Manager needs password reset for HR management portal",
      status: "resolved",
      priority: "low",
      category: "Account Management",
      requester: "Mike Chen",
      assignee: "Security Team",
      createdAt: "2024-01-13T16:45:00Z",
      updatedAt: "2024-01-14T11:30:00Z",
      tags: ["password", "reset", "hr-system"],
    },
    {
      id: "HD-004",
      title: "Software installation request",
      description: "Need Adobe Creative Suite installed for design work",
      status: "open",
      priority: "medium",
      category: "Software Request",
      requester: "Emily Davis",
      createdAt: "2024-01-15T08:15:00Z",
      updatedAt: "2024-01-15T08:15:00Z",
      tags: ["software", "adobe", "design"],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "closed":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.requester.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || ticket.status === selectedStatus;
    const matchesPriority =
      selectedPriority === "all" || ticket.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => navigate("/emp-home")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Help Desk
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage support tickets and requests
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/emp-home/help-desk/create-ticket")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Ticket</span>
          </button>
        </div>
      </header>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ticket
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Assignee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTickets.map((ticket, index) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => navigate(`/emp-home/help-desk/ticket/${ticket.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {ticket.id}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                                ticket.priority
                              )}`}
                            >
                              {ticket.priority}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                            {ticket.title}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {ticket.description.substring(0, 60)}...
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {ticket.requester}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(ticket.status)}
                          <span className="text-sm text-gray-900 dark:text-white capitalize">
                            {ticket.status.replace("-", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {ticket.assignee || "Unassigned"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(ticket.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle actions menu
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeHelpDeskMainContent;
