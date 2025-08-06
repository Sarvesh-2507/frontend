import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

interface LeaveApplication {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  emergencyContact: string;
  emergencyPhone: string;
  handoverNotes?: string;
  attachments?: string[];
}

const LeaveApplicationHistory: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LeaveApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<LeaveApplication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const navigate = useNavigate();

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'this-year', label: 'This Year' },
    { value: 'last-year', label: 'Last Year' }
  ];

  // Mock data
  const mockApplications: LeaveApplication[] = [
    {
      id: '1',
      leaveType: 'Annual Leave',
      startDate: '2024-02-15',
      endDate: '2024-02-19',
      totalDays: 5,
      reason: 'Family vacation',
      status: 'approved',
      appliedDate: '2024-01-20',
      approvedBy: 'John Manager',
      approvedDate: '2024-01-22',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+1234567890',
      handoverNotes: 'All tasks delegated to team members',
      attachments: ['vacation-itinerary.pdf']
    },
    {
      id: '2',
      leaveType: 'Sick Leave',
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      totalDays: 3,
      reason: 'Medical treatment',
      status: 'approved',
      appliedDate: '2024-01-09',
      approvedBy: 'HR Department',
      approvedDate: '2024-01-09',
      emergencyContact: 'John Smith',
      emergencyPhone: '+1234567891',
      attachments: ['medical-certificate.pdf']
    },
    {
      id: '3',
      leaveType: 'Personal Leave',
      startDate: '2024-03-01',
      endDate: '2024-03-01',
      totalDays: 1,
      reason: 'Personal appointment',
      status: 'submitted',
      appliedDate: '2024-02-20',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+1234567890'
    },
    {
      id: '4',
      leaveType: 'Annual Leave',
      startDate: '2023-12-25',
      endDate: '2023-12-29',
      totalDays: 5,
      reason: 'Christmas holidays',
      status: 'rejected',
      appliedDate: '2023-12-15',
      rejectionReason: 'Insufficient advance notice during peak season',
      emergencyContact: 'Emergency Contact',
      emergencyPhone: '+1234567892'
    },
    {
      id: '5',
      leaveType: 'Annual Leave',
      startDate: '2024-04-15',
      endDate: '2024-04-19',
      totalDays: 5,
      reason: 'Spring break vacation',
      status: 'draft',
      appliedDate: '2024-02-25',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+1234567890'
    }
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter, dateFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApplications(mockApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      filtered = filtered.filter(app => {
        const appDate = new Date(app.appliedDate);
        
        switch (dateFilter) {
          case 'this-month':
            return appDate.getFullYear() === currentYear && appDate.getMonth() === currentMonth;
          case 'last-month':
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            return appDate.getFullYear() === lastMonthYear && appDate.getMonth() === lastMonth;
          case 'this-year':
            return appDate.getFullYear() === currentYear;
          case 'last-year':
            return appDate.getFullYear() === currentYear - 1;
          default:
            return true;
        }
      });
    }

    setFilteredApplications(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'submitted': return <Clock className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (application: LeaveApplication) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleEditApplication = (applicationId: string) => {
    // Navigate to edit form with application ID
    navigate(`/leave/application?edit=${applicationId}`);
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setApplications(prev => prev.filter(app => app.id !== applicationId));
      } catch (error) {
        console.error('Error deleting application:', error);
      }
    }
  };

  const exportToCSV = () => {
    const csvContent = `Leave Type,Start Date,End Date,Total Days,Status,Applied Date,Reason
${filteredApplications.map(app => 
  `${app.leaveType},${app.startDate},${app.endDate},${app.totalDays},${app.status},${app.appliedDate},"${app.reason}"`
).join('\n')}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leave_applications.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/leave')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Application History</h1>
                <p className="text-gray-600 dark:text-gray-400">View and manage your leave applications</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => navigate('/leave/application')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Application</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search applications..."
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
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Range
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {dateOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setDateFilter('all');
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Clear Filters</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Applications ({filteredApplications.length})
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Leave Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Days
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          No leave applications found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {application.leaveType}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {application.reason}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {new Date(application.startDate).toLocaleDateString()} - {new Date(application.endDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {application.totalDays}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                              {getStatusIcon(application.status)}
                              <span className="capitalize">{application.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {new Date(application.appliedDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewDetails(application)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {(application.status === 'draft' || application.status === 'submitted') && (
                                <button
                                  onClick={() => handleEditApplication(application.id)}
                                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
                              {application.status === 'draft' && (
                                <button
                                  onClick={() => handleDeleteApplication(application.id)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
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
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Leave Application Details
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Leave Type</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedApplication.leaveType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedApplication.status)}`}>
                    {getStatusIcon(selectedApplication.status)}
                    <span className="capitalize">{selectedApplication.status}</span>
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{new Date(selectedApplication.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{new Date(selectedApplication.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Days</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedApplication.totalDays}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Applied Date</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{new Date(selectedApplication.appliedDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedApplication.reason}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Contact</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedApplication.emergencyContact}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Phone</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedApplication.emergencyPhone}</p>
                </div>
              </div>
              
              {selectedApplication.handoverNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Handover Notes</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedApplication.handoverNotes}</p>
                </div>
              )}
              
              {selectedApplication.approvedBy && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Approved By</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedApplication.approvedBy}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Approved Date</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedApplication.approvedDate ? new Date(selectedApplication.approvedDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
              
              {selectedApplication.rejectionReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rejection Reason</label>
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{selectedApplication.rejectionReason}</p>
                </div>
              )}
              
              {selectedApplication.attachments && selectedApplication.attachments.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attachments</label>
                  <div className="mt-1 space-y-1">
                    {selectedApplication.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                        <FileText className="w-4 h-4" />
                        <span>{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
              {(selectedApplication.status === 'draft' || selectedApplication.status === 'submitted') && (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEditApplication(selectedApplication.id);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LeaveApplicationHistory;
