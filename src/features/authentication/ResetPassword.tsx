import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle, ArrowLeft, Shield } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../context/authStore";
import { useToast } from "../../context/ToastContext";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { resetPassword, isLoading, error } = useAuthStore();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    clearErrors,
  } = useForm<ResetPasswordForm>();

  const password = watch("password");

  useEffect(() => {
    console.log('=== TOKEN DEBUG ===');
    console.log('Raw token from URL:', token);
    console.log('Token type:', typeof token);
    console.log('Token length:', token?.length);
    console.log('Token encoded:', encodeURIComponent(token || ''));
    console.log('Current URL:', window.location.href);
    console.log('==================');

    if (!token) {
      console.error("❌ ResetPassword - No token found in URL");
      setErrorMessage('Invalid or missing reset token. Please request a new password reset.');
    }
  }, [token, navigate]);

  const onSubmit = async (data: ResetPasswordForm) => {
    setErrorMessage('');
    setSuccessMessage('');

    // Basic validation
    if (!data.password.trim()) {
      setErrorMessage('Password is required');
      return;
    }

    if (data.password !== data.confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.');
      return;
    }

    if (!token) {
      console.error("❌ ResetPassword - No token available");
      setErrorMessage('Invalid reset token. Please request a new password reset.');
      return;
    }

    try {
      console.log("🔐 ResetPassword Component - Starting password reset");
      console.log("🌐 ResetPassword Component - Token:", token);
      console.log("🔑 ResetPassword Component - Password length:", data.password.length);

      await resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      console.log("✅ ResetPassword Component - Password reset successful");
      showToast("Password reset successful! Redirecting to login...", "success");
      setIsSubmitted(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("❌ ResetPassword Component - Password reset failed:", error);
      showToast("Failed to reset password. Please try again.", "error");

      // Handle different error scenarios
      if (error.response?.status === 400) {
        setErrorMessage(error.response?.data?.message || error.response?.data?.error || 'Invalid or expired reset token.');
      } else if (error.response?.status === 404) {
        setErrorMessage('Reset token not found. Please request a new password reset.');
      } else {
        setErrorMessage(error.response?.data?.message || error.response?.data?.error || error.message || 'Password reset failed. Please try again.');
      }
    }
  };

  // Clear error when user starts typing
  const handleInputChange = (field: keyof ResetPasswordForm) => {
    if (errorMessage) {
      setErrorMessage('');
    }
    if (error) {
      // Clear auth store error as well
      clearErrors(field);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: "url('/Login page (1).jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        {/* Main content */}
        <div className="relative z-10 w-full max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-black rounded-2xl p-8 shadow-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-8 h-8 text-green-400" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-white mb-4">
                Password Reset Successful!
              </h1>
              <p className="text-gray-300 mb-6">
                Your password has been successfully reset.
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Redirecting to login page...
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: "url('/Login page (1).jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black rounded-2xl p-8 shadow-2xl"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="/mh_cognition_cover-removebg-preview.png"
              alt="MH Cognition"
              className="h-12 mx-auto mb-6"
            />
            <h2 className="text-white text-xl font-medium">
              Reset password
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {(error || errorMessage) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
              >
                <p className="text-sm text-red-300">{errorMessage || error}</p>
              </motion.div>
            )}
            {/* New Password Field */}
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: "Password must contain uppercase, lowercase, and number",
                  },
                  onChange: () => handleInputChange('password'),
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Enter New password"
                className="w-full px-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-300">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                  onChange: () => handleInputChange('confirmPassword'),
                })}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                className="w-full px-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-300">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              style={{
              backgroundColor: "#8e2255",
              }}
            >
              {isLoading ? "Changing password..." : "Change password"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
