import { Profile, ProfileApiResponse } from '../types/profile';
import { getApiUrl } from '../config';
import axios from 'axios';

const API_BASE_URL = getApiUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || localStorage.getItem('authToken');
  
  console.log('Available tokens in localStorage:', {
    accessToken: localStorage.getItem('accessToken') ? 'Present' : 'Missing',
    token: localStorage.getItem('token') ? 'Present' : 'Missing',
    authToken: localStorage.getItem('authToken') ? 'Present' : 'Missing',
    selectedToken: token ? 'Present' : 'Missing'
  });
  
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const profileApi = {
  // Get current user's profile
  getMyProfile: async (): Promise<Profile> => {
    // Try multiple endpoint patterns
    const endpoints = [
      '/profiles/profiles/me/',
      '/profiles/me/',
      '/profile/me/',
      '/profiles/profiles/',
      '/profiles/',
      '/profile/',
    ];
    
    let lastError: Error | null = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log('Trying API endpoint:', `${API_BASE_URL}${endpoint}`);
        
        const headers = getAuthHeaders();
        console.log('Request headers:', headers);
        
        const response = await api.get(endpoint, { headers });

        console.log(`Response status for ${endpoint}:`, response.status);
        console.log('Response data:', response.data);

        // Handle different response formats
        if (response.data) {
          // If it's a direct profile object
          if (response.data.first_name || response.data.emp_id) {
            console.log('Successfully fetched profile from:', endpoint);
            return response.data;
          }
          
          // If it's a paginated response with results
          if (response.data.results && response.data.results.length > 0) {
            console.log('Successfully fetched profile from:', endpoint);
            return response.data.results[0];
          }
          
          // If it's an array and we want the first item
          if (Array.isArray(response.data) && response.data.length > 0) {
            console.log('Successfully fetched profile from:', endpoint);
            return response.data[0];
          }
        }
        
        lastError = new Error('No profile found in API response');
        continue; // Try next endpoint
      } catch (error) {
        console.error(`Error with endpoint ${endpoint}:`, error);
        
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            lastError = new Error(`Endpoint not found: ${endpoint}`);
          } else if (error.response?.status === 401) {
            lastError = new Error('Authentication failed. Please log in again.');
          } else if (error.response?.status === 403) {
            lastError = new Error('Access denied. You may not have permission to view this profile.');
          } else {
            lastError = new Error(`HTTP ${error.response?.status}: ${error.response?.statusText}`);
          }
        } else {
          lastError = error instanceof Error ? error : new Error('Unknown error');
        }
        continue; // Try next endpoint
      }
    }
    
    // If all endpoints failed
    console.error('All endpoints failed. Last error:', lastError);
    throw lastError || new Error('Failed to fetch profile from all available endpoints');
  },

  // Update current user's profile
  updateMyProfile: async (profileData: Partial<Profile>): Promise<Profile> => {
    try {
      const headers = getAuthHeaders();
      const response = await api.patch('/profiles/profiles/me/', profileData, { headers });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Try alternative endpoint
        const response = await api.patch('/profiles/me/', profileData, { headers: getAuthHeaders() });
        return response.data;
      }
      throw error;
    }
  },

  // Upload profile photo
  uploadProfilePhoto: async (file: File): Promise<{ passport_photo: string }> => {
    try {
      const formData = new FormData();
      formData.append('passport_photo', file);

      const token = localStorage.getItem('accessToken');
      const response = await api.patch('/profiles/profiles/me/', formData, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          // Don't set Content-Type for FormData, let axios handle it
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Try alternative endpoint
        const formData = new FormData();
        formData.append('passport_photo', file);
        const token = localStorage.getItem('accessToken');
        const response = await api.patch('/profiles/me/', formData, {
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        });
        return response.data;
      }
      throw error;
    }
  },
};
