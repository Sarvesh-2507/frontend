import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';
import { User, LoginCredentials, RegisterCredentials } from '../../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initialize state from localStorage
const getInitialUser = () => {
  try {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getInitialUser(),
  token: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken') && !!getInitialUser(),
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      console.log('🔐 Auth Slice - Starting login request');
      const response = await authAPI.login(credentials);
      console.log('📥 Auth Slice - Login response:', response.data);

      // Handle different response structures
      const data = response.data.data || response.data;
      console.log('📦 Auth Slice - Processed data:', data);

      // Add the email from credentials to the response for user creation
      return {
        ...data,
        loginEmail: credentials.email
      };
    } catch (error: any) {
      console.error('❌ Auth Slice - Login error:', error);
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.message ||
                          'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      console.log('🚪 Redux - Starting logout process...');
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.refreshToken || localStorage.getItem('refreshToken');

      console.log('🔑 Redux - Refresh token available:', !!refreshToken);

      if (refreshToken) {
        console.log('📡 Redux - Calling logout API...');
        const response = await authAPI.logout(refreshToken);
        console.log('✅ Redux - Logout API response:', response.status);
      } else {
        console.log('⚠️ Redux - No refresh token found, skipping API call');
      }

      console.log('✅ Redux - Logout process completed');
      return null;
    } catch (error: any) {
      console.error('❌ Redux - Logout API error:', error.response?.data || error.message);
      console.log('🧹 Redux - Continuing with local cleanup despite API error');
      // Don't reject - we still want to clear local state even if API fails
      return null;
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data: { current_password: string; new_password: string; confirm_password?: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.changePassword(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; refreshToken?: string }>) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken || null;
      state.isAuthenticated = true;
      state.error = null;
      
      // Store in localStorage
      localStorage.setItem('accessToken', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('currentUser', JSON.stringify(user));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('✅ Auth Slice - Login fulfilled with payload:', action.payload);

        state.isLoading = false;
        state.error = null;

        // Handle the payload structure
        const payload = action.payload;

        // Extract tokens from payload
        state.token = payload.access_token || payload.token || payload.access;
        state.refreshToken = payload.refresh_token || payload.refresh;

        // If no user object is provided, create a basic one from the email used in login
        if (payload.user) {
          state.user = payload.user;
        } else {
          // Create a basic user object using the email from login credentials
          const email = payload.loginEmail || 'user@example.com';
          state.user = {
            id: 'user-' + Date.now(),
            email: email,
            username: email.split('@')[0],
            name: email.split('@')[0],
            role: 'employee',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }

        state.isAuthenticated = true;

        console.log('👤 Auth Slice - User set:', state.user);
        console.log('🔑 Auth Slice - Token set:', state.token ? 'Present' : 'Missing');

        // Store in localStorage
        if (state.token) {
          localStorage.setItem('accessToken', state.token);
          console.log('💾 Auth Slice - Token stored in localStorage');
        }
        if (state.refreshToken) {
          localStorage.setItem('refreshToken', state.refreshToken);
          console.log('💾 Auth Slice - Refresh token stored in localStorage');
        }
        if (state.user) {
          localStorage.setItem('currentUser', JSON.stringify(state.user));
          console.log('💾 Auth Slice - User stored in localStorage');
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        
        // Clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        // Still clear credentials even if logout API fails
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
      })
      
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
