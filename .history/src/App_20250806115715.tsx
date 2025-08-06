import React, { useEffect } from "react";
import { Provider } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./store";

// Pages
import DebugChangePassword from "./components/DebugChangePassword";
import LogoutTester from "./components/LogoutTester";
import TokenValidator from "./components/TokenValidator";
// import LoginModern from "./features/authentication/LoginModern";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import Payroll from "./pages/Payroll";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Settings from "./pages/Settings";

// New Horilla-style Pages
import EmployeeProfileModern from "./components/EmployeeProfile/EmployeeProfileModern";
import LogoutDebugger from "./components/LogoutDebugger";
import Assets from "./pages/Assets";
import Attendance from "./pages/Attendance";
import Companies from "./pages/Companies";
import CreateOrganization from "./pages/CreateOrganization";
import CreateSupportTicket from "./pages/CreateSupportTicket";
import Domains from "./pages/Domains";
import EmployeeProfile from "./pages/EmployeeProfile";
import FAQ from "./pages/FAQ";
import FeedbackEngagement from "./pages/FeedbackEngagement";
import HelpDesk from "./pages/HelpDesk";
import KnowledgeBase from "./pages/KnowledgeBase";
import Leave from "./pages/Leave";
import Offboarding from "./pages/Offboarding";
import Onboarding from "./pages/Onboarding";
import OrganizationDetail from "./pages/OrganizationDetail";
import OrganizationOverview from "./pages/OrganizationOverview";
import Organizations from "./pages/Organizations";
import Performance from "./pages/Performance";
import Recruitment from "./pages/Recruitment";
import TicketTracking from "./pages/TicketTracking";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Redux Hooks
import { useAppSelector } from "./store/hooks";

// Test utilities (for development)
import "./utils/debugOrganizationAPI";
import "./utils/testOrganizationAPI";

const AppContent: React.FC = () => {
  // Use Redux state for authentication
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const isDark = localStorage.getItem("theme") === "dark";

  console.log("🚀 App - Current auth state:", {
    isAuthenticated,
    user: !!user,
  });

  // Apply theme on app load
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Debug: Add console log to see if App is rendering
  console.log("App rendering, isAuthenticated:", isAuthenticated);

  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Routes>
          {/* Public Routes */}
          {/* <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <LoginModern />
              )
            }
          /> */}

          {/* Legacy Login */}
          <Route
            path="/login-legacy"
            element={
              isAuthenticated ? <Navigate to="/home" replace /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/home" replace /> : <Register />
            }
          />
          <Route
            path="/forgot-password"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <ForgotPassword />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Notifications */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* New Horilla-style Routes */}
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

          <Route
            path="/employee-profile"
            element={
              <ProtectedRoute>
                <EmployeeProfileModern />
              </ProtectedRoute>
            }
          />

          {/* Legacy Employee Profile */}
          <Route
            path="/employee-profile-legacy"
            element={
              <ProtectedRoute>
                <EmployeeProfile />
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
            path="/leave"
            element={
              <ProtectedRoute>
                <Leave />
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

          {/* Logout Debugger */}
          <Route
            path="/logout-debugger"
            element={
              <ProtectedRoute>
                <LogoutDebugger />
              </ProtectedRoute>
            }
          />

          {/* Organization Routes */}
          <Route
            path="/organizations/overview"
            element={
              <ProtectedRoute>
                <OrganizationOverview />
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
            path="/organizations"
            element={
              <ProtectedRoute>
                <Organizations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizations/:id"
            element={
              <ProtectedRoute>
                <OrganizationDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizations/:orgId/companies"
            element={
              <ProtectedRoute>
                <Companies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizations/:orgId/companies/:companyCode/domains"
            element={
              <ProtectedRoute>
                <Domains />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute>
                <EmployeeProfile />
              </ProtectedRoute>
            }
          />

          {/* Recruitment Submodule Routes */}
          <Route
            path="/recruitment/job-requisition"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Job Requisition Management
                  </h1>
                  <p>Manage job requisitions and approval workflows</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruitment/job-posting"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Job Posting & Advertisement
                  </h1>
                  <p>Post jobs on multiple platforms</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruitment/ats"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Application Tracking System
                  </h1>
                  <p>Track candidate applications</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruitment/interviews"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Interview Management</h1>
                  <p>Schedule and manage interviews</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruitment/candidates"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Candidate Registration</h1>
                  <p>Manage candidate records</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruitment/analytics"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Hiring Analytics Dashboard
                  </h1>
                  <p>View recruitment metrics</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruitment/budget"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Recruitment Budget Tracker
                  </h1>
                  <p>Track recruitment expenses</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Onboarding Submodule Routes */}
          <Route
            path="/onboarding/offer-letter"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Offer Letter Management
                  </h1>
                  <p>Manage offer letters and approvals</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/pre-boarding"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Pre-boarding Documentation
                  </h1>
                  <p>Handle pre-boarding documents</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/background-verification"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Background Verification
                  </h1>
                  <p>Manage background checks</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/joining-formalities"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Joining Formalities</h1>
                  <p>Complete joining procedures</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/induction"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Induction & Orientation
                  </h1>
                  <p>Employee induction programs</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/tasks"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Task & Checklist Tracking
                  </h1>
                  <p>Track onboarding tasks</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/profile-creation"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Employee Profile Creation
                  </h1>
                  <p>Create employee profiles</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/asset-allocation"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Asset Allocation</h1>
                  <p>Allocate assets to new employees</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Employee Submodule Routes */}
          <Route
            path="/employee/profiles"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Employee Profiles</h1>
                  <p>View and manage employee profiles</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile-management"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Profile Management</h1>
                  <p>Manage employee information</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/documents"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Document Management</h1>
                  <p>Manage employee documents</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/access-control"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Access Control</h1>
                  <p>Manage access permissions</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/audit-logs"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Audit Logs</h1>
                  <p>View system audit logs</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Attendance Submodule Routes */}
          <Route
            path="/attendance/daily"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Daily Attendance View</h1>
                  <p>View daily attendance records</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/monthly"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Monthly Attendance Calendar
                  </h1>
                  <p>Monthly attendance overview</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/summary"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Attendance Summary Report
                  </h1>
                  <p>Generate attendance reports</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/manual-update"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Manual Attendance Update
                  </h1>
                  <p>Update attendance manually</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/import"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Import Attendance</h1>
                  <p>Import attendance from Excel/CSV</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/holidays"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Holiday Calendar</h1>
                  <p>Manage holiday calendar</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/metrics"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Attendance Metrics Dashboard
                  </h1>
                  <p>View attendance analytics</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Leave Submodule Routes */}
          <Route
            path="/leave/application"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Leave Application</h1>
                  <p>Apply for leave</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave/history"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Leave Application History
                  </h1>
                  <p>View leave history</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave/balance"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Current Leave Balance</h1>
                  <p>Check leave balance</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave/approval"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Leave Approval</h1>
                  <p>Approve/reject leave requests</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave/requests"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">View Leave Requests</h1>
                  <p>Manage leave requests</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave/summary"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Leave Summary Viewer</h1>
                  <p>View leave summaries</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Payroll Submodule Routes */}
          <Route
            path="/payroll/salary-structure"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Employee Salary Structure Setup
                  </h1>
                  <p>Configure salary structures</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/attendance-integration"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Attendance & Time Integration
                  </h1>
                  <p>Integrate attendance with payroll</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/run"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Payroll Run</h1>
                  <p>Execute monthly/quarterly payroll</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/payslips"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Payslip Generation & Distribution
                  </h1>
                  <p>Generate and distribute payslips</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/tax-management"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Income Tax Management (TDS)
                  </h1>
                  <p>Manage tax deductions</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/bank-processing"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Bank & Payment Processing
                  </h1>
                  <p>Process bank payments</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/compliance"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Statutory Compliance</h1>
                  <p>Ensure statutory compliance</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/reports"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Payroll Reports & Analytics
                  </h1>
                  <p>Generate payroll reports</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/audit"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Audit & Access Control</h1>
                  <p>Payroll audit and access control</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll/self-service"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Self-Service Portal</h1>
                  <p>Employee self-service portal</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Performance Submodule Routes */}
          <Route
            path="/performance/reviews"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Schedule Performance Reviews
                  </h1>
                  <p>Schedule and manage performance reviews</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance/evaluation-forms"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Create Evaluation Forms
                  </h1>
                  <p>Create performance evaluation forms</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance/self-assessment"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Submit Self-Assessment</h1>
                  <p>Submit self-assessment forms</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance/feedback"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    View Performance Feedback
                  </h1>
                  <p>View performance feedback</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance/grades"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Approve Performance Grades
                  </h1>
                  <p>Approve performance grades</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance/insights"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Overview Performance Insights
                  </h1>
                  <p>View performance insights</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance/final-ratings"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Approve Final Ratings</h1>
                  <p>Approve final performance ratings</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance/reports"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Export Performance Reports
                  </h1>
                  <p>Export performance reports</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance/trends"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    View Performance Trends
                  </h1>
                  <p>View performance trends</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Offboarding Submodule Routes */}
          <Route
            path="/offboarding/exit-initiation"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Exit Initiation & Approval
                  </h1>
                  <p>Initiate and approve exit process</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/offboarding/exit-interview"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Exit Interview & Feedback
                  </h1>
                  <p>Conduct exit interviews</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/offboarding/final-settlement"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Full & Final Settlement
                  </h1>
                  <p>Process final settlements</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/offboarding/documentation"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Final Documentation & Handover
                  </h1>
                  <p>Complete documentation and handover</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/offboarding/asset-return"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Asset Return & Clearance
                  </h1>
                  <p>Return company assets</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/offboarding/access-deactivation"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Access Deactivation</h1>
                  <p>Deactivate system access</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/offboarding/resignation"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Apply Resignation</h1>
                  <p>Submit resignation application</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/offboarding/exit-status"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Track Exit Status</h1>
                  <p>Track exit process status</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/offboarding/exit-letters"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Download Exit Letters</h1>
                  <p>Download exit letters</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Assets Submodule Routes */}
          <Route
            path="/assets/request"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Asset Request & Credential Access
                  </h1>
                  <p>Request assets and credentials</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets/template"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Asset Template & Lifecycle Management
                  </h1>
                  <p>Manage asset templates and lifecycle</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets/inventory"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">
                    Inventory & Dispatch Control
                  </h1>
                  <p>Control inventory and dispatch</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets/tracking"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Asset Tracking</h1>
                  <p>Track asset locations and status</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets/maintenance"
            element={
              <ProtectedRoute>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Asset Maintenance</h1>
                  <p>Manage asset maintenance</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Help Desk Submodule Routes */}
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

          {/* Settings */}
          <Route
            path="/settings/*"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Change Password */}
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* Debug Change Password - REMOVE IN PRODUCTION */}
          <Route
            path="/debug-change-password"
            element={
              <ProtectedRoute>
                <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                  <div className="flex-1 overflow-y-auto">
                    <DebugChangePassword />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Token Validator - REMOVE IN PRODUCTION */}
          <Route
            path="/token-validator"
            element={
              <ProtectedRoute>
                <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                  <div className="flex-1 overflow-y-auto">
                    <TokenValidator />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Logout Tester - REMOVE IN PRODUCTION */}
          <Route
            path="/logout-tester"
            element={
              <ProtectedRoute>
                <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                  <div className="flex-1 overflow-y-auto">
                    <LogoutTester />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route
            path="/"
            element={
              <Navigate
                to={isAuthenticated ? "/dashboard" : "/login"}
                replace
              />
            }
          />

          {/* Catch all route */}
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
            }
          />
        </Routes>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDark ? "dark" : "light"}
          className="toast-container"
          toastClassName="backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-soft-xl"
        />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
