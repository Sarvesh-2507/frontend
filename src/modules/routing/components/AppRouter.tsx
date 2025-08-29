import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import ProtectedRoute from '../../../components/ProtectedRoute';

// Import all the page components
import { Login, Register, ForgotPassword, ChangePassword } from '../../auth';
// Onboarding feature imports
import OfferLetter from '../../../features/onboarding/OfferLetter';
import PreBoarding from '../../../features/onboarding/PreBoarding';
import BackgroundVerification from '../../../features/onboarding/BackgroundVerification';
import JoiningFormalities from '../../../features/onboarding/JoiningFormalities';
import CandidateDocumentManager from '../../../features/onboarding/CandidateDocumentManager';
import TaskChecklist from '../../../features/onboarding/TaskChecklist';
import CandidateInvite from '../../../features/onboarding/CandidateInvite';
import CandidateInvites from '../../../features/onboarding/CandidateInvites';
import AssetAllocation from '../../../features/onboarding/AssetAllocation';


// Legacy components (to be migrated)
import Notifications from '../../../features/common/Notifications';
import Payroll from '../../../features/payroll/Payroll';
import Profile from '../../../features/profile/Profile';
import Settings from '../../../features/settings/Settings';

const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Register />
          )
        }
      />
      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <ForgotPassword />
          )
        }
      />

      {/* Protected Routes */}

  {/* Onboarding HR Features */}
  <Route path="/onboarding/offer-letter" element={
    <ProtectedRoute>
      <OfferLetter />
    </ProtectedRoute>
  } />
  <Route path="/onboarding/pre-boarding" element={
    <ProtectedRoute>
      <PreBoarding />
    </ProtectedRoute>
  } />
  <Route path="/onboarding/background-verification" element={
    <ProtectedRoute>
      <BackgroundVerification />
    </ProtectedRoute>
  } />
  <Route path="/onboarding/joining-formalities" element={
    <ProtectedRoute>
      <JoiningFormalities />
    </ProtectedRoute>
  } />
  <Route path="/onboarding/candidate-uploads" element={
    <ProtectedRoute>
      <CandidateDocumentManager />
    </ProtectedRoute>
  } />
  <Route path="/onboarding/tasks" element={
    <ProtectedRoute>
      <TaskChecklist />
    </ProtectedRoute>
  } />
  <Route path="/onboarding/candidate-invite" element={
    <ProtectedRoute>
      <CandidateInvite />
    </ProtectedRoute>
  } />
  <Route path="/onboarding/candidate-invites" element={
    <ProtectedRoute>
      <CandidateInvites />
    </ProtectedRoute>
  } />
  <Route path="/onboarding/asset-allocation" element={
    <ProtectedRoute>
      <AssetAllocation />
    </ProtectedRoute>
  } />

      {/* Default redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
