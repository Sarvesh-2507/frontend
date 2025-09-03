// Environment configuration utility
// Centralizes all environment variables and provides type safety

interface ApiConfig {
  baseUrl: string;
  mockUrl: string;
  backendUrl: string;
  localhostUrl: string;
  useMock: boolean;
}

class Config {
  private static instance: Config;
  
  public readonly api: ApiConfig;

  private constructor() {
    // Initialize API configuration from environment variables
    this.api = {
      baseUrl: this.getApiBaseUrl(),
      mockUrl: import.meta.env.VITE_MOCK_API_URL || 'http://localhost:3002/api',
      backendUrl: import.meta.env.VITE_BACKEND_API_URL || 'http://192.168.1.132:8000/api',
      localhostUrl: import.meta.env.VITE_LOCALHOST_API_URL || 'http://127.0.0.1:8000',
      useMock: import.meta.env.VITE_USE_MOCK === 'true'
    };
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  private getApiBaseUrl(): string {
    // Determine the correct API base URL based on environment
    const useMock = import.meta.env.VITE_USE_MOCK === 'true';
    
    if (useMock) {
      return import.meta.env.VITE_MOCK_API_URL || 'http://localhost:3002/api';
    }

    // Use environment-specific URL or fallback to default
    return import.meta.env.VITE_API_BASE_URL || 
           import.meta.env.VITE_BACKEND_API_URL || 
           'http://192.168.1.132:8000/api';
  }

  // Helper methods for specific endpoints
  public getApiUrl(endpoint: string = ''): string {
    const baseUrl = this.api.baseUrl;
    return endpoint ? `${baseUrl}/${endpoint}`.replace(/\/+/g, '/').replace(':/', '://') : baseUrl;
  }

  public getBackendUrl(endpoint: string = ''): string {
    const baseUrl = this.api.backendUrl;
    return endpoint ? `${baseUrl}/${endpoint}`.replace(/\/+/g, '/').replace(':/', '://') : baseUrl;
  }

  public getMockUrl(endpoint: string = ''): string {
    const baseUrl = this.api.mockUrl;
    return endpoint ? `${baseUrl}/${endpoint}`.replace(/\/+/g, '/').replace(':/', '://') : baseUrl;
  }
}

// Export singleton instance
export const config = Config.getInstance();

// Export helper functions for easier use
export const getApiUrl = (endpoint: string = '') => config.getApiUrl(endpoint);
export const getBackendUrl = (endpoint: string = '') => config.getBackendUrl(endpoint);
export const getMockUrl = (endpoint: string = '') => config.getMockUrl(endpoint);

// Export configuration object for direct access
export default config;
