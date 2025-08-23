import React, { useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastProvider } from "./context/ToastContext";

// Auth Components
import Login from "./features/authentication/Login";
import Register from "./features/authentication/Register";
import ForgotPassword from "./features/authentication/ForgotPassword";
import ResetPassword from "./features/authentication/ResetPassword";
import ChangePassword from "./features/authentication/ChangePassword";

// Main Components
import HomePage from "./components/HomePage";

// HR Modules - Only essential ones
import Organizations from "./features/organization/Organizations";
import CreateOrganization from "./features/organization/CreateOrganization";
import EmployeeProfileModern from "./features/employee/EmployeeProfileModern";
import Attendance from "./features/attendance/Attendance";
import Leave from "./features/leave/Leave";
import Payroll from "./features/payroll/Payroll";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Store
import { useAuthStore } from "./context/authStore";

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  // Apply theme
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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
            path="/employee-profile"
            element={
              <ProtectedRoute>
                <EmployeeProfileModern />
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
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
            },
          }}
        />
        </div>
      </ToastProvider>
    </Router>
  );
};

export default App;
