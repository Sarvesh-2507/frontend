import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import BackButton from "../../components/ui/BackButton";
import { getApiUrl } from "../../config";
import { apiService } from "../../services/leaveApi";
import { LeaveBalance } from "../../types/leave";

interface LeaveType {
  id: string;
  name: string;
  maxDays: number;
  description: string;
  requiresApproval: boolean;
  advanceNotice: number; // days
}

interface LeaveApplication {
  employee_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  half_day_session: "FULL_DAY" | "FIRST_HALF" | "SECOND_HALF";
  reason: string;
  attachment: File | null;
  status: "draft" | "submitted" | "approved" | "rejected";
}

const LeaveApplication: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [application, setApplication] = useState<any>({
    employee_id: 1, // TODO: Replace with real employee id
    leave_type: "",
    start_date: "",
    end_date: "",
    half_day_session: "FULL_DAY",
    reason: "",
    attachment: null,
    attachments: [],
    totalDays: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  // Save draft handler (mock)
  async function handleSaveDraft() {
    setLoading(true);
    try {
      // Simulate saving draft
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Saving draft:", application);
      // Show success message (could use toast)
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch leave balances for the logged-in employee only
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");
      // Fetch leave balance for the logged-in employee
      const balance = await apiService.getLeaveBalances(
        application.employee_id,
        token
      );
      // If the response is a single object, wrap it in an array
      if (Array.isArray(balance)) {
        setLeaveBalances(balance);
      } else if (balance && typeof balance === "object") {
        setLeaveBalances([balance]);
      } else {
        setLeaveBalances([]);
      }
    } catch (error) {
      console.error("Error fetching leave balances:", error);
      setLeaveBalances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Calculate total days whenever start or end date changes
    if (application.start_date && application.end_date) {
      const start = new Date(application.start_date);
      const end = new Date(application.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setApplication((prev: any) => ({ ...prev, totalDays: diffDays }));
    } else {
      setApplication((prev: any) => ({ ...prev, totalDays: 0 }));
    }
  }, [application.start_date, application.end_date]);

  // Update validateForm to check for past dates and end date before start date
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!application.leave_type) {
      newErrors.leave_type = "Please select a leave type";
    }
    if (!application.start_date) {
      newErrors.start_date = "Start date is required";
    } else {
      const start = new Date(application.start_date);
      start.setHours(0, 0, 0, 0);
      if (start < today) {
        newErrors.start_date = "Please select a future date.";
      }
    }
    if (!application.end_date) {
      newErrors.end_date = "End date is required";
    } else {
      const end = new Date(application.end_date);
      end.setHours(0, 0, 0, 0);
      if (end < today) {
        newErrors.end_date = "Please select a future date.";
      }
      if (application.start_date) {
        const start = new Date(application.start_date);
        start.setHours(0, 0, 0, 0);
        if (end < start) {
          newErrors.end_date = "End date must be after the start date.";
        }
      }
    }
    if (!application.reason.trim()) {
      newErrors.reason = "Reason is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("employee_id", String(application.employee_id));
      formData.append("leave_type", application.leave_type);
      formData.append("start_date", application.start_date);
      formData.append("end_date", application.end_date);
      formData.append("half_day_session", application.half_day_session);
      formData.append("reason", application.reason);
      if (application.attachment) {
        formData.append("attachment", application.attachment);
      }
      const response = await fetch(getApiUrl("leave/leave-requests/"), {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to submit leave request");
      setApplication({
        employee_id: 1,
        leave_type: "",
        start_date: "",
        end_date: "",
        half_day_session: "FULL_DAY",
        reason: "",
        attachment: null,
        attachments: [],
        totalDays: 0,
      });
      navigate("/leave/history");
    } catch (error) {
      console.error("Error submitting leave request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setApplication((prev: any) => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...files],
    }));
  };

  const removeAttachment = (index: number) => {
    setApplication((prev: any) => ({
      ...prev,
      attachments:
        prev.attachments?.filter((_: any, i: number) => i !== index) || [],
    }));
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApplication((prev: any) => ({
      ...prev,
      start_date: value,
    }));
    // Validate immediately after change
    setTimeout(validateForm, 0);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApplication((prev: any) => ({
      ...prev,
      end_date: value,
    }));
    // Validate immediately after change
    setTimeout(validateForm, 0);
  };

  const getLeaveBalance = () => {
    if (!application.leave_type) return null;
    return leaveBalances.find(
      (balance) => balance.leave_type === application.leave_type
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackButton to="/leave" label="Back to Leave" variant="default" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Leave Application
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Apply for time off
                </p>
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
                <span>{loading ? "Submitting..." : "Submit Application"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Leave Balance Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Leave Balance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(Array.isArray(leaveBalances) ? leaveBalances : []).map(
                  (balance) => (
                    <div
                      key={balance.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                    >
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {balance.leave_type_display || balance.leave_type}
                      </h4>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Available
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {balance.available}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Used
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {balance.used}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Pending
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {balance.pending}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Carried Forward
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {balance.carried_forward}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Leave Application Form
              </h3>

              <div className="space-y-6">
                {/* Leave Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Leave Type *
                  </label>
                  <select
                    value={application.leave_type}
                    onChange={(e) =>
                      setApplication((prev: any) => ({
                        ...prev,
                        leave_type: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                      errors.leave_type
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <option value="">Select leave type</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="CASUAL">Casual Leave</option>
                    <option value="COMP_OFF">Comp Off</option>
                  </select>
                  {errors.leave_type && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.leave_type}
                    </p>
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
                        value={application.start_date}
                        onChange={handleStartDateChange}
                        min={new Date().toISOString().split("T")[0]}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                          errors.start_date
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                    </div>
                    {errors.start_date && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.start_date}
                      </p>
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
                        value={application.end_date}
                        onChange={handleEndDateChange}
                        min={
                          application.start_date ||
                          new Date().toISOString().split("T")[0]
                        }
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                          errors.end_date
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                    </div>
                    {errors.end_date && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.end_date}
                      </p>
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
                          Remaining balance: {getLeaveBalance()?.remainingDays}{" "}
                          days
                        </div>
                      )}
                    </div>
                    {errors.totalDays && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.totalDays}
                      </p>
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
                    onChange={(e) =>
                      setApplication((prev: any) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                      errors.reason
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Please provide a detailed reason for your leave request..."
                  />
                  {errors.reason && (
                    <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                  )}
                </div>

                {/* Leave Day Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Leave Day Type
                  </label>
                  <select
                    value={application.half_day_session}
                    onChange={(e) =>
                      setApplication((prev: any) => ({
                        ...prev,
                        half_day_session: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                  >
                    <option value="FULL_DAY">Full Day</option>
                    <option value="FIRST_HALF">First Half</option>
                    <option value="SECOND_HALF">Second Half</option>
                  </select>
                </div>

                {/* No Work Handover Notes field */}

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

                    {application.attachments &&
                      application.attachments.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {application.attachments.map(
                            (file: File, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                              >
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-900 dark:text-white">
                                    {file.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                  </span>
                                </div>
                                <button
                                  onClick={() => removeAttachment(index)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )
                          )}
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
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Important Notes
                  </h4>
                  <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>
                      • Leave applications must be submitted with appropriate
                      advance notice
                    </li>
                    <li>
                      • Medical certificates are required for sick leave
                      exceeding 3 days
                    </li>
                    <li>
                      • Annual leave is subject to manager approval and business
                      requirements
                    </li>
                    <li>
                      • Emergency leave may be approved retroactively with
                      proper documentation
                    </li>
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
