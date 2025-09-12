import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  FileText,
  Eye,
  Download,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  XCircle,
  Pause,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../../config";
import { useAuthStore } from "../../context/authStore";
import toast from "react-hot-toast";

interface LeaveRequest {
  id: number;
  leave_type: string;
  leave_type_display: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at: string;
  half_day_session: string;
  attachments?: any[];
  manager_feedback?: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
}

type SortField = 'leave_type' | 'start_date' | 'total_days' | 'status' | 'created_at';
type SortOrder = 'asc' | 'desc';

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusIcons = {
  pending: Pause,
  approved: CheckCircle,
  rejected: XCircle,
  cancelled: XCircle,
};

const EmployeeLeaveHistory: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const navigate = useNavigate();
  const { getCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [leaveRequests, selectedStatus, searchTerm, selectedLeaveType, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortRequests = (requests: LeaveRequest[]) => {
    return [...requests].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle different data types
      switch (sortField) {
        case 'start_date':
        case 'created_at':
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
          break;
        case 'total_days':
          aValue = Number(aValue) || 0;
          bValue = Number(bValue) || 0;
          break;
        case 'leave_type':
          aValue = (a.leave_type_display || a.leave_type).toLowerCase();
          bValue = (b.leave_type_display || b.leave_type).toLowerCase();
          break;
        case 'status':
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
          break;
        default:
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const fetchLeaveHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const user = getCurrentUser();

      if (!token || !user) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        getApiUrl(`leave/leave-requests/?employee_id=${user.id}`),
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch leave history");
      }

      const data = await response.json();
      const requests = Array.isArray(data) ? data : data.results || [];
      setLeaveRequests(requests);
    } catch (error) {
      console.error("Error fetching leave history:", error);
      toast.error("Failed to fetch leave history");
      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...leaveRequests];

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((request) => request.status === selectedStatus);
    }

    // Filter by leave type
    if (selectedLeaveType !== "all") {
      filtered = filtered.filter((request) => request.leave_type === selectedLeaveType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.leave_type_display.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered = sortRequests(filtered);

    setFilteredRequests(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    const IconComponent = statusIcons[status as keyof typeof statusIcons];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  const getLeaveTypes = () => {
    const types = Array.from(new Set(leaveRequests.map(req => req.leave_type)));
    return types;
  };

  const viewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const downloadAttachment = (attachment: any) => {
    // Mock download functionality
    console.log("Downloading attachment:", attachment);
    toast.success("Download started");
  };

  const cancelRequest = async (requestId: number) => {
    if (!window.confirm("Are you sure you want to cancel this leave request?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        getApiUrl(`leave/leave-requests/${requestId}/cancel/`),
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel leave request");
      }

      toast.success("Leave request cancelled successfully");
      fetchLeaveHistory();
      setShowDetailsModal(false);
    } catch (error) {
      console.error("Error cancelling leave request:", error);
      toast.error("Failed to cancel leave request");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/emp-home/leave")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Leave History
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View your leave request history
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/emp-home/leave/application")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Application
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by reason or leave type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Leave Type Filter */}
          <select
            value={selectedLeaveType}
            onChange={(e) => setSelectedLeaveType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Leave Types</option>
            {getLeaveTypes().map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4 mr-2" />
            {filteredRequests.length} of {leaveRequests.length} requests
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading leave history...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No leave requests found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {leaveRequests.length === 0
                ? "You haven't submitted any leave requests yet."
                : "No requests match your current filters."}
            </p>
            {leaveRequests.length === 0 && (
              <button
                onClick={() => navigate("/emp-home/leave/application")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Your First Request
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort('leave_type')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Leave Type</span>
                      {getSortIcon('leave_type')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort('start_date')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Dates</span>
                      {getSortIcon('start_date')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort('total_days')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Days</span>
                      {getSortIcon('total_days')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Applied On</span>
                      {getSortIcon('created_at')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.leave_type_display || request.leave_type}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {request.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(request.start_date)} - {formatDate(request.end_date)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {request.half_day_session !== "FULL_DAY" && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                            {request.half_day_session.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {request.total_days || "N/A"} days
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${
                          statusColors[request.status]
                        }`}
                      >
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(request.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewDetails(request)}
                          className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {request.status === "pending" && (
                          <button
                            onClick={() => cancelRequest(request.id)}
                            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                            title="Cancel Request"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Leave Request Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Leave Type
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedRequest.leave_type_display || selectedRequest.leave_type}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${
                        statusColors[selectedRequest.status]
                      }`}
                    >
                      {getStatusIcon(selectedRequest.status)}
                      <span className="capitalize">{selectedRequest.status}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatDate(selectedRequest.start_date)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatDate(selectedRequest.end_date)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Total Days
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedRequest.total_days || "N/A"} days
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Day Type
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedRequest.half_day_session === "FULL_DAY"
                        ? "Full Day"
                        : selectedRequest.half_day_session.replace("_", " ")}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reason
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    {selectedRequest.reason}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Applied On
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formatDate(selectedRequest.created_at)}
                  </p>
                </div>

                {selectedRequest.approved_by && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Approved By
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedRequest.approved_by}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Approved On
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedRequest.approved_at ? formatDate(selectedRequest.approved_at) : "N/A"}
                      </p>
                    </div>
                  </div>
                )}

                {selectedRequest.rejection_reason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rejection Reason
                    </label>
                    <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      {selectedRequest.rejection_reason}
                    </p>
                  </div>
                )}

                {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Attachments
                    </label>
                    <div className="space-y-2">
                      {selectedRequest.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {attachment.name || `Attachment ${index + 1}`}
                            </span>
                          </div>
                          <button
                            onClick={() => downloadAttachment(attachment)}
                            className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                {selectedRequest.status === "pending" && (
                  <button
                    onClick={() => cancelRequest(selectedRequest.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel Request
                  </button>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaveHistory;
