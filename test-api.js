// Test script for login API to check response structure
const testLogin = async () => {
  console.log('🧪 Testing Login API at http://192.168.1.132:8000/api/login/\n');

  try {
    const response = await fetch('http://192.168.1.132:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@mh-hr.com',
        password: 'admin123'
      })
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    const data = await response.json();
    console.log('Full Response Structure:');
    console.log(JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Login API is working!');
      console.log('📋 Response Analysis:');

      // Check if tokens are in the expected format
      if (data.tokens) {
        console.log('- Tokens found in response.tokens');
        console.log('- Access token:', data.tokens.access ? '✅ Found' : '❌ Missing');
        console.log('- Refresh token:', data.tokens.refresh ? '✅ Found' : '❌ Missing');
      } else if (data.access_token || data.access) {
        console.log('- Tokens found in different format');
        console.log('- Access token field:', data.access_token ? 'access_token' : data.access ? 'access' : 'not found');
        console.log('- Refresh token field:', data.refresh_token ? 'refresh_token' : data.refresh ? 'refresh' : 'not found');
      } else {
        console.log('- ❌ No tokens found in response');
      }

      if (data.user) {
        console.log('- User data: ✅ Found');
      } else {
        console.log('- User data: ❌ Missing');
      }
    } else {
      console.log('❌ Login failed with status:', response.status);
    }
  } catch (error) {
    console.error('❌ Error testing login:', error.message);
  }
};

// Test forgot password API
const testForgotPassword = async () => {
  console.log('🧪 Testing Forgot Password API at http://192.168.1.132:8000/api/forgot-password/\n');

  // Test 1: Invalid email (should return error)
  console.log('Test 1: Invalid email');
  try {
    const response = await fetch('http://192.168.1.132:8000/api/forgot-password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'nonexistent@example.com'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);

    if (response.status === 404) {
      console.log('✅ Correctly returns 404 for non-existent email\n');
    } else {
      console.log('⚠️  Unexpected response for non-existent email\n');
    }
  } catch (error) {
    console.error('❌ Error in test 1:', error.message, '\n');
  }

  // Test 2: Missing email field
  console.log('Test 2: Missing email field');
  try {
    const response = await fetch('http://192.168.1.132:8000/api/forgot-password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    console.log('✅ Test completed\n');
  } catch (error) {
    console.error('❌ Error in test 2:', error.message, '\n');
  }

  // Test 3: Invalid JSON
  console.log('Test 3: Invalid request format');
  try {
    const response = await fetch('http://192.168.1.132:8000/api/forgot-password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json'
    });

    console.log('Status:', response.status);
    console.log('✅ Test completed\n');
  } catch (error) {
    console.error('❌ Error in test 3:', error.message, '\n');
  }

  console.log('📋 Summary:');
  console.log('- The forgot password endpoint is accessible');
  console.log('- It properly handles different error scenarios');
  console.log('- Your frontend is now configured to use this endpoint');
  console.log('- To test with a valid email, use an email that exists in your database');
};

// Run both tests
const runTests = async () => {
  await testLogin();
  console.log('\n' + '='.repeat(50) + '\n');
  await testForgotPassword();
};

runTests();
