import axios, { AxiosError, AxiosResponse } from "axios";
import { EmployeeProfile } from "../store/slices/employeeSlice";
import { LoginCredentials, RegisterCredentials, User } from "../types/auth";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_USE_MOCK !== "false"
    ? "http://localhost:3002/api"
    : "http://192.168.1.132:8000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // Ensure trailing slashes are preserved for Django compatibility
  transformRequest: [
    function (data, headers) {
      return data;
    },
  ],
});

// Request interceptor to add auth token and debug URLs
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug: Log the exact URL being called
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log("🌐 Axios Request - Full URL:", fullUrl);
    console.log("🌐 Axios Request - Base URL:", config.baseURL);
    console.log("🌐 Axios Request - Endpoint:", config.url);

    // Ensure trailing slash for Django compatibility
    if (config.url && !config.url.endsWith("/") && !config.url.includes("?")) {
      config.url = config.url + "/";
      console.log(
        "🔧 Axios Request - Added trailing slash, new URL:",
        config.url
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/refresh/`, {
            refresh: refreshToken,
          });

          const { access_token } = response.data;
          localStorage.setItem("accessToken", access_token);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// API Response Types
interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AxiosResponse<any>> => {
    const loginUrl = `${API_BASE_URL}/login/`;
    console.log("🔐 API - Making login request to:", loginUrl);
    console.log("📤 API - Login credentials:", {
      email: credentials.email,
      password: "[HIDDEN]",
    });

    try {
      // Use direct fetch to ensure URL is exactly what we want
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log("📥 API - Login response status:", response.status);
      console.log("📥 API - Login response data:", data);

      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: data,
          },
        };
      }

      // Return in axios format for compatibility
      return {
        data: data,
        status: response.status,
        statusText: response.statusText,
        headers: {},
        config: {},
        request: {},
      } as AxiosResponse<any>;
    } catch (error: any) {
      console.error(
        "❌ API - Login error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  register: async (
    credentials: RegisterCredentials
  ): Promise<
    AxiosResponse<
      ApiResponse<{
        user: User;
        message: string;
      }>
    >
  > => {
    // Try different backend URLs - update this to match your actual backend
    const registerUrl = "http://127.0.0.1:8000/api/register/"; // Try localhost first
    console.log("📝 API - Making register request to:", registerUrl);
    console.log(
      "📝 API - Register credentials:",
      JSON.stringify(credentials, null, 2)
    );

    try {
      // Use direct fetch to ensure URL is exactly what we want
      const response = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log("📥 API - Register response status:", response.status);
      console.log(
        "📥 API - Register response headers:",
        Object.fromEntries(response.headers.entries())
      );

      let data;
      try {
        data = await response.json();
        console.log(
          "📥 API - Register response data:",
          JSON.stringify(data, null, 2)
        );
      } catch (jsonError) {
        console.error("❌ API - Failed to parse response as JSON:", jsonError);
        const textData = await response.text();
        console.log("📥 API - Register response text:", textData);
        data = { error: "Invalid JSON response", text: textData };
      }

      if (!response.ok) {
        console.error("❌ API - Register failed with status:", response.status);
        console.error("❌ API - Register error data:", data);
        throw {
          response: {
            status: response.status,
            data: data,
          },
          message: `Registration failed with status ${response.status}`,
        };
      }

      // Return in axios format for compatibility
      return {
        data: data,
        status: response.status,
        statusText: response.statusText,
        headers: {},
        config: {},
        request: {},
      } as AxiosResponse<
        ApiResponse<{
          user: User;
          message: string;
        }>
      >;
    } catch (error: any) {
      console.error(
        "❌ API - Register error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  logout: async (refreshToken: string): Promise<AxiosResponse<ApiResponse>> => {
    console.log(
      "🚪 API - Making logout request to:",
      `http://192.168.1.132:8000/api/logout/`
    );
    // Use the specific logout endpoint
    return axios.post(
      "http://192.168.1.132:8000/api/logout/",
      { refresh: refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
  },

  forgotPassword: async (
    email: string
  ): Promise<AxiosResponse<ApiResponse>> => {
    console.log(
      "📧 API - Making forgot password request to:",
      `${API_BASE_URL}/forgot-password/`
    );
    return apiClient.post("/forgot-password/", { email });
  },

  changePassword: async (data: {
    current_password: string;
    new_password: string;
    confirm_password?: string;
  }): Promise<AxiosResponse<ApiResponse>> => {
    console.log(
      "🔐 API - Making change password request to:",
      `${API_BASE_URL}/change-password/`
    );
    return apiClient.post("/change-password/", data);
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<
    AxiosResponse<
      ApiResponse<{
        access_token: string;
        refresh_token?: string;
      }>
    >
  > => {
    return apiClient.post("/refresh/", { refresh: refreshToken });
  },
};

// Employee API
export const employeeAPI = {
  getProfile: async (
    employeeId?: string
  ): Promise<AxiosResponse<ApiResponse<EmployeeProfile>>> => {
    const endpoint = employeeId ? `/employees/${employeeId}/` : "/profile/";
    console.log(
      "👤 API - Making get profile request to:",
      `${API_BASE_URL}${endpoint}`
    );
    return apiClient.get(endpoint);
  },

  updateProfile: async (
    data: Partial<EmployeeProfile>
  ): Promise<AxiosResponse<ApiResponse<EmployeeProfile>>> => {
    console.log(
      "✏️ API - Making update profile request to:",
      `${API_BASE_URL}/profile/`
    );
    return apiClient.patch("/profile/", data);
  },

  uploadPhoto: async (
    file: File
  ): Promise<AxiosResponse<ApiResponse<{ avatar: string }>>> => {
    const formData = new FormData();
    formData.append("avatar", file);

    console.log(
      "📸 API - Making upload photo request to:",
      `${API_BASE_URL}/profile/photo/`
    );
    return apiClient.post("/profile/photo/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateStatus: async (
    status: string
  ): Promise<AxiosResponse<ApiResponse<{ status: string }>>> => {
    console.log(
      "🟢 API - Making update status request to:",
      `${API_BASE_URL}/profile/status/`
    );
    return apiClient.patch("/profile/status/", { status });
  },

  getEmployees: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
  }): Promise<
    AxiosResponse<
      ApiResponse<{
        employees: EmployeeProfile[];
        total: number;
        page: number;
        totalPages: number;
      }>
    >
  > => {
    console.log(
      "👥 API - Making get employees request to:",
      `${API_BASE_URL}/employees/`
    );
    return apiClient.get("/employees/", { params });
  },

  getAttendance: async (
    employeeId?: string,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<AxiosResponse<ApiResponse<any>>> => {
    const endpoint = employeeId
      ? `/employees/${employeeId}/attendance/`
      : "/attendance/";
    return apiClient.get(endpoint, { params });
  },

  getLeaveRequests: async (
    employeeId?: string
  ): Promise<AxiosResponse<ApiResponse<any>>> => {
    const endpoint = employeeId ? `/employees/${employeeId}/leave/` : "/leave/";
    return apiClient.get(endpoint);
  },

  getPayroll: async (
    employeeId?: string,
    params?: {
      month?: string;
      year?: string;
    }
  ): Promise<AxiosResponse<ApiResponse<any>>> => {
    const endpoint = employeeId
      ? `/employees/${employeeId}/payroll/`
      : "/payroll/";
    return apiClient.get(endpoint, { params });
  },

  getPerformance: async (
    employeeId?: string
  ): Promise<AxiosResponse<ApiResponse<any>>> => {
    const endpoint = employeeId
      ? `/employees/${employeeId}/performance/`
      : "/performance/";
    return apiClient.get(endpoint);
  },

  uploadDocument: async (
    file: File,
    type: string
  ): Promise<AxiosResponse<ApiResponse<any>>> => {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("type", type);

    return apiClient.post("/documents/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<AxiosResponse<ApiResponse<any>>> => {
    return apiClient.get("/dashboard/stats/");
  },

  getRecentActivities: async (): Promise<AxiosResponse<ApiResponse<any>>> => {
    return apiClient.get("/dashboard/activities/");
  },

  getNotifications: async (): Promise<AxiosResponse<ApiResponse<any>>> => {
    return apiClient.get("/notifications/");
  },
};

// Export the configured axios instance for custom requests
export default apiClient;
