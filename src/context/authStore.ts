import { toast } from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AuthStore,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordRequest,
} from "../types/auth";
import { authApi } from "../utils/api";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });

          // Debug: Show exact API call details
          const apiBaseUrl =
            import.meta.env.VITE_USE_MOCK !== "false"
              ? "http://localhost:3002/api"
              : "http://192.168.1.132:8000/api";
          console.log(
            "🚀 Auth Store - Making login API call to:",
            `${apiBaseUrl}/login/`
          );
          console.log(
            "📤 Auth Store - Request body:",
            JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            })
          );

          const response = await authApi.login(credentials);
          console.log("📥 Auth Store - API Response:", response);

          if (response.success && response.data) {
            // Handle different response formats from backend
            let user: any, tokens: any;

            // Check if response has the expected structure
            if (response.data.user && response.data.tokens) {
              // Format: { user: {...}, tokens: { access: "...", refresh: "..." } }
              user = response.data.user;
              tokens = response.data.tokens;
            } else if (response.data.access_token || response.data.access) {
              // Format: { access_token: "...", refresh_token: "...", user: {...} }
              user = response.data.user || {
                id: "1",
                email: response.data.email || "user@example.com",
                username: response.data.username || "user",
                role: response.data.role || "employee",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              tokens = {
                access: response.data.access_token || response.data.access,
                refresh: response.data.refresh_token || response.data.refresh,
              };
            } else if (response.data.token) {
              // Format: { token: "...", user: {...} }
              user = response.data.user || {
                id: "1",
                email: response.data.email || "user@example.com",
                username: response.data.username || "user",
                role: response.data.role || "employee",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              tokens = {
                access: response.data.token,
                refresh:
                  response.data.refresh_token ||
                  response.data.refresh ||
                  response.data.token,
              };
            } else {
              // Fallback: create user object from available data
              user = {
                id: response.data.id || "1",
                email: response.data.email || "user@example.com",
                username:
                  response.data.username || response.data.email || "user",
                role: response.data.role || "employee",
                firstName:
                  response.data.first_name || response.data.firstName || "",
                lastName:
                  response.data.last_name || response.data.lastName || "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              tokens = {
                access:
                  response.data.access_token ||
                  response.data.access ||
                  response.data.token,
                refresh: response.data.refresh_token || response.data.refresh,
              };
            }

            // Validate that we have at least an access token
            if (!tokens.access) {
              throw new Error("No access token received from server");
            }

            set({
              user,
              tokens,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            // Store tokens in localStorage for API calls
            localStorage.setItem("accessToken", tokens.access);
            if (tokens.refresh) {
              localStorage.setItem("refreshToken", tokens.refresh);
            }

            toast.success("Login successful!");
          } else {
            throw new Error(response.message || "Login failed");
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || "Login failed";
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });
          toast.error(errorMessage);
          throw error;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authApi.register(credentials);

          if (response.success) {
            set({ isLoading: false, error: null });
            toast.success("Registration successful! Please login.");
          } else {
            throw new Error(response.message || "Registration failed");
          }
        } catch (error: any) {
          console.error("❌ Auth Store - Register error:", error);
          console.error(
            "❌ Auth Store - Error response data:",
            error.response?.data
          );
          console.error(
            "❌ Auth Store - Error status:",
            error.response?.status
          );

          let errorMessage = "Registration failed";

          if (error.response?.data) {
            if (typeof error.response.data === "string") {
              errorMessage = `HTTP ${error.response.status}: ${error.response.data}`;
            } else if (error.response.data.message) {
              errorMessage = `HTTP ${error.response.status}: ${error.response.data.message}`;
            } else if (error.response.data.error) {
              errorMessage = `HTTP ${error.response.status}: ${error.response.data.error}`;
            } else {
              // Handle field-specific errors
              const fieldErrors = Object.entries(error.response.data)
                .map(([field, messages]) => {
                  if (Array.isArray(messages)) {
                    return `${field}: ${messages.join(", ")}`;
                  }
                  return `${field}: ${messages}`;
                })
                .join("; ");
              errorMessage = `HTTP ${error.response.status}: ${
                fieldErrors || "Registration failed"
              }`;
            }
          } else {
            errorMessage = error.message || "Registration failed";
          }

          set({
            isLoading: false,
            error: errorMessage,
          });
          toast.error(errorMessage);
          throw error;
        }
      },

      logout: async () => {
        try {
          console.log("🚪 Auth Store - Starting logout process");
          const { tokens } = get();
          const currentUser = JSON.parse(
            localStorage.getItem("currentUser") || "{}"
          );

          // Try to logout from backend API
          const refreshToken =
            tokens?.refresh ||
            currentUser.refresh_token ||
            localStorage.getItem("refreshToken");
          console.log(
            "🔑 Auth Store - Using refresh token for logout:",
            refreshToken ? "Present" : "Missing"
          );

          if (refreshToken) {
            console.log("📡 Auth Store - Calling logout API...");
            await authApi.logout(refreshToken);
            console.log("✅ Auth Store - Logout API call successful");
          } else {
            console.log(
              "⚠️ Auth Store - No refresh token found, skipping API call"
            );
          }
        } catch (error) {
          console.error("❌ Auth Store - Logout API error:", error);
          console.log(
            "🧹 Auth Store - Continuing with local cleanup despite API error"
          );
        } finally {
          // Clear state regardless of API call success
          console.log("🧹 Auth Store - Clearing local state and storage");

          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            error: null,
          });

          // Clear all possible localStorage keys
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("currentUser");
          localStorage.removeItem("authToken");
          localStorage.removeItem("jwt");
          localStorage.removeItem("bearer_token");

          console.log("✅ Auth Store - Logout process completed");
          toast.success("Logged out successfully");
        }
      },

      refreshToken: async () => {
        try {
          const { tokens } = get();

          if (!tokens?.refresh) {
            throw new Error("No refresh token available");
          }

          const response = await authApi.refreshToken(tokens.refresh);

          if (response.success && response.data) {
            const newTokens = response.data;

            set({ tokens: newTokens });

            // Update localStorage
            localStorage.setItem("accessToken", newTokens.access);
            localStorage.setItem("refreshToken", newTokens.refresh);
          } else {
            throw new Error("Token refresh failed");
          }
        } catch (error) {
          console.error("Token refresh error:", error);
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },

      forgotPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });

          // Debug: Show exact API call details
          const apiBaseUrl =
            import.meta.env.VITE_USE_MOCK !== "false"
              ? "http://localhost:3002/api"
              : "http://192.168.1.132:8000/api";
          console.log(
            "📧 Auth Store - Making forgot password API call to:",
            `${apiBaseUrl}/forgot-password/`
          );
          console.log(
            "📤 Auth Store - Request body:",
            JSON.stringify({ email })
          );

          const response = await authApi.forgotPassword(email);
          console.log(
            "📥 Auth Store - Forgot password API Response:",
            response
          );

          if (response.success) {
            set({ isLoading: false, error: null });
            toast.success("Password reset email sent!");
          } else {
            throw new Error(response.message || "Failed to send reset email");
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to send reset email";
          set({
            isLoading: false,
            error: errorMessage,
          });
          toast.error(errorMessage);
          throw error;
        }
      },

      resetPassword: async (data: ResetPasswordRequest) => {
        try {
          set({ isLoading: true, error: null });

          console.log('🔐 AuthStore - Starting password reset');
          console.log('🌐 AuthStore - Token:', data.token);

          const response = await authApi.resetPassword(data);

          console.log('✅ AuthStore - Password reset API response:', response);

          if (response.success) {
            set({ isLoading: false, error: null });
            toast.success("Password reset successful!");
          } else {
            throw new Error(response.message || "Password reset failed");
          }
        } catch (error: any) {
          console.error('❌ AuthStore - Password reset error:', error);

          let errorMessage = "Password reset failed";

          // Handle different error scenarios
          if (error.response?.status === 400) {
            errorMessage = error.response?.data?.message || error.response?.data?.error || 'Invalid or expired reset token.';
          } else if (error.response?.status === 404) {
            errorMessage = 'Reset token not found. Please request a new password reset.';
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.message) {
            errorMessage = error.message;
          }

          set({
            isLoading: false,
            error: errorMessage,
          });

          // Don't show toast here as component will handle the error display
          console.error('❌ AuthStore - Final error message:', errorMessage);
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
