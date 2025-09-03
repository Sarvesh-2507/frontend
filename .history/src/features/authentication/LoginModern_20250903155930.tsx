import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Logo from "../../components/ui/Logo";
import { useThemeStore } from "../../context/themeStore";

// Redux
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearError, loginUser } from "../../store/slices/authSlice";

// UI Components
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

// Types
import type { LoginCredentials } from "../../types/auth";

const LoginModern: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isDark, toggleTheme } = useThemeStore();

  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginCredentials>();

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: LoginCredentials) => {
    try {
      console.log("🔐 Login Component - Starting login with:", data.email);
      await dispatch(loginUser(data)).unwrap();
      console.log(
        "✅ Login Component - Login successful, navigating to home"
      );
      navigate("/home");
    } catch (error: any) {
      console.error("❌ Login Component - Login failed:", error);
      // Error is handled by Redux and shown via useEffect
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      // TODO: Implement forgot password with Redux
      toast.success("Password reset email sent!");
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    } catch (error) {
      toast.error("Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4">
      {/* Theme Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={toggleTheme}
        className="fixed top-4 left-4 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 z-50"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
        )}
      </motion.button>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/10 to-purple-50/10 dark:from-transparent dark:via-blue-900/5 dark:to-purple-900/5 opacity-30"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto mb-6 flex items-center justify-center">
            <Logo width={180} height={45} className="drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to MH Cognition
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </motion.div>

        {/* Login Form */}
        <Card
          variant="glass"
          shadow="soft"
          className="backdrop-blur-xl border border-white/20 dark:border-gray-700/20"
        >
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Email Field */}
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              variant="soft"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />

            {/* Password Field */}
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              variant="soft"
              icon={<Lock className="w-5 h-5" />}
              showPasswordToggle
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Forgot your password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              loading={isLoading}
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              className="shadow-soft-xl hover:shadow-soft-2xl"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            {/* Register Link */}
            <div className="text-center">
              <span className="text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
              </span>
              <Link
                to="/register"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                Sign up
              </Link>
            </div>
          </motion.form>
        </Card>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForgotPassword(false)}
          >
            <Card
              variant="soft"
              shadow="soft"
              className="w-full max-w-md"
              onClick={(e?: React.MouseEvent) => e?.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Reset Password
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  variant="soft"
                  icon={<Mail className="w-5 h-5" />}
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                />

                <div className="flex space-x-3">
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleForgotPassword}
                  >
                    Send Reset Link
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 HRM System. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginModern;
