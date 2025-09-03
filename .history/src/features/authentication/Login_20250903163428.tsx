import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Smartphone } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../context/authStore";
import { useToast } from "../../context/ToastContext";
import { getApiUrl } from "../../config";
import type { LoginCredentials } from "../../types/auth";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, forgotPassword, isAuthenticated } = useAuthStore();
  const { showSuccess, showError } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = (location.state as any)?.from?.pathname || "/home";
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Handle success message from navigation state (e.g., from password reset)
  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      showSuccess(state.message);
      // Clear the state to prevent showing the message again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, showSuccess, navigate, location.pathname]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      console.log("🔐 Login Component - Starting login with:", data.email);
      
      // Clear any previous errors
      useAuthStore.setState({ error: null });
      
      await login(data);
      
      console.log("✅ Login Component - Login successful, navigating to home");
      
      // Get redirect location from navigation state or default to home
      const redirectPath = (location.state as any)?.from?.pathname || "/home";
      navigate(redirectPath, { replace: true });
      
    } catch (error: any) {
      console.error("❌ Login Component - Login failed:", error);
      
      // Error message is already handled in authStore with toast
      // Just log the error here for debugging
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Login failed. Please check your credentials.";
      
      console.error("Login error details:", errorMessage);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      showError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(forgotPasswordEmail)) {
      showError("Please enter a valid email address");
      return;
    }

    try {
      setForgotPasswordLoading(true);
      console.log(
        "📧 Sending forgot password request to:",
        getApiUrl('forgot-password')
      );
      console.log(
        "📤 Request body:",
        JSON.stringify({ email: forgotPasswordEmail })
      );

      await forgotPassword(forgotPasswordEmail);
      setForgotPasswordSuccess(true);
      showSuccess(`Password reset email sent to ${forgotPasswordEmail}`);
      console.log("✅ Forgot password email sent successfully");
    } catch (error: any) {
      console.error("❌ Forgot password failed:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to send reset email. Please try again.";
      showError(errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const resetForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail("");
    setForgotPasswordSuccess(false);
    setForgotPasswordLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url("/Login page (1).jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: 'Roboto, sans-serif'
      }}
    >
      {/* Login Container - Black Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="relative flex flex-col items-center justify-center"
        style={{
          width: '866px',
          height: '584px',
          backgroundColor: '#000000',
          borderRadius: '12px',
          padding: '48px',
          paddingTop: '40px', // Reduced from 80px to move content higher
          paddingBottom: '48px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Header Section */}
        <div className="relative mb-12 w-full">
          {/* Logo and Try Smart Sign In Button Row */}
          <div className="flex items-center justify-between mb-8 w-full">
            <img
              src="/mh_cognition_cover-removebg-preview.png"
              alt="MH Cognition"
              className="h-auto w-auto object-contain"
              style={{ maxHeight: '32px' }}
            />

            {/* Try Smart Sign In Button - Positioned to the right inside the box */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              type="button"
              className="text-white px-3 py-2 rounded text-sm font-medium flex items-center space-x-2 transition-all duration-300 hover:opacity-90"
              style={{
                backgroundColor: '#8E2255',
                fontFamily: 'Roboto, sans-serif',
                borderRadius: '20px',
                fontSize: '12px'
              }}
            >
              <i className="bi bi-qr-code text-sm"></i>
              <span>Try smart sign in</span>
            </motion.button>
          </div>
        </div>

        {/* Title Section */}
        {!showForgotPassword ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-4"
            style={{ textAlign: 'left' }}
          >
            <h2
              className="text-white font-normal"
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '32px',
                lineHeight: '1.2',
                marginBottom: '4px'
              }}
            >
              Sign in
            </h2>
            <p
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '14px',
                fontWeight: '300',
                color: '#888888',
                marginTop: '4px',
                marginBottom: '16px'
              }}
            >
              to access people
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-4"
            style={{ textAlign: 'left' }}
          >
            <h2
              className="text-white font-bold"
              style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '24px',
                marginBottom: '16px'
              }}
            >
              Forgot password
            </h2>
          </motion.div>
        )}

        {!showForgotPassword ? (
            /* Login Form */
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-md"
            >
              {/* Email Field */}
              <div style={{ marginBottom: '12px' }}>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className="focus:outline-none transition-all duration-300"
                  placeholder="Enter email ID"
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    width: '100%',
                    height: '40px',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '10px 12px',
                    fontSize: '16px',
                    fontWeight: '400'
                  }}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '12px' }}>
                <div className="relative" style={{ width: '100%' }}>
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    className="focus:outline-none transition-all duration-300"
                    placeholder="••••••••••"
                    style={{
                      fontFamily: 'Roboto, sans-serif',
                      width: '100%',
                      height: '40px',
                      backgroundColor: '#FFFFFF',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '10px 12px',
                      paddingRight: '40px',
                      fontSize: '16px',
                      fontWeight: '400'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute flex items-center"
                    style={{
                      top: '50%',
                      right: '12px',
                      transform: 'translateY(-50%)',
                      zIndex: 10
                    }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Links Section */}
              <div className="mb-4" style={{ textAlign: 'left' }}>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="transition-colors duration-300 hover:underline"
                  style={{
                    color: '#DC2626',
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '14px',
                    fontWeight: '400',
                    background: 'none',
                    border: 'none',
                    padding: '0',
                    cursor: 'pointer'
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900/20 border border-red-800 rounded-lg p-2 mb-3"
                >
                  <p className="text-sm text-red-400">
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:opacity-90"
                style={{
                  backgroundColor: '#8E2255',
                  fontFamily: 'Roboto, sans-serif',
                  width: '100%',
                  height: '40px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Sign in"
                )}
              </motion.button>
            </motion.form>
          ) : (
            /* Forgot Password Form */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-full max-w-md"
            >
              {/* Email Field */}
              <div style={{ marginBottom: '24px' }}>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="focus:outline-none transition-all duration-300"
                  placeholder="Enter email ID"
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    width: '100%',
                    height: '40px',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '10px 12px',
                    fontSize: '16px',
                    fontWeight: '400'
                  }}
                />
              </div>

              {/* Success Message */}
              {forgotPasswordSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-900/20 border border-green-800 rounded-lg p-3 mb-4"
                >
                  <p className="text-sm text-green-400">
                    Password reset email sent successfully! Please check your inbox and follow the instructions.
                  </p>
                </motion.div>
              )}

              {/* Send Verification Button */}
              <motion.button
                whileHover={{ scale: forgotPasswordSuccess ? 1 : 1.02 }}
                whileTap={{ scale: forgotPasswordSuccess ? 1 : 0.98 }}
                type="button"
                onClick={handleForgotPassword}
                disabled={forgotPasswordLoading || forgotPasswordSuccess}
                className="text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:opacity-90"
                style={{
                  backgroundColor: forgotPasswordSuccess ? '#10B981' : '#8E2255',
                  fontFamily: 'Roboto, sans-serif',
                  width: '100%',
                  height: '40px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  marginBottom: '16px'
                }}
              >
                {forgotPasswordLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : forgotPasswordSuccess ? (
                  "Email Sent ✓"
                ) : (
                  "Send Verification"
                )}
              </motion.button>

              {/* Action Buttons */}
              <div className="space-y-3">
                {forgotPasswordSuccess && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setForgotPasswordSuccess(false);
                      setForgotPasswordEmail("");
                    }}
                    className="text-white transition-all duration-300 flex items-center justify-center hover:opacity-90"
                    style={{
                      backgroundColor: '#6B7280',
                      fontFamily: 'Roboto, sans-serif',
                      width: '100%',
                      height: '40px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                  >
                    Send to Different Email
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={resetForgotPasswordModal}
                  className="text-white transition-all duration-300 flex items-center justify-center hover:opacity-90"
                  style={{
                    backgroundColor: '#8E2255',
                    fontFamily: 'Roboto, sans-serif',
                    width: '100%',
                    height: '40px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  Back To Login
                </motion.button>
              </div>
            </motion.div>
          )}
      </motion.div>
    </div>
  );
};

export default Login;
