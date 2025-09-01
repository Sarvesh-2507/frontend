import React, { useState, useEffect } from 'react';
import { User, LeaveRequest } from '../../types/leave';
import { apiService } from '../../services/leaveApi';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import TextArea from '../ui/TextArea';
import Toast from '../ui/Toast';

const formatHalfDaySession = (session: string): string => {
  switch (session) {
    case 'FULL_DAY': return 'Full Day';
    case 'FIRST_HALF': return 'First Half';
    case 'SECOND_HALF': return 'Second Half';
    default: return session;
  }
};

const ManagerDashboard: React.FC<{ user: User; onNavigate: (page: string) => void }> = ({ user, onNavigate }) => {
  const [teamRequests, setTeamRequests] = useState<LeaveRequest[]>([]);
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
    const fetchTeamRequests = async () => {
      try {
        const requests = await apiService.getTeamRequests();
        setTeamRequests(requests);
      } catch (error) {
        console.error('Error fetching team requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamRequests();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await apiService.tlApprove(id);
      setTeamRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Team Lead Approved' } : req));
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
      await apiService.tlReject(selectedRequest.id, rejectionReason);
      setTeamRequests(prev => prev.map(req => req.id === selectedRequest.id ? { ...req, status: 'Rejected', rejection_reason: rejectionReason } : req));
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
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600 mt-2">Review and approve leave requests from your team</p>
      </div>
      {teamRequests.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-gray-500">No Pending Requests</div>
        </div>
      ) : (
        <div className="grid gap-6">
          {teamRequests.map((request) => (
            <div key={request.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{request.employee_name}</h3>
                  <p className="text-gray-600 mt-1">{request.leave_type} - {request.total_days} day(s)</p>
                  <p className="text-gray-600">{request.start_date} to {request.end_date}</p>
                  <p className="text-gray-700 mt-2">{request.reason}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button onClick={() => setSelectedRequest(request)}>
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={selectedRequest !== null} onClose={() => setSelectedRequest(null)} title="Leave Request Details">
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
                <label className="text-sm font-medium text-gray-700">Half Day Option:</label>
                <p className="text-gray-900">{formatHalfDaySession(selectedRequest.half_day_session)}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Reason:</label>
              <p className="text-gray-900 whitespace-pre-wrap">{selectedRequest.reason}</p>
            </div>
            <div className="flex gap-4 pt-4">
              <Button onClick={() => handleApprove(selectedRequest.id)}>
                Approve
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

export default ManagerDashboard;
