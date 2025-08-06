# 🔒 Token Debug Guide - Fixing 401 Unauthorized Error

## 🚨 **Current Issue**
```
[31/Jul/2025 10:16:29] "POST /api/change-password/ HTTP/1.1" 401 183
Unauthorized: /api/change-password/
```

This means your authentication token is either:
- ❌ **Missing** - No token found
- ❌ **Invalid** - Token format is wrong
- ❌ **Expired** - Token has expired
- ❌ **Wrong endpoint** - Token not accepted by this endpoint

## 🔍 **Step-by-Step Debugging**

### **Step 1: Check Token Storage**

Open browser dev tools (F12) and run these commands in the console:

```javascript
// Check localStorage
console.log('localStorage accessToken:', localStorage.getItem('accessToken'));

// Check currentUser object
console.log('currentUser object:', JSON.parse(localStorage.getItem('currentUser') || '{}'));

// Check all possible token locations
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
console.log('Token locations:', {
  'currentUser.access_token': currentUser.access_token,
  'currentUser.token': currentUser.token,
  'currentUser.access': currentUser.access,
  'currentUser.authToken': currentUser.authToken,
  'currentUser.jwt': currentUser.jwt,
  'currentUser.bearer_token': currentUser.bearer_token,
  'localStorage.accessToken': localStorage.getItem('accessToken')
});
```

### **Step 2: Use Enhanced Debug Component**

1. Navigate to: `http://localhost:3000/debug-change-password`
2. Open browser console (F12)
3. Enter test credentials
4. Click "Test All Formats"
5. Check console for detailed token information

You'll see output like:
```
🔍 Token Debug Info:
📦 currentUser object: {access_token: "eyJ0eXAi...", email: "user@example.com"}
🔑 Available token fields: {access_token: "Present", token: "Missing", ...}
🎯 Selected token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1...
🌐 API URL: http://192.168.1.132:8000/api/change-password/
🔐 Authorization header: Bearer eyJ0eXAiOiJKV1QiLCJh...
📊 Response status: 401
📥 Response data: {"detail": "Invalid token"}
```

### **Step 3: Test Token Validity**

Test if your token works with other endpoints:

```javascript
// Test token with profile endpoint
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
const token = currentUser.access_token || localStorage.getItem('accessToken');

fetch('http://192.168.1.132:8000/api/profile/', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
.then(response => {
  console.log('Profile endpoint status:', response.status);
  return response.json();
})
.then(data => console.log('Profile data:', data))
.catch(error => console.error('Profile error:', error));
```

### **Step 4: Check Token Format**

Your token should look like:
```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InRlc3QiLCJleHAiOjE2MjM5NzY4MDB9.signature
```

Check token format:
```javascript
const token = localStorage.getItem('accessToken') || JSON.parse(localStorage.getItem('currentUser') || '{}').access_token;
console.log('Token length:', token?.length);
console.log('Token starts with:', token?.substring(0, 10));
console.log('Token parts:', token?.split('.').length); // Should be 3 for JWT
```

## 🔧 **Common Solutions**

### **Solution 1: Re-login to Get Fresh Token**
```javascript
// Clear old tokens
localStorage.removeItem('accessToken');
localStorage.removeItem('currentUser');

// Then login again through your login form
```

### **Solution 2: Check Token Expiration**
```javascript
// Decode JWT token to check expiration
function decodeJWT(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    console.log('Token expires at:', new Date(payload.exp * 1000));
    console.log('Current time:', new Date());
    console.log('Token expired:', payload.exp < now);
    return payload;
  } catch (error) {
    console.error('Invalid JWT token:', error);
    return null;
  }
}

const token = localStorage.getItem('accessToken') || JSON.parse(localStorage.getItem('currentUser') || '{}').access_token;
if (token) {
  decodeJWT(token);
}
```

### **Solution 3: Test Different Endpoints**

Try these endpoints to see which one works:
```javascript
const endpoints = [
  'http://192.168.1.132:8000/api/change-password/',
  'http://192.168.1.132:8000/accounts/change-password/',
  'http://192.168.1.132:8000/auth/change-password/',
  'http://192.168.1.132:8000/change-password/'
];

const token = localStorage.getItem('accessToken') || JSON.parse(localStorage.getItem('currentUser') || '{}').access_token;

endpoints.forEach(async (endpoint) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        current_password: 'test',
        new_password: 'test123'
      })
    });
    console.log(`${endpoint}: ${response.status}`);
  } catch (error) {
    console.log(`${endpoint}: ERROR`);
  }
});
```

### **Solution 4: Check Django Backend Logs**

Look for these patterns in your Django logs:
```
# Token missing
"Authorization header must be provided"

# Token invalid format
"Invalid token header"

# Token expired
"Token has expired"

# Wrong token type
"Invalid token type"
```

## 🎯 **Quick Fixes to Try**

### **Fix 1: Update API Endpoint**
Try changing the endpoint in your code:
```typescript
// Instead of:
'http://192.168.1.132:8000/api/change-password/'

// Try:
'http://192.168.1.132:8000/accounts/change-password/'
```

### **Fix 2: Add CSRF Token (if required)**
```typescript
const response = await fetch(`${API_BASE_URL}/change-password/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
    'X-CSRFToken': getCookie('csrftoken') // If CSRF is required
  },
  body: JSON.stringify(requestData)
});
```

### **Fix 3: Check Token Prefix**
Some backends expect different token prefixes:
```typescript
// Try these variations:
'Authorization': 'Bearer ' + token
'Authorization': 'Token ' + token
'Authorization': 'JWT ' + token
```

## 🚀 **Next Steps**

1. **Run the debug component** and check console output
2. **Test token validity** with other endpoints
3. **Check token expiration** using JWT decoder
4. **Try different API endpoints** if current one doesn't work
5. **Re-login** if token is expired or invalid

## 📞 **If Still Having Issues**

Share the console output from the debug component, specifically:
- 🔍 Token Debug Info section
- 📊 Response status and data
- 🔑 Available token fields

This will help identify exactly what's causing the 401 error!
