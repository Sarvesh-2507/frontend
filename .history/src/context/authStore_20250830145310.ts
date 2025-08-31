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

// JWT token validation helper
const isTokenValid = (token: string): boolean => {
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (payload.exp && payload.iat) {
      return payload.exp > currentTime;
    }
    
    // If no expiration time, consider it valid for now
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

// Token storage helpers
const getStoredTokens = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  return { accessToken, refreshToken };
};

const setStoredTokens = (accessToken: string, refreshToken?: string) => {
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

const clearStoredTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Session check function to validate token on route change
      checkSession: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // First check for tokens in localStorage
          const { accessToken, refreshToken } = getStoredTokens();
          
          if (!accessToken) {
            set({ 
              isAuthenticated: false, 
              isLoading: false, 
              user: null, 
              tokens: null 
            });
            return false;
          }

          // Validate the token format and expiration
          if (accessToken && isTokenValid(accessToken)) {
            set({ 
              tokens: { access: accessToken, refresh: refreshToken || "" },
              isAuthenticated: true,
              isLoading: false 
            });
            return true;
          }

          // If no valid token found, logout
          set({ 
            isAuthenticated: false, 
            isLoading: false, 
            user: null, 
            tokens: null 
          });
          return false;

        } catch (error) {
          console.error("Session check error:", error);
          set({ 
            isLoading: false, 
            isAuthenticated: false,
            error: "Session validation failed"
          });
          return false;
        }
      },

      // Actions
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });

          console.log("🔐 Auth Store - Attempting login for:", credentials.email);

          const response = await authApi.login(credentials);
          console.log("📥 Auth Store - Login API Response:", response);

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

          // Try to logout from backend API if we have a refresh token
          if (tokens?.refresh) {
            try {
              console.log("📡 Auth Store - Calling logout API...");
              await authApi.logout(tokens.refresh);
              console.log("✅ Auth Store - Logout API call successful");
            } catch (apiError) {
              console.error("❌ Auth Store - Logout API error:", apiError);
              // Continue with cleanup even if API call fails
            }
          }

        } catch (error) {
          console.error("❌ Auth Store - Logout error:", error);
        } finally {
          // Clear state and storage regardless of API call success
          console.log("🧹 Auth Store - Clearing local state and storage");

          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          // Clear all auth-related localStorage
          clearStoredTokens();
          
          // Clear Zustand persist storage
          localStorage.removeItem("auth-store");
          
          console.log("✅ Auth Store - Logout process completed");
          toast.success("Logged out successfully");
        }
      },

      refreshToken: async () => {
        try {
          const { tokens } = get();

          if (!tokens?.refresh) {
            // Try to get refresh token from localStorage as fallback
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }
            
            // Update state with token from localStorage
            set({ 
              tokens: { 
                access: localStorage.getItem("accessToken") || "", 
                refresh: refreshToken 
              } 
            });
            
            const response = await authApi.refreshToken(refreshToken);
            
            if (response.success && response.data) {
              const newTokens = response.data;

              set({ tokens: newTokens });

              // Update localStorage
              localStorage.setItem("accessToken", newTokens.access);
              localStorage.setItem("refreshToken", newTokens.refresh);
              
              console.log("✅ Auth Store - Token refresh successful");
              return true;
            } else {
              throw new Error("Token refresh failed");
            }
          } else {
            const response = await authApi.refreshToken(tokens.refresh);

            if (response.success && response.data) {
              const newTokens = response.data;

              set({ tokens: newTokens });

              // Update localStorage
              localStorage.setItem("accessToken", newTokens.access);
              localStorage.setItem("refreshToken", newTokens.refresh);
              
              console.log("✅ Auth Store - Token refresh successful");
              return true;
            } else {
              throw new Error("Token refresh failed");
            }
          }
        } catch (error) {
          console.error("Token refresh error:", error);
          // Don't automatically logout on refresh failure
          // Instead, let the component handle the 401 error gracefully
          return false;
        }
      },

      forgotPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });

          // Debug: Show exact API call details
          console.log(
            "📧 Auth Store - Making forgot password API call to backend"
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
