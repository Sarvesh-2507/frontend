import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Save,
  Send,
  FileText,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Upload,
  X,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

interface LeaveType {
  id: string;
  name: string;
  maxDays: number;
  description: string;
  requiresApproval: boolean;
  advanceNotice: number; // days
}

interface LeaveBalance {
  leaveTypeId: string;
  leaveTypeName: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

interface LeaveApplication {
  id?: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  emergencyContact: string;
  emergencyPhone: string;
  handoverNotes?: string;
  attachments?: File[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

const LeaveApplication: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [application, setApplication] = useState<LeaveApplication>({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    totalDays: 0,
    reason: '',
    emergencyContact: '',
    emergencyPhone: '',
    handoverNotes: '',
    attachments: [],
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();

  // Mock data
  const mockLeaveTypes: LeaveType[] = [
    {
      id: '1',
      name: 'Annual Leave',
      maxDays: 21,
      description: 'Yearly vacation leave',
      requiresApproval: true,
      advanceNotice: 7
    },
    {
      id: '2',
      name: 'Sick Leave',
      maxDays: 10,
      description: 'Medical leave for illness',
      requiresApproval: false,
      advanceNotice: 0
    },
    {
      id: '3',
      name: 'Personal Leave',
      maxDays: 5,
      description: 'Personal time off',
      requiresApproval: true,
      advanceNotice: 3
    },
    {
      id: '4',
      name: 'Maternity/Paternity Leave',
      maxDays: 90,
      description: 'Leave for new parents',
      requiresApproval: true,
      advanceNotice: 30
    }
  ];

  const mockLeaveBalances: LeaveBalance[] = [
    {
      leaveTypeId: '1',
      leaveTypeName: 'Annual Leave',
      totalDays: 21,
      usedDays: 8,
      remainingDays: 13
    },
    {
      leaveTypeId: '2',
      leaveTypeName: 'Sick Leave',
      totalDays: 10,
      usedDays: 2,
      remainingDays: 8
    },
    {
      leaveTypeId: '3',
      leaveTypeName: 'Personal Leave',
      totalDays: 5,
      usedDays: 1,
      remainingDays: 4
    },
    {
      leaveTypeId: '4',
      leaveTypeName: 'Maternity/Paternity Leave',
      totalDays: 90,
      usedDays: 0,
      remainingDays: 90
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateTotalDays();
  }, [application.startDate, application.endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLeaveTypes(mockLeaveTypes);
      setLeaveBalances(mockLeaveBalances);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalDays = () => {
    if (application.startDate && application.endDate) {
      const start = new Date(application.startDate);
      const end = new Date(application.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      setApplication(prev => ({ ...prev, totalDays: diffDays }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!application.leaveTypeId) {
      newErrors.leaveTypeId = 'Please select a leave type';
    }

    if (!application.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!application.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (application.startDate && application.endDate) {
      const start = new Date(application.startDate);
      const end = new Date(application.endDate);
      
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }

      // Check advance notice
      const selectedLeaveType = leaveTypes.find(lt => lt.id === application.leaveTypeId);
      if (selectedLeaveType) {
        const today = new Date();
        const daysDiff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff < selectedLeaveType.advanceNotice) {
          newErrors.startDate = `This leave type requires ${selectedLeaveType.advanceNotice} days advance notice`;
        }
      }
    }

    if (!application.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }

    if (!application.emergencyContact.trim()) {
      newErrors.emergencyContact = 'Emergency contact is required';
    }

    if (!application.emergencyPhone.trim()) {
      newErrors.emergencyPhone = 'Emergency phone is required';
    }

    // Check leave balance
    if (application.leaveTypeId && application.totalDays > 0) {
      const balance = leaveBalances.find(lb => lb.leaveTypeId === application.leaveTypeId);
      if (balance && application.totalDays > balance.remainingDays) {
        newErrors.totalDays = `Insufficient leave balance. Available: ${balance.remainingDays} days`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving draft:', application);
      // Show success message
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Submitting application:', { ...application, status: 'submitted' });
      
      // Reset form after successful submission
      setApplication({
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        totalDays: 0,
        reason: '',
        emergencyContact: '',
        emergencyPhone: '',
        handoverNotes: '',
        attachments: [],
        status: 'draft'
      });
      
      // Navigate to history or show success message
      navigate('/leave/history');
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setApplication(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setApplication(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || []
    }));
  };

  const getSelectedLeaveType = () => {
    return leaveTypes.find(lt => lt.id === application.leaveTypeId);
  };

  const getLeaveBalance = () => {
    return leaveBalances.find(lb => lb.leaveTypeId === application.leaveTypeId);
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Application</h1>
                <p className="text-gray-600 dark:text-gray-400">Apply for time off</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveDraft}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Submit Application'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Leave Balance Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Leave Balance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {leaveBalances.map((balance) => (
                  <div key={balance.leaveTypeId} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{balance.leaveTypeName}</h4>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                        <span className="font-medium text-gray-900 dark:text-white">{balance.remainingDays}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total</span>
                        <span className="text-gray-600 dark:text-gray-400">{balance.totalDays}</span>
                      </div>
                      <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(balance.remainingDays / balance.totalDays) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Leave Application Form</h3>
              
              <div className="space-y-6">
                {/* Leave Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Leave Type *
                  </label>
                  <select
                    value={application.leaveTypeId}
                    onChange={(e) => setApplication({ ...application, leaveTypeId: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                      errors.leaveTypeId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select leave type</option>
                    {leaveTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  {errors.leaveTypeId && (
                    <p className="mt-1 text-sm text-red-600">{errors.leaveTypeId}</p>
                  )}
                  {getSelectedLeaveType() && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {getSelectedLeaveType()?.description}
                      </p>
                      {getSelectedLeaveType()?.advanceNotice > 0 && (
                        <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                          Requires {getSelectedLeaveType()?.advanceNotice} days advance notice
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={application.startDate}
                        onChange={(e) => setApplication({ ...application, startDate: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                          errors.startDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                    </div>
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={application.endDate}
                        onChange={(e) => setApplication({ ...application, endDate: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                          errors.endDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                    </div>
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                    )}
                  </div>
                </div>

                {/* Total Days Display */}
                {application.totalDays > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Total Days: {application.totalDays}
                        </span>
                      </div>
                      {getLeaveBalance() && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Remaining balance: {getLeaveBalance()?.remainingDays} days
                        </div>
                      )}
                    </div>
                    {errors.totalDays && (
                      <p className="mt-2 text-sm text-red-600">{errors.totalDays}</p>
                    )}
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason for Leave *
                  </label>
                  <textarea
                    value={application.reason}
                    onChange={(e) => setApplication({ ...application, reason: e.target.value })}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                      errors.reason ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Please provide a detailed reason for your leave request..."
                  />
                  {errors.reason && (
                    <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                  )}
                </div>

                {/* Emergency Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Emergency Contact Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={application.emergencyContact}
                        onChange={(e) => setApplication({ ...application, emergencyContact: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                          errors.emergencyContact ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Emergency contact name"
                      />
                    </div>
                    {errors.emergencyContact && (
                      <p className="mt-1 text-sm text-red-600">{errors.emergencyContact}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Emergency Contact Phone *
                    </label>
                    <input
                      type="tel"
                      value={application.emergencyPhone}
                      onChange={(e) => setApplication({ ...application, emergencyPhone: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                        errors.emergencyPhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Emergency contact phone"
                    />
                    {errors.emergencyPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.emergencyPhone}</p>
                    )}
                  </div>
                </div>

                {/* Handover Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Work Handover Notes
                  </label>
                  <textarea
                    value={application.handoverNotes}
                    onChange={(e) => setApplication({ ...application, handoverNotes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Describe any work handover arrangements or important tasks to be covered..."
                  />
                </div>

                {/* File Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Supporting Documents
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Upload supporting documents (medical certificates, etc.)
                      </p>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Choose Files</span>
                      </label>
                    </div>
                    
                    {application.attachments && application.attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {application.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-900 dark:text-white">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button
                              onClick={() => removeAttachment(index)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Important Notes</h4>
                  <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Leave applications must be submitted with appropriate advance notice</li>
                    <li>• Medical certificates are required for sick leave exceeding 3 days</li>
                    <li>• Annual leave is subject to manager approval and business requirements</li>
                    <li>• Emergency leave may be approved retroactively with proper documentation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeaveApplication;
