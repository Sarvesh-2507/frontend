// Change Password API Testing Script
// Run with: node test_change_password.js

const https = require('https');
const http = require('http');

// Configuration
const API_BASE = 'http://192.168.1.132:8000';
const ENDPOINT = '/api/change-password/';

// Test configurations
const testCases = [
  {
    name: 'Test 1: current_password + new_password (your frontend format)',
    data: {
      current_password: 'your_current_password',
      new_password: 'new_secure_password123!'
    }
  },
  {
    name: 'Test 2: old_password + new_password (mentioned format)',
    data: {
      old_password: 'your_current_password',
      new_password: 'new_secure_password123!'
    }
  },
  {
    name: 'Test 3: Django default format',
    data: {
      old_password: 'your_current_password',
      new_password1: 'new_secure_password123!',
      new_password2: 'new_secure_password123!'
    }
  },
  {
    name: 'Test 4: Empty request (to see required fields)',
    data: {}
  }
];

function makeRequest(testCase, token) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(testCase.data);
    
    const options = {
      hostname: '192.168.1.132',
      port: 8000,
      path: ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${token}`
      }
    };

    console.log(`\n🧪 ${testCase.name}`);
    console.log(`📤 Request: ${JSON.stringify(testCase.data, null, 2)}`);
    console.log(`🔑 Token: ${token ? token.substring(0, 20) + '...' : 'NOT PROVIDED'}`);

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`📊 Status: ${res.statusCode}`);
        console.log(`📋 Headers: ${JSON.stringify(res.headers, null, 2)}`);
        
        try {
          const jsonData = JSON.parse(data);
          console.log(`📥 Response: ${JSON.stringify(jsonData, null, 2)}`);
        } catch (e) {
          console.log(`📥 Raw Response: ${data}`);
        }
        
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Request Error: ${e.message}`);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting Change Password API Tests');
  console.log('=' .repeat(50));

  // You need to replace this with your actual token
  const token = 'YOUR_ACTUAL_TOKEN_HERE';
  
  if (token === 'YOUR_ACTUAL_TOKEN_HERE') {
    console.log('⚠️  WARNING: Please replace YOUR_ACTUAL_TOKEN_HERE with your actual token');
    console.log('💡 You can get your token from localStorage in the browser:');
    console.log('   1. Open browser dev tools (F12)');
    console.log('   2. Go to Application/Storage tab');
    console.log('   3. Look for localStorage > accessToken');
    console.log('');
  }

  for (const testCase of testCases) {
    try {
      await makeRequest(testCase, token);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between requests
    } catch (error) {
      console.error(`❌ Test failed: ${error.message}`);
    }
  }

  console.log('\n✅ All tests completed!');
  console.log('\n📝 Analysis:');
  console.log('- Look for 200 status codes for successful requests');
  console.log('- 400 errors usually indicate field name mismatches');
  console.log('- 401 errors indicate authentication issues');
  console.log('- 403 errors indicate permission issues');
  console.log('- Check the response body for specific error messages');
}

// Additional utility function to test token validity
async function testTokenValidity(token) {
  console.log('\n🔍 Testing Token Validity');
  console.log('-'.repeat(30));
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '192.168.1.132',
      port: 8000,
      path: '/api/profile/', // Assuming you have a profile endpoint
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`🔑 Token Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log('✅ Token is valid');
        } else if (res.statusCode === 401) {
          console.log('❌ Token is invalid or expired');
        }
        resolve(res.statusCode);
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Run the tests
runTests().catch(console.error);

// Export for use in other scripts
module.exports = { makeRequest, testTokenValidity };
