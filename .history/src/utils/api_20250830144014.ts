import type {
  ApiResponse,
  AuthResponse,
  AuthTokens,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordRequest,
} from "../types/auth";

// API Configuration
// Use mock authentication for development
const USE_MOCK = true; // Force use mock for now to avoid 404 errors
const API_BASE_URL = USE_MOCK
  ? "http://localhost:3003/api" // Mock server for development
  : "http://192.168.1.118:3000"; // Your actual backend (when ready)

console.log("🔧 API Configuration:");
console.log("VITE_USE_MOCK:", import.meta.env.VITE_USE_MOCK);
console.log("USE_MOCK:", USE_MOCK);
console.log("API_BASE_URL:", API_BASE_URL);
console.log("Timestamp:", new Date().toISOString());

// Test API connection immediately
fetch(`${API_BASE_URL}/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "test", password: "test" }),
})
  .then((response) => {
    console.log("🌐 API Connection Test - Status:", response.status);
    console.log("🌐 API Connection Test - URL:", response.url);
  })
  .catch((error) => {
    console.error("❌ API Connection Test Failed:", error);
  });

// Create a custom fetch wrapper with error handling
const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Debug: Log the exact URL being called
  console.log("🌐 Utils API Request - Full URL:", url);
  console.log("🌐 Utils API Request - Base URL:", API_BASE_URL);
  console.log("🌐 Utils API Request - Endpoint:", endpoint);

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token exists
  const token = localStorage.getItem("accessToken");
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw {
        message:
          data.detail ||
          data.error ||
          data.message ||
          `HTTP error! status: ${response.status}`,
        status: response.status,
        errors: data.errors,
        response: {
          data,
          status: response.status,
        },
      };
    }

    return {
      success: true,
      data,
      message: data.message,
    };
  } catch (error: any) {
    console.error("API Request Error:", error);

    if (error.response) {
      // Server responded with error
      return {
        success: false,
        message: error.message,
        errors: error.errors,
      };
    } else {
      // Network or other error
      return {
        success: false,
        message: error.message || "Network error occurred",
      };
    }
  }
};

export const authApi = {
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponse>> => {
    console.log("🔐 Login attempt:", credentials.email);
    console.log("🌐 Using API URL:", `${API_BASE_URL}/login`);

    // Mock authentication for development
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock user data
          const mockUsers = [
            { email: "easwar86@yahoo.com", password: "password", name: "Easwar" },
            { email: "admin@company.com", password: "admin123", name: "Admin User" },
            { email: "test@example.com", password: "test123", name: "Test User" },
            { email: "user@demo.com", password: "demo", name: "Demo User" }
          ];

          const user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);

          if (user) {
            // Generate mock JWT token
            const mockToken = btoa(JSON.stringify({
              sub: "1",
              email: user.email,
              name: user.name,
              iat: Date.now() / 1000,
              exp: (Date.now() / 1000) + (24 * 60 * 60) // 24 hours
            }));

            resolve({
              success: true,
              data: {
                user: {
                  id: "1",
                  email: user.email,
                  username: user.name,
                  firstName: user.name.split(' ')[0],
                  lastName: user.name.split(' ')[1] || '',
                  role: "employee",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
                tokens: {
                  access: mockToken,
                  refresh: mockToken + "_refresh"
                }
              },
              message: "Login successful"
            });
          } else {
            resolve({
              success: false,
              message: "Invalid email or password",
              errors: null
            });
          }
        }, 1000); // Simulate network delay
      });
    }

    // Real API call (when USE_MOCK is false)
    const result = await apiRequest<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    console.log("📝 Login result:", result);
    return result;
  },

  register: async (
    credentials: RegisterCredentials
  ): Promise<ApiResponse<any>> => {
    // Backend expects the new registration format
    const requestBody: any = {
      email: credentials.email,
      username: credentials.username || credentials.email.split("@")[0], // Use email prefix if no username
      password: credentials.password,
      confirm_password: credentials.confirm_password,
    };

    // Include organization if provided
    if (credentials.organization) {
      requestBody.organization = credentials.organization;
    }

    // Include department_ref if provided
    if (credentials.department_ref) {
      requestBody.department_ref = credentials.department_ref;
    }

    // Include role if provided
    if (credentials.role) {
      requestBody.role = credentials.role;
    }

    // Include all other required fields
    if (credentials.access_level) {
      requestBody.access_level = credentials.access_level;
    }

    if (credentials.designation) {
      requestBody.designation = credentials.designation;
    }

    if (credentials.date_of_joining) {
      requestBody.date_of_joining = credentials.date_of_joining;
    }

    if (credentials.work_location) {
      requestBody.work_location = credentials.work_location;
    }

    if (credentials.employment_type) {
      requestBody.employment_type = credentials.employment_type;
    }

    if (credentials.reporting_manager) {
      requestBody.reporting_manager = credentials.reporting_manager;
    }

    console.log("📝 Register API - Request body:", requestBody);

    return apiRequest("/register/", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
  },

  logout: async (refreshToken?: string): Promise<ApiResponse<any>> => {
    console.log(
      "🚪 API - Making logout request to:",
      `${API_BASE_URL}/logout/`
    );
    console.log(
      "🔑 API - Refresh token:",
      refreshToken ? "Present" : "Missing"
    );

    // Get access token for authorization
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const accessToken =
      currentUser.access_token ||
      currentUser.token ||
      currentUser.access ||
      currentUser.authToken ||
      currentUser.jwt ||
      currentUser.bearer_token ||
      localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API_BASE_URL}/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: "Bearer " + accessToken }),
        },
        body: JSON.stringify({
          refresh:
            refreshToken ||
            currentUser.refresh_token ||
            localStorage.getItem("refreshToken"),
        }),
      });

      console.log("📊 Logout response status:", response.status);

      const data = await response.json();
      console.log("📥 Logout response data:", data);

      if (!response.ok) {
        console.warn("⚠️ Logout API failed, but continuing with local cleanup");
        // Don't throw error - we still want to clear local storage
      }

      return {
        success: true,
        data,
        message: data.message || "Logged out successfully",
      };
    } catch (error: any) {
      console.error("❌ Logout API error:", error);
      console.warn("⚠️ Logout API failed, but continuing with local cleanup");
      // Don't throw error - we still want to clear local storage
      return {
        success: true,
        data: null,
        message: "Logged out locally",
      };
    }
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<ApiResponse<AuthTokens>> => {
    // Backend expects: { "refresh": "string" }
    return apiRequest<AuthTokens>("/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    });
  },

  forgotPassword: async (email: string): Promise<ApiResponse<any>> => {
    return apiRequest("/forgot-password/", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<ApiResponse<any>> => {
    console.log('=== API REQUEST DEBUG ===');
    console.log('Reset password token:', data.token);
    console.log('API endpoint:', `/reset-password/${data.token}/`);
    console.log('Request data:', { password: data.password });
    console.log('========================');

    return apiRequest(`/reset-password/${data.token}/`, {
      method: "POST",
      body: JSON.stringify({ password: data.password }),
    });
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<any>> => {
    return apiRequest("/profile/");
  },
  
  // Get current user info (with authorization)
  getCurrentUser: async (): Promise<ApiResponse<any>> => {
    return apiRequest("/user/me/");
  },

  // Update user profile
  updateProfile: async (data: any): Promise<ApiResponse<any>> => {
    return apiRequest("/profile/", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Change password - now using direct fetch for better control
  changePassword: async (data: {
    current_password: string;
    new_password: string;
    confirm_password?: string;
  }): Promise<ApiResponse<any>> => {
    console.log(
      "🔐 API - Making change password request to:",
      `${API_BASE_URL}/change-password/`
    );
    console.log("📤 API - Request body:", JSON.stringify(data));

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const accessToken =
      currentUser.access_token ||
      currentUser.token ||
      currentUser.access ||
      currentUser.authToken ||
      currentUser.jwt ||
      currentUser.bearer_token ||
      localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("Authentication token not found. Please login again.");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({
          current_password: data.current_password,
          new_password: data.new_password,
          confirm_password: data.confirm_password || data.new_password,
        }),
      });

      const responseData = await response.json();
      console.log("✅ API - Change password response:", responseData);

      if (!response.ok) {
        // Handle different types of error responses
        let errorMessage = "Failed to change password";
        if (responseData.error) {
          errorMessage = responseData.error;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.current_password) {
          errorMessage = Array.isArray(responseData.current_password)
            ? responseData.current_password[0]
            : responseData.current_password;
        } else if (responseData.new_password) {
          errorMessage = Array.isArray(responseData.new_password)
            ? responseData.new_password[0]
            : responseData.new_password;
        } else {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return {
        success: true,
        data: responseData,
        message:
          responseData.success ||
          responseData.message ||
          "Password changed successfully!",
      };
    } catch (error: any) {
      console.error("❌ API - Change password error:", error);
      throw error;
    }
  },
};

// Dashboard API functions
export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<any>> => {
    return apiRequest("/dashboard/stats/");
  },

  getEmployees: async (params?: any): Promise<ApiResponse<any>> => {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return apiRequest(`/employees/${queryString}`);
  },

  getLeaveRequests: async (params?: any): Promise<ApiResponse<any>> => {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return apiRequest(`/leave-requests/${queryString}`);
  },

  getHolidays: async (): Promise<ApiResponse<any>> => {
    return apiRequest("/holidays/");
  },

  getNotifications: async (): Promise<ApiResponse<any>> => {
    return apiRequest("/notifications/");
  },
  
  getCurrentUser: async (): Promise<ApiResponse<any>> => {
    return apiRequest("/user/me/");
  },
};

// Track if we're currently refreshing to prevent infinite loops
let isRefreshingToken = false;
let refreshPromise: Promise<any> | null = null;

// Utility function to handle token refresh automatically
export const setupApiInterceptors = (refreshTokenCallback: () => Promise<void>) => {
  // Store original fetch
  const originalFetch = window.fetch;
  
  // Override fetch with our version that handles 401s
  window.fetch = async function(input, init) {
    // Call original fetch
    const response = await originalFetch(input, init);
    
    // If response is 401 Unauthorized and we're not already refreshing
    if (response.status === 401 && !isRefreshingToken) {
      try {
        console.log("🔄 API Interceptor - 401 detected, attempting token refresh");
        
        // Set flag to prevent multiple refresh attempts
        isRefreshingToken = true;
        
        // Only create one refresh promise if multiple requests fail at once
        if (!refreshPromise) {
          refreshPromise = refreshTokenCallback();
        }
        
        // Wait for token refresh
        await refreshPromise;
        
        // Clear refresh promise after it completes
        refreshPromise = null;
        
        // Get updated access token
        const newToken = localStorage.getItem("accessToken");
        
        // Clone the original request with the new token
        const newInit = {
          ...init,
          headers: {
            ...(init?.headers || {}),
            Authorization: `Bearer ${newToken}`
          }
        };
        
        console.log("🔄 API Interceptor - Retrying request with new token");
        
        // Retry the request with new token
        return originalFetch(input, newInit);
      } catch (error) {
        console.error("🔄 API Interceptor - Token refresh failed:", error);
        // Still return the original 401 response if refresh failed
        return response;
      } finally {
        isRefreshingToken = false;
      }
    }
    
    // Return original response for non-401 responses
    return response;
  };
};
