import React, { useState } from 'react';
import { User } from '../../types/leave';
import { apiService } from '../../services/leaveApi';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import TextArea from '../ui/TextArea';
import Modal from '../ui/Modal';
import Toast from '../ui/Toast';

const LeaveApplicationForm: React.FC<{ user: User; onBack: () => void; onSuccess: () => void }> = ({ user, onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    half_day_option: 'Full Day',
    reason: '',
    attachment: null as File | null
  });
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };
  const hideToast = () => setToast(prev => ({ ...prev, isVisible: false }));

  const isSingleDay = formData.start_date === formData.end_date && formData.start_date !== '';

  const calculateDays = () => {
    if (!formData.start_date || !formData.end_date) return 0;
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (isSingleDay && formData.half_day_option !== 'Full Day') {
      return 0.5;
    }
    return diffDays;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const requestData = {
        employee_id: user.id,
        leave_type: formData.leave_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        half_day_session: formData.half_day_option === 'Full Day' ? 'FULL_DAY' : 
                         formData.half_day_option === 'First Half' ? 'FIRST_HALF' : 'SECOND_HALF',
        reason: formData.reason
      };
      await apiService.createLeaveRequest(requestData);
      showToast('Leave request submitted successfully!', 'success');
      setTimeout(() => {
        onSuccess();
        onBack();
      }, 2000);
    } catch (error) {
      showToast('Error submitting leave request. Please try again.', 'error');
    } finally {
      setLoading(false);
      setShowPreview(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 overflow-auto h-screen">
      <Toast {...toast} onClose={hideToast} />
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Apply for Leave</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={(e) => { e.preventDefault(); setShowPreview(true); }} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type *</label>
              <Select
                value={formData.leave_type}
                onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                required
              >
                <option value="">Select Leave Type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Compensatory Off">Compensatory Off</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
            {isSingleDay && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Half Day Option</label>
                <Select
                  value={formData.half_day_option}
                  onChange={(e) => setFormData({ ...formData, half_day_option: e.target.value as any })}
                >
                  <option value="Full Day">Full Day</option>
                  <option value="First Half">First Half</option>
                  <option value="Second Half">Second Half</option>
                </Select>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
            <TextArea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Please provide a reason for your leave request..."
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Document (Optional)</label>
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, attachment: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, JPG, PNG, DOC, DOCX</p>
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              Preview Request
            </Button>
            <Button type="button" variant="secondary" onClick={onBack}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="Leave Request Preview">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Leave Type:</label>
              <p className="text-gray-900">{formData.leave_type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Total Days:</label>
              <p className="text-gray-900">{calculateDays()} day(s)</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Start Date:</label>
              <p className="text-gray-900">{formData.start_date}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">End Date:</label>
              <p className="text-gray-900">{formData.end_date}</p>
            </div>
            {isSingleDay && (
              <div>
                <label className="text-sm font-medium text-gray-700">Half Day Option:</label>
                <p className="text-gray-900">{formData.half_day_option}</p>
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Reason:</label>
            <p className="text-gray-900 whitespace-pre-wrap">{formData.reason}</p>
          </div>
          {formData.attachment && (
            <div>
              <label className="text-sm font-medium text-gray-700">Attachment:</label>
              <p className="text-gray-900">{formData.attachment.name}</p>
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
            <Button variant="secondary" onClick={() => setShowPreview(false)}>
              Edit Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeaveApplicationForm;
