import Profile from "./features/employee/Profile";
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
import React, { useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastProvider } from "./context/ToastContext";
import { setupApiInterceptors } from "./utils/api";

// Auth Components
import Login from "./features/authentication/Login";
import Register from "./features/authentication/Register";
import ForgotPassword from "./features/authentication/ForgotPassword";
import ResetPassword from "./features/authentication/ResetPassword";
import ChangePassword from "./features/authentication/ChangePassword";

// Main Components
import HomePage from "./components/HomePage";


// HR Modules
import Organizations from "./features/organization/Organizations";
import CreateOrganization from "./features/organization/CreateOrganization";
import Recruitment from "./features/recruitment/Recruitment";
import Onboarding from "./features/onboarding/Onboarding";
// Onboarding sub-features
import OfferLetter from "./features/onboarding/OfferLetter";
import PreBoarding from "./features/onboarding/PreBoarding";
import BackgroundVerification from "./features/onboarding/BackgroundVerification";
import JoiningFormalities from "./features/onboarding/JoiningFormalities";
import CandidateDocumentManager from "./features/onboarding/CandidateDocumentManager";
import TaskChecklist from "./features/onboarding/TaskChecklist";
import CandidateInvite from "./features/onboarding/CandidateInvite";
import CandidateInvites from "./features/onboarding/CandidateInvites";
import AssetAllocation from "./features/onboarding/AssetAllocation";
// Employee Features
import EmployeeProfileModern from "./features/employee/EmployeeProfileModern";
import EmployeeDirectory from "./features/employee/EmployeeDirectory";
import ProfileManagement from "./features/employee/ProfileManagement";
import DocumentManagement from "./features/employee/DocumentManagement";
import AccessControl from "./features/employee/AccessControl";
import Attendance from "./features/attendance/Attendance";
import AttendanceDailyView from "./features/attendance/AttendanceDailyView";
import MonthlyAttendanceCalendar from "./features/attendance/MonthlyAttendanceCalendar";
import AttendanceSummaryReport from "./features/attendance/AttendanceSummaryReport";
import ManualAttendanceUpdate from "./features/attendance/ManualAttendanceUpdate";
import ImportAttendance from "./features/attendance/ImportAttendance";
import HolidayCalendar from "./features/attendance/HolidayCalendar";
import AttendanceMetricsDashboard from "./features/attendance/AttendanceMetricsDashboard";
import Leave from "./features/leave/Leave";
import LeaveApplication from "./features/leave/LeaveApplication";
import LeaveApplicationHistory from "./features/leave/LeaveApplicationHistory";
import LeaveBalance from "./features/leave/LeaveBalance";
import LeaveApproval from "./features/leave/LeaveApproval";
import Payroll from "./features/payroll/Payroll";
import SalaryStructure from "./features/payroll/SalaryStructure";
import PayrollRun from "./features/payroll/PayrollRun";
import Payslips from "./features/payroll/Payslips";
import AttendanceIntegration from "./features/payroll/AttendanceIntegration";
import TaxManagement from "./features/payroll/TaxManagement";
import BankProcessing from "./features/payroll/BankProcessing";
import PayrollCompliance from "./features/payroll/PayrollCompliance";
import PayrollReports from "./features/payroll/PayrollReports";
import PayrollAudit from "./features/payroll/PayrollAudit";
import PayrollSelfService from "./features/payroll/PayrollSelfService";
import Performance from "./features/performance/Performance";
import Offboarding from "./features/offboarding/Offboarding";
import Assets from "./features/assets/Assets";
import HelpDesk from "./features/help-desk/HelpDesk";
import CreateSupportTicket from "./features/help-desk/CreateSupportTicket";
import TicketTracking from "./features/help-desk/TicketTracking";
import KnowledgeBase from "./features/help-desk/KnowledgeBase";
import FAQ from "./features/help-desk/FAQ";
import FeedbackEngagement from "./features/help-desk/FeedbackEngagement";
import Settings from "./features/settings/Settings";

// Additional Enhanced Modules - Commented out to prevent loading issues
// import Training from "./features/training/Training";
// import Reports from "./features/reports/Reports";
// import Benefits from "./features/benefits/Benefits";
// import Compliance from "./features/compliance/Compliance";
// import Communication from "./features/communication/Communication";
import Announcements from "./features/announcements/Announcements";
import Inbox from "./features/inbox/Inbox";
// import HRProfile from "./features/hr/HRProfile";
// import Policies from "./features/policies/Policies";
// import Documents from "./features/policies/Documents";
// import Acknowledgements from "./features/policies/Acknowledgements";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./auth/AuthProvider";

// Auth Store
import { useAuthStore } from "./context/authStore";

const App: React.FC = () => {
  const { isAuthenticated, refreshToken, checkSession } = useAuthStore();

  // Apply theme
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  
  // Set up API interceptor for token refresh
  useEffect(() => {
    // Initialize API interceptors to handle 401 responses
    setupApiInterceptors(async () => {
      console.log("🔄 App - Refreshing token via interceptor");
      try {
        const success = await refreshToken();
        if (!success) {
          console.warn("🔄 App - Token refresh returned false, but continuing");
        }
      } catch (error) {
        console.error("🔄 App - Token refresh failed:", error);
        // Don't auto-logout, just let the component handle the error
      }
    });
    
    // Initial session check
    checkSession();
  }, []);

  return (
    <Router>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Main App Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />



          {/* Core HR Modules */}
          <Route
            path="/organizations"
            element={
              <ProtectedRoute>
                <Organizations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/organizations/create"
            element={
              <ProtectedRoute>
                <CreateOrganization />
              </ProtectedRoute>
            }
          />

          <Route
            path="/organizations/:id"
            element={
              <ProtectedRoute>
                <Organizations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/organizations/:id/companies"
            element={
              <ProtectedRoute>
                <Organizations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruitment"
            element={
              <ProtectedRoute>
                <Recruitment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          {/* Onboarding Sub-routes */}
          <Route
            path="/onboarding/offer-letter"
            element={
              <ProtectedRoute>
                <OfferLetter />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/onboarding/pre-boarding"
            element={
              <ProtectedRoute>
                <PreBoarding />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/onboarding/background-verification"
            element={
              <ProtectedRoute>
                <BackgroundVerification />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/onboarding/joining-formalities"
            element={
              <ProtectedRoute>
                <JoiningFormalities />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/onboarding/candidate-uploads"
            element={
              <ProtectedRoute>
                <CandidateDocumentManager />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/onboarding/tasks"
            element={
              <ProtectedRoute>
                <TaskChecklist />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/onboarding/candidate-invite"
            element={
              <ProtectedRoute>
                <CandidateInvite />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/onboarding/candidate-invites"
            element={
              <ProtectedRoute>
                <CandidateInvites />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/onboarding/asset-allocation"
            element={
              <ProtectedRoute>
                <AssetAllocation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee-profile"
            element={
              <ProtectedRoute>
                <EmployeeProfileModern />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/directory"
            element={
              <ProtectedRoute>
                <EmployeeDirectory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/profile-management"
            element={
              <ProtectedRoute>
                <ProfileManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/documents"
            element={
              <ProtectedRoute>
                <DocumentManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/access-control"
            element={
              <ProtectedRoute>
                <AccessControl />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance/daily"
            element={
              <ProtectedRoute>
                <AttendanceDailyView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance/monthly"
            element={
              <ProtectedRoute>
                <MonthlyAttendanceCalendar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance/summary"
            element={
              <ProtectedRoute>
                <AttendanceSummaryReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance/manual-update"
            element={
              <ProtectedRoute>
                <ManualAttendanceUpdate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance/import"
            element={
              <ProtectedRoute>
                <ImportAttendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance/holidays"
            element={
              <ProtectedRoute>
                <HolidayCalendar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance/metrics"
            element={
              <ProtectedRoute>
                <AttendanceMetricsDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leave"
            element={
              <ProtectedRoute>
                <Leave />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leave/application"
            element={
              <ProtectedRoute>
                <LeaveApplication />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leave/history"
            element={
              <ProtectedRoute>
                <LeaveApplicationHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leave/balance"
            element={
              <ProtectedRoute>
                <LeaveBalance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leave/approval"
            element={
              <ProtectedRoute>
                <LeaveApproval />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payroll"
            element={
              <ProtectedRoute>
                <Payroll />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payroll/salary-structure"
            element={
              <ProtectedRoute>
                <SalaryStructure />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payroll/run"
            element={
              <ProtectedRoute>
                <PayrollRun />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payroll/payslips"
            element={
              <ProtectedRoute>
                <Payslips />
              </ProtectedRoute>
            }
          />

          {/* Payroll Subfeatures */}
          <Route
            path="/payroll/attendance-integration"
            element={
              <ProtectedRoute>
                <AttendanceIntegration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/tax-management"
            element={
              <ProtectedRoute>
                <TaxManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/bank-processing"
            element={
              <ProtectedRoute>
                <BankProcessing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/compliance"
            element={
              <ProtectedRoute>
                <PayrollCompliance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/reports"
            element={
              <ProtectedRoute>
                <PayrollReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/audit"
            element={
              <ProtectedRoute>
                <PayrollAudit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/self-service"
            element={
              <ProtectedRoute>
                <PayrollSelfService />
              </ProtectedRoute>
            }
          />

          <Route
            path="/performance"
            element={
              <ProtectedRoute>
                <Performance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/offboarding"
            element={
              <ProtectedRoute>
                <Offboarding />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <Assets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/help-desk"
            element={
              <ProtectedRoute>
                <HelpDesk />
              </ProtectedRoute>
            }
          />

          <Route
            path="/help-desk/create-ticket"
            element={
              <ProtectedRoute>
                <CreateSupportTicket />
              </ProtectedRoute>
            }
          />

          <Route
            path="/help-desk/tracking"
            element={
              <ProtectedRoute>
                <TicketTracking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/help-desk/knowledge-base"
            element={
              <ProtectedRoute>
                <KnowledgeBase />
              </ProtectedRoute>
            }
          />

          <Route
            path="/help-desk/faq"
            element={
              <ProtectedRoute>
                <FAQ />
              </ProtectedRoute>
            }
          />

          <Route
            path="/help-desk/feedback"
            element={
              <ProtectedRoute>
                <FeedbackEngagement />
              </ProtectedRoute>
            }
          />

          {/* Enhanced Modules - Temporarily commented out
          <Route
            path="/training"
            element={
              <ProtectedRoute>
                <Training />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/benefits"
            element={
              <ProtectedRoute>
                <Benefits />
              </ProtectedRoute>
            }
          />

          <Route
            path="/compliance"
            element={
              <ProtectedRoute>
                <Compliance />
              </ProtectedRoute>
            }
          />
          */}

          {/* Temporarily commented out to prevent loading issues
          <Route
            path="/communication"
            element={
              <ProtectedRoute>
                <Communication />
              </ProtectedRoute>
            }
          />

          <Route
            path="/announcements"
            element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <Inbox />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hr/profile"
            element={
              <ProtectedRoute>
                <HRProfile />
              </ProtectedRoute>
            }
          />
          */}

          {/* Policies & Documents - Temporarily commented out
          <Route
            path="/policies"
            element={
              <ProtectedRoute>
                <Policies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/policies/documents"
            element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/policies/acknowledgements"
            element={
              <ProtectedRoute>
                <Acknowledgements />
              </ProtectedRoute>
            }
          />
          */}

          <Route
            path="/settings/*"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Default Routes */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg, #ffffff)',
              color: 'var(--toast-color, #333333)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              maxWidth: '320px'
            },
            success: {
              style: {
                background: '#10B981',
                color: '#FFFFFF',
                border: '1px solid #059669',
              },
              iconTheme: {
                primary: '#FFFFFF',
                secondary: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
                color: '#FFFFFF',
                border: '1px solid #DC2626',
              },
              iconTheme: {
                primary: '#FFFFFF',
                secondary: '#EF4444',
              },
            },
          }}
        />
        </div>
      </ToastProvider>
    </Router>
  );
};

export default App;