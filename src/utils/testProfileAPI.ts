// Simple test script to debug profile API endpoints
// Run this in browser console to test endpoints manually

async function testProfileEndpoints() {
  const token = localStorage.getItem('accessToken');
  console.log('Testing with token:', token ? 'Present' : 'Missing');
  
  const baseUrl = 'http://192.168.1.132:8000/api';
  const endpoints = [
    '/profiles/profiles/me/',
    '/profiles/me/',
    '/profile/me/',
    '/profiles/profiles/',
    '/profiles/',
    '/profile/',
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n--- Testing: ${baseUrl}${endpoint} ---`);
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS - Data:', data);
        return { endpoint, data };
      } else {
        const errorText = await response.text();
        console.log('❌ FAILED - Error:', errorText);
      }
    } catch (error) {
      console.log('❌ NETWORK ERROR:', error);
    }
  }
  
  console.log('\n🔍 No working endpoints found');
  return null;
}

// Run the test
testProfileEndpoints().then(result => {
  if (result) {
    console.log('\n🎉 Working endpoint found:', result.endpoint);
  }
});

export { testProfileEndpoints };
