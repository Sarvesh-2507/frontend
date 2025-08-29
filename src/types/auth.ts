export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: "admin" | "employee" | "hr";
  firstName?: string;
  lastName?: string;
  avatar?: string;
  department?: string;
  position?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
  organization: number;
  role: number;
  access_level: string;
  designation: string;
  date_of_joining: string;
  work_location: string;
  employment_type: string;
  department_ref?: number;
  reporting_manager?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user?: User;
  tokens?: AuthTokens;
  message?: string;
  // Support different backend response formats
  access_token?: string;
  access?: string;
  refresh_token?: string;
  refresh?: string;
  token?: string;
  // Allow any additional properties from backend
  [key: string]: any;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  checkSession: () => Promise<boolean>;
}

export type AuthStore = AuthState & AuthActions;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
