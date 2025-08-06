// Debug utility to test organization API from browser console

export const debugOrganizationAPI = {
  // Check authentication status
  checkAuth: () => {
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    console.log('🔐 Authentication Status:');
    console.log('Token:', token ? 'Present' : 'Missing');
    console.log('User:', user);
    
    return { token, user };
  },

  // Test organization creation with current auth
  testCreate: async () => {
    const { token } = debugOrganizationAPI.checkAuth();
    
    if (!token) {
      console.error('❌ No authentication token found. Please log in first.');
      return;
    }

    const testData = {
      company_name: 'Debug Test Org ' + Date.now(),
      name: 'Debug Alt Name',
      description: 'This is a debug test organization',
      location: 'Debug City',
      industry_type: 'Technology',
      employee_count: 25
    };

    console.log('🧪 Testing organization creation...');
    console.log('📝 Data:', testData);

    try {
      const response = await fetch('http://192.168.1.132:8000/api/organizations/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testData)
      });

      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Organization created successfully!');
        console.log('📊 Result:', result);
        return result;
      } else {
        const error = await response.text();
        console.error('❌ API Error:', response.status, error);
        return null;
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      return null;
    }
  },

  // Test getting organizations
  testGet: async () => {
    const { token } = debugOrganizationAPI.checkAuth();
    
    if (!token) {
      console.error('❌ No authentication token found. Please log in first.');
      return;
    }

    console.log('🧪 Testing get organizations...');

    try {
      const response = await fetch('http://192.168.1.132:8000/api/organizations/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Organizations fetched successfully!');
        console.log('📊 Count:', result.length);
        console.log('📊 Data:', result);
        return result;
      } else {
        const error = await response.text();
        console.error('❌ API Error:', response.status, error);
        return null;
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      return null;
    }
  },

  // Test form submission
  testFormSubmission: async () => {
    console.log('🧪 Testing form submission flow...');
    
    // Import the API function
    const { organizationAPI } = await import('../services/organizationApi');
    
    const testData = {
      company_name: 'Form Test Org ' + Date.now(),
      name: 'Form Alt Name',
      description: 'This is a form test organization',
      location: 'Form City',
      industry_type: 'Healthcare',
      employee_count: 100
    };

    try {
      console.log('📝 Submitting via organizationAPI...');
      const result = await organizationAPI.createOrganization(testData);
      console.log('✅ Form submission successful!');
      console.log('📊 Result:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Form submission failed:', error);
      return null;
    }
  }
};

// Make available globally
(window as any).debugOrganizationAPI = debugOrganizationAPI;

console.log('🔧 Debug Organization API loaded!');
console.log('💡 Available commands:');
console.log('  - debugOrganizationAPI.checkAuth()');
console.log('  - debugOrganizationAPI.testCreate()');
console.log('  - debugOrganizationAPI.testGet()');
console.log('  - debugOrganizationAPI.testFormSubmission()');
