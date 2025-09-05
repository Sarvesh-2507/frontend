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
 * Utility function to check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
};

/**
 * Utility function to get auth headers for API calls
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
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
