import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageSquare,
  Calendar,
  User,
  FileText,
  AlertCircle,
  Download,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../../services/api";
import { apiService } from "../../services/leaveApi";
import Sidebar from "../../components/Sidebar";

interface Employee {
  id: number;
  email: string;
  full_name: string;
  access_level: string;
  department?: string;
}

interface LeaveRequest {
  id: number;
  employee: Employee;
  leave_type: string;
  leave_type_display: string;
  start_date: string;
  end_date: string;
  total_days: string;
  status: "PENDING" | "TL_APPROVED" | "APPROVED" | "REJECTED" | "CANCELLED";
  status_display: string;
  created_at: string;
  reason?: string;
  approved_by?: string;
  rejection_reason?: string | null;
}

interface HRDashboardResponse {
  status: string;
  message: string;
  total_count: number;
  pending_hr_approval: number;
  rejected_requests: number;
  requests: LeaveRequest[];
}

const LeaveApproval: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TL_APPROVED");

  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">(
    "approve"
  );
  const [approvalComments, setApprovalComments] = useState("");

  const navigate = useNavigate();

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "PENDING", label: "Pending" },
    { value: "TL_APPROVED", label: "Team Lead Approved - Pending HR" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
    { value: "CANCELLED", label: "Cancelled" },
  ];



  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [leaveRequests, searchTerm, statusFilter]);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      console.log("🔄 Fetching leave requests from HR dashboard API...");
      
      const response = await apiClient.get("/leave/leave-requests/hr_dashboard/");
      const data: HRDashboardResponse = response.data;
      
      console.log("✅ Leave requests fetched from hr_dashboard:", data);
      setLeaveRequests(Array.isArray(data.requests) ? data.requests : []);
      toast.success(`Loaded ${data.requests?.length || 0} leave requests`);
    } catch (error: any) {
      console.error("❌ Error fetching leave requests from hr_dashboard:", error);
      
      // For development/testing, provide fallback data
      if (process.env.NODE_ENV === 'development') {
        const fallbackData: LeaveRequest[] = [
          {
            id: 1,
            employee: {
              id: 1,
              email: "john.doe@company.com",
              full_name: "John Doe",
              access_level: "Employee",
              department: "Engineering"
            },
            leave_type: "SICK",
            leave_type_display: "Sick Leave",
            start_date: "2024-02-15",
            end_date: "2024-02-17",
            total_days: "3.0",
            status: "PENDING",
            status_display: "Pending HR Approval",
            created_at: "2024-02-10T10:30:00Z",
            reason: "Medical checkup",
            approved_by: "Team Lead"
          },
          {
            id: 2,
            employee: {
              id: 2,
              email: "jane.smith@company.com",
              full_name: "Jane Smith",
              access_level: "Employee",
              department: "Marketing"
            },
            leave_type: "CASUAL",
            leave_type_display: "Casual Leave",
            start_date: "2024-03-01",
            end_date: "2024-03-03",
            total_days: "3.0",
            status: "TL_APPROVED",
            status_display: "Team Lead Approved - Pending HR",
            created_at: "2024-02-25T14:20:00Z",
            reason: "Family emergency",
            approved_by: "Team Lead"
          }
        ];
        setLeaveRequests(fallbackData);
        toast.error("HR Dashboard API failed - Using sample data for testing");
      } else {
        toast.error("Failed to fetch leave requests from HR dashboard");
        setLeaveRequests([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = leaveRequests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.employee.full_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.employee.id.toString().includes(searchTerm.toLowerCase()) ||
          request.leave_type_display.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (request.reason && request.reason.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "TL_APPROVED":
        return "bg-blue-100 text-blue-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "TL_APPROVED":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "APPROVED":
        return <CheckCircle className="w-4 h-4" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4" />;
      case "CANCELLED":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };



  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleApprovalAction = (
    request: LeaveRequest,
    action: "approve" | "reject"
  ) => {
    setSelectedRequest(request);
    setApprovalAction(action);
    setApprovalComments("");
    setShowApprovalModal(true);
  };

  const submitApproval = async () => {
    if (!selectedRequest) return;

    setLoading(true);
    try {
      console.log(`🔄 ${approvalAction}ing leave request:`, selectedRequest.id);
      
      // Determine the correct endpoint and request body based on action
      const endpoint = approvalAction === "approve" 
        ? `/leave/leave-requests/${selectedRequest.id}/hr_approve/`
        : `/leave/leave-requests/${selectedRequest.id}/hr_reject/`;
      
      const requestBody = approvalAction === "approve"
        ? { status: "APPROVED" }
        : { 
            status: "REJECTED",
            rejection_reason: approvalComments || "No reason provided"
          };
      
      // Make the actual API call to approve/reject using PATCH
      const response = await apiClient.patch(endpoint, requestBody);

      console.log(`✅ Leave request ${approvalAction}ed successfully:`, response.data);

      // Update the request status in local state
      setLeaveRequests((prev) =>
        prev.map((request) =>
          request.id === selectedRequest.id
            ? {
                ...request,
                status: approvalAction === "approve" ? "APPROVED" : "REJECTED",
                ...(approvalAction === "reject" && { rejection_reason: approvalComments || "No reason provided" })
              }
            : request
        )
      );

      toast.success(
        `Leave request ${approvalAction === "approve" ? "approved" : "rejected"} successfully`
      );

      setShowApprovalModal(false);
      setSelectedRequest(null);
      setApprovalComments("");
    } catch (error: any) {
      console.error("❌ Error processing approval:", error);
      toast.error(`Failed to ${approvalAction} leave request. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = `Emp ID,Name,Department,Start Date,End Date,Total Days,Status,Approved By,Reason,Rejection Reason,Submitted At
${filteredRequests
  .map(
    (request) =>
      `${request.employee.id},"${request.employee.full_name}","${request.employee.department || 'N/A'}",${request.start_date},${request.end_date},${request.total_days},"${request.status_display || request.status}","${request.approved_by || 'N/A'}","${request.reason || 'N/A'}","${request.rejection_reason || 'N/A'}",${new Date(request.created_at).toLocaleDateString()}`
  )
  .join("\n")}`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hr_leave_requests.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const pendingCount = leaveRequests.filter(
    (r) => r.status === "TL_APPROVED"
  ).length;
  const approvedCount = leaveRequests.filter(
    (r) => r.status === "APPROVED"
  ).length;
  const rejectedCount = leaveRequests.filter(
    (r) => r.status === "REJECTED"
  ).length;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/leave")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Leave Approval
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Review and approve leave requests
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchLeaveRequests}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Pending Requests
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {pendingCount}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-500">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Approved
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {approvedCount}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Rejected
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {rejectedCount}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Search Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by employee name, ID, or leave type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("TL_APPROVED");
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Clear Filters</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Leave Requests ({filteredRequests.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Emp ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        End Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total Days
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Approved By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Rejection Reason
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Submitted At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : filteredRequests.length === 0 ? (
                      <tr>
                        <td
                          colSpan={11}
                          className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                        >
                          No leave requests found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((request) => (
                        <tr
                          key={request.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {request.employee.id}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {request.employee.full_name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {request.employee.department || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {new Date(request.start_date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {new Date(request.end_date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {request.total_days} days
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)}
                              <span>{request.status_display || request.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {request.approved_by || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                              {request.reason || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                              {request.status === "REJECTED" && request.rejection_reason ? request.rejection_reason : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {new Date(request.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewDetails(request)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {request.status === "TL_APPROVED" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleApprovalAction(request, "approve")
                                    }
                                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleApprovalAction(request, "reject")
                                    }
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                    title="Reject"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Leave Request Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Employee Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedRequest.employee.full_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Employee ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedRequest.employee.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Leave Type
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedRequest.leave_type_display}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Days
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedRequest.total_days}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Date
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(selectedRequest.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Date
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(selectedRequest.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Department
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedRequest.employee.department || 'N/A'}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reason
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedRequest.reason || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
              {selectedRequest.status === "TL_APPROVED" && (
                <>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleApprovalAction(selectedRequest, "reject");
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleApprovalAction(selectedRequest, "approve");
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {approvalAction === "approve" ? "Approve" : "Reject"} Leave
                Request
              </h3>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-900 dark:text-white">
                  <strong>Employee:</strong> {selectedRequest.employee.full_name}
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  <strong>Leave Type:</strong> {selectedRequest.leave_type_display}
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  <strong>Duration:</strong> {selectedRequest.total_days} day
                  {parseFloat(selectedRequest.total_days) > 1 ? "s" : ""}
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  <strong>Dates:</strong>{" "}
                  {new Date(selectedRequest.start_date).toLocaleDateString()} -{" "}
                  {new Date(selectedRequest.end_date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comments{" "}
                  {approvalAction === "reject" ? "(Required)" : "(Optional)"}
                </label>
                <textarea
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder={`Enter ${
                    approvalAction === "approve" ? "approval" : "rejection"
                  } comments...`}
                />
              </div>

              {approvalAction === "reject" && !approvalComments.trim() && (
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Rejection reason is required</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitApproval}
                disabled={
                  loading ||
                  (approvalAction === "reject" && !approvalComments.trim())
                }
                className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                  approvalAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {approvalAction === "approve" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>
                  {loading
                    ? "Processing..."
                    : approvalAction === "approve"
                    ? "Approve"
                    : "Reject"}
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LeaveApproval;
