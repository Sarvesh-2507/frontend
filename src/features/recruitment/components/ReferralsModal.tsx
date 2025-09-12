import React, { useEffect, useState } from 'react';
import { X, User, Mail, Phone, FileText, ExternalLink, Calendar, MessageSquare, Edit3, Save, XCircle, Briefcase, Hash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { recruitmentAPI, Referral } from '../../../services/recruitmentApi';

interface ReferralsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobPostingId: number | null;
  jobTitle: string;
}

const ReferralsModal: React.FC<ReferralsModalProps> = ({
  isOpen,
  onClose,
  jobPostingId,
  jobTitle,
}) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingRemarks, setEditingRemarks] = useState<{
    referralId: number | null;
    remarks: string;
    isUpdating: boolean;
  }>({
    referralId: null,
    remarks: '',
    isUpdating: false,
  });
  const [editingStatus, setEditingStatus] = useState<{
    referralId: number | null;
    status: Referral['status'];
    isUpdating: boolean;
  }>({
    referralId: null,
    status: 'PENDING',
    isUpdating: false,
  });

  useEffect(() => {
    if (isOpen) {
      fetchReferrals();
    }
  }, [isOpen, jobPostingId]);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const data = jobPostingId 
        ? await recruitmentAPI.referrals.getByJobPosting(jobPostingId)
        : await recruitmentAPI.referrals.getAll();
      setReferrals(data);
      toast.success(`Loaded ${data.length} referrals`);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast.error('Failed to load referrals');
      setReferrals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (referralId: number, newStatus: Referral['status'], remarks?: string) => {
    try {
      await recruitmentAPI.referrals.updateStatus(referralId, newStatus, remarks);
      toast.success('Referral status updated successfully');
      // Refresh the list
      fetchReferrals();
    } catch (error) {
      console.error('Error updating referral status:', error);
      toast.error('Failed to update referral status');
    }
  };

  const handleRemarksEdit = (referralId: number, currentRemarks: string | null) => {
    setEditingRemarks({
      referralId,
      remarks: currentRemarks || '',
      isUpdating: false,
    });
  };

  const handleRemarksSave = async (referralId: number, currentStatus: Referral['status']) => {
    try {
      setEditingRemarks(prev => ({ ...prev, isUpdating: true }));
      await recruitmentAPI.referrals.updateStatus(referralId, currentStatus, editingRemarks.remarks);
      toast.success('Remarks updated successfully');
      setEditingRemarks({ referralId: null, remarks: '', isUpdating: false });
      // Refresh the list
      fetchReferrals();
    } catch (error) {
      console.error('Error updating remarks:', error);
      toast.error('Failed to update remarks');
      setEditingRemarks(prev => ({ ...prev, isUpdating: false }));
    }
  };

  const handleRemarksCancel = () => {
    setEditingRemarks({ referralId: null, remarks: '', isUpdating: false });
  };

  const handleStatusEdit = (referralId: number, currentStatus: Referral['status']) => {
    setEditingStatus({
      referralId,
      status: currentStatus,
      isUpdating: false,
    });
  };

  const handleStatusSave = async (referralId: number, currentRemarks: string | null) => {
    try {
      setEditingStatus(prev => ({ ...prev, isUpdating: true }));
      await recruitmentAPI.referrals.updateStatus(referralId, editingStatus.status, currentRemarks || undefined);
      toast.success('Status updated successfully');
      setEditingStatus({ referralId: null, status: 'PENDING', isUpdating: false });
      // Refresh the list
      fetchReferrals();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
      setEditingStatus(prev => ({ ...prev, isUpdating: false }));
    }
  };

  const handleStatusCancel = () => {
    setEditingStatus({ referralId: null, status: 'PENDING', isUpdating: false });
  };

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = 
      referral.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.friend_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.friend_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.job_role_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
      case 'APPROVED':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case 'REJECTED':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      case 'UNDER_REVIEW':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
      case 'INTERVIEWED':
        return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {jobPostingId ? `Referrals for: ${jobTitle}` : 'All Employee Referrals'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {jobPostingId 
                ? 'View and manage employee referrals for this job posting'
                : 'View and manage all employee referrals across all job postings'
              }
            </p>
            {!loading && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {filteredReferrals.length} referral{filteredReferrals.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by employee name, candidate name, email, job title, or role ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="INTERVIEWED">Interviewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading referrals...</span>
            </div>
          ) : filteredReferrals.length > 0 ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {['PENDING', 'UNDER_REVIEW', 'APPROVED', 'INTERVIEWED', 'REJECTED'].map(status => {
                  const count = filteredReferrals.filter(r => r.status === status).length;
                  return (
                    <div key={status} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                      <div className="text-center">
                        <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mb-2 ${getStatusColor(status)}`}>
                          {status.replace('_', ' ')}
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">referral{count !== 1 ? 's' : ''}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Referrals List */}
              <div className="space-y-4">
                {filteredReferrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Referral Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                          Referral #{referral.id}
                        </div>
                        <span className={getStatusColor(referral.status)}>
                          {referral.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(referral.submitted_at)}
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Referral Info */}
                      <div className="flex-1 space-y-4">
                      {/* Employee and Friend Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Employee Info */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Referred by Employee
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
                            {referral.employee_name}
                          </p>
                        </div>

                        {/* Friend Info */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Referred Candidate
                          </h4>
                          <div className="pl-6 space-y-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {referral.friend_name}
                            </p>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Mail className="w-4 h-4 mr-2" />
                              {referral.friend_email}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Phone className="w-4 h-4 mr-2" />
                              {referral.friend_phone}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Job Information */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-medium text-blue-900 dark:text-blue-300 flex items-center mb-3">
                          <Briefcase className="w-4 h-4 mr-2" />
                          Job Position Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center">
                            <Hash className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            <span className="text-blue-700 dark:text-blue-400 font-medium">Role ID:</span>
                            <span className="ml-2 text-blue-800 dark:text-blue-300 font-mono">{referral.job_role_id}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            <span className="text-blue-700 dark:text-blue-400 font-medium">Job Title:</span>
                            <span className="ml-2 text-blue-800 dark:text-blue-300 font-semibold">{referral.job_title}</span>
                          </div>
                        </div>
                      </div>

                      {/* Links and Documents */}
                      <div className="flex flex-wrap gap-4">
                        {referral.friend_resume && (
                          <a
                            href={referral.friend_resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            View Resume
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                        {referral.linkedin_url && (
                          <a
                            href={referral.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            LinkedIn Profile
                          </a>
                        )}
                      </div>

                      {/* Remarks */}
                      <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start flex-1">
                            <MessageSquare className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Remarks:
                                </p>
                                {editingRemarks.referralId !== referral.id && (
                                  <button
                                    onClick={() => handleRemarksEdit(referral.id, referral.remarks)}
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                    title="Edit remarks"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              
                              {editingRemarks.referralId === referral.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editingRemarks.remarks}
                                    onChange={(e) => setEditingRemarks(prev => ({ ...prev, remarks: e.target.value }))}
                                    placeholder="Add remarks for this referral..."
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                    rows={3}
                                    disabled={editingRemarks.isUpdating}
                                  />
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleRemarksSave(referral.id, referral.status)}
                                      disabled={editingRemarks.isUpdating}
                                      className="inline-flex items-center px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                      {editingRemarks.isUpdating ? (
                                        <>
                                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                          Saving...
                                        </>
                                      ) : (
                                        <>
                                          <Save className="w-3 h-3 mr-1" />
                                          Save
                                        </>
                                      )}
                                    </button>
                                    <button
                                      onClick={handleRemarksCancel}
                                      disabled={editingRemarks.isUpdating}
                                      className="inline-flex items-center px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                      <XCircle className="w-3 h-3 mr-1" />
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {referral.remarks || 'No remarks added yet. Click the edit button to add remarks.'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col items-start lg:items-end space-y-3">
                      {/* Editable Status */}
                      <div className="flex items-center space-x-2">
                        {editingStatus.referralId === referral.id ? (
                          <div className="flex flex-col space-y-2">
                            <select
                              value={editingStatus.status}
                              onChange={(e) => setEditingStatus(prev => ({ ...prev, status: e.target.value as Referral['status'] }))}
                              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                              disabled={editingStatus.isUpdating}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="UNDER_REVIEW">Under Review</option>
                              <option value="APPROVED">Approved</option>
                              <option value="INTERVIEWED">Interviewed</option>
                              <option value="REJECTED">Rejected</option>
                            </select>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleStatusSave(referral.id, referral.remarks)}
                                disabled={editingStatus.isUpdating}
                                className="inline-flex items-center px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {editingStatus.isUpdating ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-3 h-3 mr-1" />
                                    Save
                                  </>
                                )}
                              </button>
                              <button
                                onClick={handleStatusCancel}
                                disabled={editingStatus.isUpdating}
                                className="inline-flex items-center px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className={getStatusColor(referral.status)}>
                              {referral.status.replace('_', ' ')}
                            </span>
                            <button
                              onClick={() => handleStatusEdit(referral.id, referral.status)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                              title="Edit status"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Quick Status Update Buttons (for convenience) */}
                      {editingStatus.referralId !== referral.id && (
                        <div className="flex flex-wrap gap-2">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 w-full text-center lg:text-right">
                            Quick Actions:
                          </div>
                          {referral.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(referral.id, 'UNDER_REVIEW')}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              >
                                Under Review
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(referral.id, 'APPROVED')}
                                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(referral.id, 'REJECTED')}
                                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {referral.status === 'UNDER_REVIEW' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(referral.id, 'APPROVED')}
                                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(referral.id, 'INTERVIEWED')}
                                className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                              >
                                Interviewed
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(referral.id, 'REJECTED')}
                                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {referral.status === 'APPROVED' && (
                            <button
                              onClick={() => handleStatusUpdate(referral.id, 'INTERVIEWED')}
                              className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                            >
                              Mark Interviewed
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <div className="text-lg font-medium">No referrals found</div>
                <div className="mt-2">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No employee referrals have been submitted for this job posting yet'
                  }
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredReferrals.length} of {referrals.length} referrals displayed
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralsModal;
