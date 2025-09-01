import React, { useState, useEffect } from 'react';
import { User, LeaveRequest } from '../../types/leave';
import { apiService } from '../../services/leaveApi';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import TextArea from '../ui/TextArea';
import Toast from '../ui/Toast';

const HRDashboard: React.FC<{ user: User; onNavigate: (page: string) => void }> = ({ user, onNavigate }) => {
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };
  const hideToast = () => setToast(prev => ({ ...prev, isVisible: false }));

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const requests = await apiService.getPendingApprovals();
        setPendingRequests(requests);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingRequests();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await apiService.hrApprove(id);
      setPendingRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Approved' } : req));
      showToast('Leave request approved successfully', 'success');
      setSelectedRequest(null);
    } catch (error) {
      showToast('Error approving leave request', 'error');
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      showToast('Please provide a rejection reason', 'error');
      return;
    }
    try {
      await apiService.hrReject(selectedRequest.id, rejectionReason);
      setPendingRequests(prev => prev.map(req => req.id === selectedRequest.id ? { ...req, status: 'Rejected', rejection_reason: rejectionReason } : req));
      showToast('Leave request rejected', 'success');
      setSelectedRequest(null);
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      showToast('Error rejecting leave request', 'error');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Toast {...toast} onClose={hideToast} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
        <p className="text-gray-600 mt-2">Review and provide final approval for leave requests</p>
      </div>
      <div className="mb-6">
        <Button onClick={() => onNavigate('holiday-management')}>Manage Holidays</Button>
        <Button variant="secondary" onClick={() => onNavigate('view-holidays')} className="ml-2">View Holidays</Button>
      </div>
      {pendingRequests.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-gray-500">No Pending Approvals</div>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingRequests.map((request) => (
            <div key={request.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{request.employee_name}</h3>
                  <p className="text-gray-600 mt-1">{request.leave_type} - {request.total_days} day(s)</p>
                  <p className="text-gray-600">{request.start_date} to {request.end_date}</p>
                  <p className="text-gray-700 mt-2">{request.reason}</p>
                  <p className="text-sm text-blue-600 mt-2">✓ Approved by Team Lead</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button onClick={() => setSelectedRequest(request)}>
                    Review
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={selectedRequest !== null} onClose={() => setSelectedRequest(null)} title="Final Review - Leave Request">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Employee:</label>
                <p className="text-gray-900">{selectedRequest.employee_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Leave Type:</label>
                <p className="text-gray-900">{selectedRequest.leave_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Start Date:</label>
                <p className="text-gray-900">{selectedRequest.start_date}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">End Date:</label>
                <p className="text-gray-900">{selectedRequest.end_date}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Total Days:</label>
                <p className="text-gray-900">{selectedRequest.total_days}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Current Status:</label>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {selectedRequest.status}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Reason:</label>
              <p className="text-gray-900 whitespace-pre-wrap">{selectedRequest.reason}</p>
            </div>
            <div className="flex gap-4 pt-4">
              <Button onClick={() => handleApprove(selectedRequest.id)}>
                Give Final Approval
              </Button>
              <Button variant="secondary" onClick={() => setShowRejectModal(true)}>
                Reject
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Leave Request">
        <div className="space-y-4">
          <p className="text-gray-700">Please provide a reason for rejecting this leave request:</p>
          <TextArea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            rows={4}
            required
          />
          <div className="flex gap-4">
            <Button onClick={handleReject} variant="secondary">
              Reject Request
            </Button>
            <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HRDashboard;
