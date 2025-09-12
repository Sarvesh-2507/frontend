import React, { useState } from 'react';
import { X, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { recruitmentAPI, JobPosting } from '../../../services/recruitmentApi';

interface HRRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobPosting: JobPosting | null;
  onRejectSuccess: () => void;
}

const HRRejectModal: React.FC<HRRejectModalProps> = ({
  isOpen,
  onClose,
  jobPosting,
  onRejectSuccess,
}) => {
  const [formData, setFormData] = useState({
    status: 'REJECTED',
    remarks: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.remarks.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    if (!jobPosting) {
      toast.error('No job posting selected');
      return;
    }

    try {
      setIsSubmitting(true);
      await recruitmentAPI.jobPostings.hrRejectRequest(
        jobPosting.id,
        formData.status,
        formData.remarks
      );
      
      toast.success('Job posting request rejected successfully');
      onRejectSuccess();
      onClose();
      
      // Reset form
      setFormData({
        status: 'REJECTED',
        remarks: '',
      });
    } catch (error) {
      console.error('Error rejecting job posting request:', error);
      toast.error('Failed to reject job posting request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        status: 'REJECTED',
        remarks: '',
      });
      onClose();
    }
  };

  if (!isOpen || !jobPosting) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reject Job Posting Request
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Job Posting Info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Job Posting Details:
            </h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="font-medium">Title:</span> {jobPosting.job_title}</p>
              <p><span className="font-medium">Department:</span> {jobPosting.department}</p>
              <p><span className="font-medium">Team Lead:</span> {jobPosting.Tl_Name}</p>
              <p><span className="font-medium">Vacancies:</span> {jobPosting.vacancies}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Status Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rejection Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                disabled={isSubmitting}
              >
                <option value="REJECTED">Rejected</option>
                <option value="NEEDS_REVISION">Needs Revision</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="INSUFFICIENT_INFO">Insufficient Information</option>
              </select>
            </div>

            {/* Remarks Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                placeholder="Please provide a detailed reason for rejecting this job posting request..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white resize-none"
                rows={4}
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This reason will be communicated to the team lead.
              </p>
            </div>
          </div>

          {/* Warning Message */}
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700 dark:text-red-400">
                <p className="font-medium">Warning:</p>
                <p>This action will reject the job posting request. The team lead will be notified with your reason for rejection.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.remarks.trim()}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HRRejectModal;
