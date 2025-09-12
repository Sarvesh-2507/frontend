// User API service for fetching user information
const USER_API_BASE_URL = 'http://192.168.1.132:8000';

// User information interface based on the API response
export interface UserInfo {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  access_level: {
    value: string;
    label: string;
  };
  role: {
    id: number;
    name: string;
    description: string;
  };
  organization: {
    id: number;
    name: string;
  };
  department: {
    id: number;
    name: string;
  };
  is_active: boolean;
  date_joined: string;
}

// User API functions
export const userAPI = {
  // Get current user's information
  getCurrentUser: async (): Promise<UserInfo> => {
    console.log('🔄 Fetching current user information...');
    try {
      const response = await fetch(`${USER_API_BASE_URL}/api/users/me/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Current user information fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching current user information:', error);
      throw error;
    }
  },
};

export default userAPI;
