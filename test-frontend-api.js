// Test script to verify frontend API configuration
console.log('Testing frontend API configuration...');

// Simulate the environment variable check
const VITE_USE_MOCK = 'true'; // This should match your .env file

const API_BASE_URL = VITE_USE_MOCK !== 'false' 
  ? 'http://localhost:3001/api' 
  : 'http://192.168.1.132:8000/api';

console.log('Environment variable VITE_USE_MOCK:', VITE_USE_MOCK);
console.log('Calculated API_BASE_URL:', API_BASE_URL);

// Test the login endpoint
const testLogin = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@mh-hr.com',
        password: 'admin123'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Login test successful!');
    } else {
      console.log('❌ Login test failed:', data);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

testLogin();
