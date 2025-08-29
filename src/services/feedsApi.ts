import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_USE_MOCK !== "false"
  ? "http://localhost:3002/api"
  : "http://192.168.1.132:8000/api";

// Types
export interface Author {
  name: string;
  avatar?: string;
  department: string;
  id: string;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  image?: string | null;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tags?: string[];
  type?: string;
}

export interface FeedsResponse {
  success: boolean;
  data: Post[];
  message?: string;
}

// Common headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
});

export const feedsAPI = {
  // Get all company feeds with optional filters
  getCompanyFeeds: async (
    filters?: { 
      department?: string; 
      type?: string; 
      search?: string;
    }
  ): Promise<FeedsResponse> => {
    try {
      let url = `${API_BASE_URL}/company-feeds`;
      
      if (filters) {
        const params = new URLSearchParams();
        if (filters.department) params.append('department', filters.department);
        if (filters.type) params.append('type', filters.type);
        if (filters.search) params.append('search', filters.search);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }
      
      const response = await axios.get(url, {
        headers: getAuthHeaders(),
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching company feeds:', error);
      throw error;
    }
  },
  
  // Like a post (in a real app, this would update on the server)
  likePost: async (postId: string): Promise<boolean> => {
    try {
      // In a real implementation, you would make an API call like:
      // const response = await axios.post(`${API_BASE_URL}/company-feeds/${postId}/like`, {}, {
      //   headers: getAuthHeaders(),
      // });
      // return response.data.success;
      
      // For now, we're just simulating a successful response
      return true;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },
  
  // Bookmark a post (in a real app, this would update on the server)
  bookmarkPost: async (postId: string): Promise<boolean> => {
    try {
      // In a real implementation, you would make an API call like:
      // const response = await axios.post(`${API_BASE_URL}/company-feeds/${postId}/bookmark`, {}, {
      //   headers: getAuthHeaders(),
      // });
      // return response.data.success;
      
      // For now, we're just simulating a successful response
      return true;
    } catch (error) {
      console.error('Error bookmarking post:', error);
      throw error;
    }
  },
  
  // Create a new post (would be implemented in a real app)
  createPost: async (postData: Omit<Post, 'id' | 'likes' | 'comments' | 'isLiked' | 'isBookmarked' | 'timestamp'>): Promise<Post> => {
    try {
      // In a real implementation, you would make an API call like:
      // const response = await axios.post(`${API_BASE_URL}/company-feeds`, postData, {
      //   headers: getAuthHeaders(),
      // });
      // return response.data.data;
      
      // For now, we're just simulating a successful response
      return {
        id: Date.now().toString(),
        author: postData.author,
        content: postData.content,
        image: postData.image,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        isLiked: false,
        isBookmarked: false,
        tags: postData.tags,
        type: postData.type
      };
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }
};
