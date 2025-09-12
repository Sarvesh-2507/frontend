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
import HRHomepage from "./components/HRHomepage";


// HR Modules
import Organizations from "./features/organization/Organizations";
import CreateOrganization from "./features/organization/CreateOrganization";
import Recruitment from "./features/recruitment/Recruitment";
import JobPostingDashboard from "./features/recruitment/components/JobPostingDashboard";
import JobPostingForm from "./features/recruitment/components/JobPostingForm";
import HRDetailsForm from "./features/recruitment/components/HRDetailsForm";
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
import EmployeeProfile from "./components/EmployeeProfile";
import EmployeeProfileModern from "./features/employee/EmployeeProfileModern";
import EmployeeDirectory from "./features/employee/EmployeeDirectory";
import EmployeeView from "./features/employee/EmployeeView";
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
import HRProtectedRoute from "./components/HRProtectedRoute";
import EmployeeProtectedRoute from "./components/EmployeeProtectedRoute";
import RoleBasedRedirect from "./components/RoleBasedRedirect";
import RoleBasedRoute from "./components/RoleBasedRoute";
import RoleDebug from "./debug/RoleDebug";
import { AuthProvider } from "./auth/AuthProvider";

// Auth Store
import { useAuthStore } from "./context/authStore";
import CandidateProfileCreation from "./pages/CandidateProfileCreation";
import EmployeeRoutes from './employee/pages/EmployeeRoutes';
import EmployeeLoginPage from './employee/pages/LoginPage';
import EmployeeLogoutPage from './employee/pages/LogoutPage';
import PoliciesPage from './employee/pages/PoliciesPage';

const App: React.FC = () => {
  const { isAuthenticated, refreshToken, checkSession, initializeFromStorage } = useAuthStore();

  // Apply theme
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  
  // Initialize auth store from localStorage on app start
  useEffect(() => {
    console.log("🚀 App - Initializing auth store from localStorage");
    initializeFromStorage();
  }, [initializeFromStorage]);
  
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
    <AuthProvider>
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
              <HRProtectedRoute>
                <HRHomepage />
              </HRProtectedRoute>
            }
          />

          {/* Core HR Modules - Only accessible by HR */}
          <Route
            path="/organizations"
            element={
              <HRProtectedRoute>
                <Organizations />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/organizations/create"
            element={
              <HRProtectedRoute>
                <CreateOrganization />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/organizations/:id"
            element={
              <HRProtectedRoute>
                <Organizations />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/organizations/:id/companies"
            element={
              <HRProtectedRoute>
                <Organizations />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/recruitment"
            element={
              <HRProtectedRoute>
                <Recruitment />
              </HRProtectedRoute>
            }
          />

          {/* Recruitment Sub-routes - HR only */}
          <Route
            path="/recruitment/job-posting"
            element={
              <HRProtectedRoute>
                <JobPostingDashboard />
              </HRProtectedRoute>
            }
          />
          
          <Route
            path="/recruitment/job-posting/create"
            element={
              <HRProtectedRoute>
                <JobPostingForm />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/recruitment/job-posting/hr-details/:id"
            element={
              <HRProtectedRoute>
                <HRDetailsForm />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/onboarding"
            element={
              <HRProtectedRoute>
                <Onboarding />
              </HRProtectedRoute>
            }
          />

          {/* Onboarding Sub-routes - HR only */}
          <Route
            path="/onboarding/offer-letter"
            element={
              <HRProtectedRoute>
                <OfferLetter />
              </HRProtectedRoute>
            }
          />
          
          <Route
            path="/onboarding/pre-boarding"
            element={
              <HRProtectedRoute>
                <PreBoarding />
              </HRProtectedRoute>
            }
          />
          
          <Route
            path="/onboarding/background-verification"
            element={
              <HRProtectedRoute>
                <BackgroundVerification />
              </HRProtectedRoute>
            }
          />
          
          <Route
            path="/onboarding/joining-formalities"
            element={
              <HRProtectedRoute>
                <JoiningFormalities />
              </HRProtectedRoute>
            }
          />
          
          <Route
            path="/onboarding/candidate-uploads"
            element={<CandidateProfileCreation />}
          />
          
          <Route
            path="/onboarding/tasks"
            element={
              <HRProtectedRoute>
                <TaskChecklist />
              </HRProtectedRoute>
            }
          />
          
          <Route
            path="/onboarding/candidate-invite"
            element={
              <HRProtectedRoute>
                <CandidateInvite />
              </HRProtectedRoute>
            }
          />
          
          <Route
            path="/onboarding/candidate-invites"
            element={
              <HRProtectedRoute>
                <CandidateInvites />
              </HRProtectedRoute>
            }
          />
          
          <Route
            path="/onboarding/asset-allocation"
            element={
              <HRProtectedRoute>
                <AssetAllocation />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/employee-profile"
            element={
              <HRProtectedRoute>
                <EmployeeProfile />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/employee/directory"
            element={
              <HRProtectedRoute>
                <EmployeeDirectory />
              </HRProtectedRoute>
            }
          />
          <Route
            path="/employee/view/:empId"
            element={
              <HRProtectedRoute>
                <EmployeeView />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/employee/profile-management"
            element={
              <HRProtectedRoute>
                <ProfileManagement />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/employee/documents"
            element={
              <HRProtectedRoute>
                <DocumentManagement />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/employee/access-control"
            element={
              <HRProtectedRoute>
                <AccessControl />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <HRProtectedRoute>
                <Attendance />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/attendance/daily"
            element={
              <HRProtectedRoute>
                <AttendanceDailyView />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/attendance/monthly"
            element={
              <HRProtectedRoute>
                <MonthlyAttendanceCalendar />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/attendance/summary"
            element={
              <HRProtectedRoute>
                <AttendanceSummaryReport />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/attendance/manual-update"
            element={
              <HRProtectedRoute>
                <ManualAttendanceUpdate />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/attendance/import"
            element={
              <HRProtectedRoute>
                <ImportAttendance />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/attendance/holidays"
            element={
              <HRProtectedRoute>
                <HolidayCalendar />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/attendance/metrics"
            element={
              <HRProtectedRoute>
                <AttendanceMetricsDashboard />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/leave"
            element={
              <HRProtectedRoute>
                <Leave />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/leave/application"
            element={
              <HRProtectedRoute>
                <LeaveApplication />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/leave/history"
            element={
              <HRProtectedRoute>
                <LeaveApplicationHistory />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/leave/balance"
            element={
              <HRProtectedRoute>
                <LeaveBalance />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/leave/approval"
            element={
              <HRProtectedRoute>
                <LeaveApproval />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/payroll"
            element={
              <HRProtectedRoute>
                <Payroll />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/payroll/salary-structure"
            element={
              <HRProtectedRoute>
                <SalaryStructure />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/payroll/run"
            element={
              <HRProtectedRoute>
                <PayrollRun />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/payroll/payslips"
            element={
              <HRProtectedRoute>
                <Payslips />
              </HRProtectedRoute>
            }
          />

          {/* Payroll Subfeatures - HR only */}
          <Route
            path="/payroll/attendance-integration"
            element={
              <HRProtectedRoute>
                <AttendanceIntegration />
              </HRProtectedRoute>
            }
          />
          <Route
            path="/payroll/tax-management"
            element={
              <HRProtectedRoute>
                <TaxManagement />
              </HRProtectedRoute>
            }
          />
          <Route
            path="/payroll/bank-processing"
            element={
              <HRProtectedRoute>
                <BankProcessing />
              </HRProtectedRoute>
            }
          />
          <Route
            path="/payroll/compliance"
            element={
              <HRProtectedRoute>
                <PayrollCompliance />
              </HRProtectedRoute>
            }
          />
          <Route
            path="/payroll/reports"
            element={
              <HRProtectedRoute>
                <PayrollReports />
              </HRProtectedRoute>
            }
          />
          <Route
            path="/payroll/audit"
            element={
              <HRProtectedRoute>
                <PayrollAudit />
              </HRProtectedRoute>
            }
          />
          <Route
            path="/payroll/self-service"
            element={
              <HRProtectedRoute>
                <PayrollSelfService />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/performance"
            element={
              <HRProtectedRoute>
                <Performance />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/offboarding"
            element={
              <HRProtectedRoute>
                <Offboarding />
              </HRProtectedRoute>
            }
          />

          <Route
            path="/assets"
            element={
              <HRProtectedRoute>
                <Assets />
              </HRProtectedRoute>
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
          */}

          <Route
            path="/announcements"
            element={<Announcements />}
          />

          <Route
            path="/inbox"
            element={<Inbox />}
          />

          {/* 
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

          {/* Test Inbox Route - No Auth */}
          <Route path="/test-inbox" element={<Inbox />} />
          
          {/* Test Announcements Route - No Auth */}
          <Route path="/test-announcements" element={<Announcements />} />

          {/* Employee Routes - Protected and role-checked */}
          <Route 
            path="/emp-home/*" 
            element={
              <EmployeeProtectedRoute>
                <EmployeeRoutes />
              </EmployeeProtectedRoute>
            } 
          />
          <Route path="/emp-login" element={<EmployeeLoginPage />} />
          <Route path="/emp-logout" element={<EmployeeLogoutPage />} />

          {/* Debug Routes */}
          <Route path="/debug/role" element={<RoleDebug />} />

          {/* Default Routes */}
          <Route
            path="/"
            element={<RoleBasedRedirect />}
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
    </AuthProvider>
  );
};

export default App;