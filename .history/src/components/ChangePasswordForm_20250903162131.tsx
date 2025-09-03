import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Save,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { getApiUrl } from "../config";

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
  className?: string;
  title?: string;
  description?: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ValidationErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSuccess,
  onCancel,
  showCancelButton = false,
  className = "",
  title = "Change Password",
  description = "Update your account password",
}) => {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Password strength validation with enhanced requirements
  const validatePassword = (password: string): string[] => {
    const issues: string[] = [];

    // Length requirements
    if (password.length < 8) issues.push("At least 8 characters");
    if (password.length > 128) issues.push("Maximum 128 characters");

    // Character requirements
    if (!/[A-Z]/.test(password)) issues.push("One uppercase letter");
    if (!/[a-z]/.test(password)) issues.push("One lowercase letter");
    if (!/\d/.test(password)) issues.push("One number");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      issues.push("One special character");

    // Common password check
    const commonPasswords = [
      "password",
      "password123",
      "123456",
      "123456789",
      "qwerty",
      "abc123",
      "password1",
      "admin",
      "letmein",
      "welcome",
    ];
    if (commonPasswords.includes(password.toLowerCase())) {
      issues.push("Avoid common passwords");
    }

    return issues;
  };

  const getPasswordStrength = (
    password: string
  ): { strength: number; label: string; color: string } => {
    const issues = validatePassword(password);
    const maxScore = 7; // Updated for new validation criteria
    const strength = Math.max(0, maxScore - issues.length);

    if (strength <= 1)
      return { strength: 1, label: "Very Weak", color: "bg-red-500" };
    if (strength <= 2)
      return { strength: 2, label: "Weak", color: "bg-red-400" };
    if (strength <= 4)
      return { strength: 3, label: "Fair", color: "bg-yellow-500" };
    if (strength <= 5)
      return { strength: 4, label: "Good", color: "bg-blue-500" };
    if (strength <= 6)
      return { strength: 5, label: "Strong", color: "bg-green-500" };
    return { strength: 5, label: "Very Strong", color: "bg-green-600" };
  };

  const handleInputChange = (field: keyof PasswordData, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate current password
    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    // Validate new password
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else {
      const passwordIssues = validatePassword(passwordData.newPassword);
      if (passwordIssues.length > 0) {
        newErrors.newPassword = `Password must have: ${passwordIssues.join(
          ", "
        )}`;
      }
    }

    // Validate confirm password
    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Check if new password is same as current
    if (
      passwordData.currentPassword &&
      passwordData.newPassword &&
      passwordData.currentPassword === passwordData.newPassword
    ) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);

    try {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );

      console.log("Current user data from localStorage:", currentUser);
      console.log("Attempting to change password for user:", currentUser.email);
      console.log(
        "Sending change password request to:",
        "http://192.168.1.132:8000/api/change-password/"
      );

      // Get access token from stored user data - check multiple possible field names
      const accessToken =
        currentUser.access_token ||
        currentUser.token ||
        currentUser.access ||
        currentUser.authToken ||
        currentUser.jwt ||
        currentUser.bearer_token ||
        localStorage.getItem("accessToken");

      console.log("Available token fields:", {
        access_token: currentUser.access_token,
        token: currentUser.token,
        access: currentUser.access,
        authToken: currentUser.authToken,
        jwt: currentUser.jwt,
        bearer_token: currentUser.bearer_token,
        localStorage_accessToken: localStorage.getItem("accessToken"),
      });

      if (!accessToken) {
        console.log(
          "No access token found in user data. Available fields:",
          Object.keys(currentUser)
        );
        toast.error("Authentication token not found. Please login again.", {
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        });
        return;
      }

      console.log("Using access token:", accessToken.substring(0, 20) + "...");

      const response = await fetch(
        "http://192.168.1.132:8000/api/change-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
          body: JSON.stringify({
            current_password: passwordData.currentPassword,
            new_password: passwordData.newPassword,
            confirm_password: passwordData.confirmPassword,
          }),
        }
      );

      console.log("Change password response status:", response.status);

      const data = await response.json();
      console.log("Change password response data:", data);

      if (!response.ok) {
        // Handle different types of error responses
        let errorMessage = "Failed to change password";
        if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.current_password) {
          errorMessage = Array.isArray(data.current_password)
            ? data.current_password[0]
            : data.current_password;
        } else if (data.new_password) {
          errorMessage = Array.isArray(data.new_password)
            ? data.new_password[0]
            : data.new_password;
        } else {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }

        toast.error(errorMessage, {
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        });

        // If current password is wrong, focus on that field
        if (
          errorMessage.toLowerCase().includes("current") ||
          errorMessage.toLowerCase().includes("old") ||
          errorMessage.toLowerCase().includes("incorrect")
        ) {
          setErrors({ currentPassword: "Current password is incorrect" });
        }
        return;
      }

      // Handle success response
      const successMessage =
        data.success || data.message || "Password changed successfully!";

      toast.success(successMessage, {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      });

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Call success callback
      onSuccess?.();
    } catch (error: any) {
      console.error("Change password error:", error);

      toast.error("Failed to change password. Please check your connection.", {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Lock className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {description}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Password *
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={(e) =>
                handleInputChange("currentPassword", e.target.value)
              }
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-12 transition-colors ${
                errors.currentPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter your current password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPasswords.current ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.currentPassword}</span>
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            New Password *
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-12 transition-colors ${
                errors.newPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter your new password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPasswords.new ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {passwordData.newPassword && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Password Strength
                </span>
                <span
                  className={`text-xs font-medium ${
                    passwordStrength.strength >= 4
                      ? "text-green-600"
                      : passwordStrength.strength >= 3
                      ? "text-blue-600"
                      : passwordStrength.strength >= 2
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.newPassword}</span>
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirm New Password *
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-12 transition-colors ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Confirm your new password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPasswords.confirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.confirmPassword}</span>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Change Password</span>
              </>
            )}
          </motion.button>

          {showCancelButton && onCancel && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Cancel
            </motion.button>
          )}
        </div>
      </form>

      {/* Security Tips */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
          Password Security Tips:
        </h4>
        <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
          <li>
            • Use a mix of uppercase, lowercase, numbers, and special characters
          </li>
          <li>• Avoid using personal information or common words</li>
          <li>• Consider using a password manager for stronger security</li>
          <li>• Don't reuse passwords across different accounts</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default ChangePasswordForm;
