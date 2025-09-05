import React, { useState, useEffect } from 'react';
import { User, LeaveRequest } from '../../types/leave';
import { apiService } from '../../services/leaveApi';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Toast from '../ui/Toast';

const formatHalfDaySession = (session: string): string => {
  switch (session) {
    case 'FULL_DAY': return 'Full Day';
    case 'FIRST_HALF': return 'First Half';
    case 'SECOND_HALF': return 'Second Half';
    default: return session;
  }
};

const LeaveHistory: React.FC<{ user: User; onBack: () => void }> = ({ user, onBack }) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
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
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          showToast('Authentication token not found. Please login again.', 'error');
          return;
        }
        
        const requests = await apiService.getLeaveRequests();
        setLeaveRequests(requests);
      } catch (error: any) {
        console.error('Error fetching leave requests:', error);
        if (error?.response?.status === 401) {
          showToast('Authentication failed. Please login again.', 'error');
        } else {
          showToast('Error fetching leave requests', 'error');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleCancel = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          showToast('Authentication token not found. Please login again.', 'error');
          return;
        }
        
        await apiService.cancelLeaveRequest(id);
        setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Cancelled' } : req));
        showToast('Leave request cancelled successfully', 'success');
      } catch (error: any) {
        console.error('Error cancelling leave request:', error);
        if (error?.response?.status === 401) {
          showToast('Authentication failed. Please login again.', 'error');
        } else {
          showToast('Error cancelling leave request', 'error');
        }
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Team Lead Approved': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Toast {...toast} onClose={hideToast} />
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">My Leave History</h1>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {leaveRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No leave requests found. Start by applying for your first leave.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedRequest(request)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.start_date} to {request.end_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.leave_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.total_days}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {(request.status === 'Pending' || request.status === 'Team Lead Approved') && (
                        <Button
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(request.id);
                          }}
                          className="text-xs px-3 py-1"
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal isOpen={selectedRequest !== null} onClose={() => setSelectedRequest(null)} title="Leave Request Details">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Leave Type:</label>
                <p className="text-gray-900">{selectedRequest.leave_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Total Days:</label>
                <p className="text-gray-900">{selectedRequest.total_days}</p>
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
                <label className="text-sm font-medium text-gray-700">Half Day Option:</label>
                <p className="text-gray-900">{formatHalfDaySession(selectedRequest.half_day_session)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                  {selectedRequest.status}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Reason:</label>
              <p className="text-gray-900 whitespace-pre-wrap">{selectedRequest.reason}</p>
            </div>
            {selectedRequest.rejection_reason && (
              <div>
                <label className="text-sm font-medium text-gray-700">Rejection Reason:</label>
                <p className="text-red-700">{selectedRequest.rejection_reason}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700">Action Timeline:</label>
              <div className="mt-2 space-y-2">
                {selectedRequest.action_logs.map((log) => (
                  <div key={log.id} className="text-sm text-gray-600">
                    <strong>{log.action}</strong> by {log.performed_by} on {new Date(log.timestamp).toLocaleString()}
                    {log.comments && <p className="text-gray-500 mt-1">{log.comments}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LeaveHistory;
