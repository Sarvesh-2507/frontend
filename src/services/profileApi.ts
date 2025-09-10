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
    try {
      const headers = getAuthHeaders();
      const response = await api.get('/profiles/profiles/me', { headers });
      if (response.data) {
        return response.data;
      } else {
        throw new Error('No profile data received');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
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
