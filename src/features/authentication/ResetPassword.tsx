import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Shield, Eye, EyeOff } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../context/authStore";
import { useThemeStore } from "../../context/themeStore";

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
  const { isDark } = useThemeStore();

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
      setSuccessMessage('Password reset successful!');
      setIsSubmitted(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login", {
          state: { message: 'Password reset successful! Please login with your new password.' }
        });
      }, 3000);
    } catch (error: any) {
      console.error("❌ ResetPassword Component - Password reset failed:", error);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="card p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Password Reset Successful!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Redirecting to login page in 3 seconds...
              </p>
              <Link
                to="/login"
                className="inline-flex items-center text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Go to Sign In
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Logo */}
      <div className="absolute top-8 left-8">
        <Link to="/login" className="flex items-center space-x-2">
          <img
            src={isDark ? "/mh_cognition_cover-removebg-preview.png" : "/mh_cognition_logo-removebg-preview.png"}
            alt="MH Cognition"
            className="h-10 w-auto"
          />
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Enter your new password below to complete the reset process.
              </p>
            </motion.div>
          </div>

          {/* Error Message */}
          {(error || errorMessage) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-sm text-red-600 dark:text-red-400">{errorMessage || error}</p>
            </motion.div>
          )}

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
            >
              <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
            </motion.div>
          )}

          {/* Reset Password Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                New Password
              </label>
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
                      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                    },
                    onChange: () => handleInputChange('password'),
                  })}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="input-field pr-12"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                    onChange: () => handleInputChange('confirmPassword'),
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="input-field pr-12"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
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
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Reset Password"
              )}
            </motion.button>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
