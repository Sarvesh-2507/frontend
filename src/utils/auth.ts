import { useNavigate } from 'react-router-dom';

/**
 * Utility function to get the current authenticated user
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

/**
 * Utility function to get the auth token
 */
export const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Utility function to get the refresh token
 */
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

/**
 * Utility function to set auth tokens
 */
export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

/**
 * Utility function to refresh the access token
 */
export const refreshAuthToken = async (): Promise<boolean> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.error('No refresh token available');
      return false;
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.access) {
      localStorage.setItem('accessToken', data.access);
      // If a new refresh token is provided, update it too
      if (data.refresh) {
        localStorage.setItem('refreshToken', data.refresh);
      }
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

/**
 * Utility function to check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
};

/**
 * Utility function to get auth headers for API calls with auto token refresh
 */
export const getAuthHeaders = async (): Promise<{ [key: string]: string }> => {
  let token = getAuthToken();
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  };
  
  // If no token, try to refresh
  if (!token) {
    const refreshSuccess = await refreshAuthToken();
    if (refreshSuccess) {
      token = getAuthToken();
    }
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Enhanced API call with automatic token refresh
 */
export const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const headers = await getAuthHeaders();
  
  let response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  // If unauthorized, try to refresh token and retry
  if (response.status === 401) {
    const refreshSuccess = await refreshAuthToken();
    if (refreshSuccess) {
      const newHeaders = await getAuthHeaders();
      response = await fetch(url, {
        ...options,
        headers: {
          ...newHeaders,
          ...options.headers,
        },
      });
    }
  }

  return response;
};

/**
 * Hook to redirect to login if not authenticated
 */
export const useAuthCheck = () => {
  const navigate = useNavigate();
  
  const checkAuth = () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return false;
    }
    return true;
  };
  
  return checkAuth;
};

/**
 * Get user ID for API calls
 */
export const getUserId = (): number | null => {
  const user = getCurrentUser();
  if (!user) return null;
  
  // Handle different possible user ID field names
  return parseInt(user.id) || parseInt(user.employee_id) || parseInt(user.userId) || null;
};
