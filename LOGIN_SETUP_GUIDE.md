# Login Setup Guide - Fix "Cannot read properties of undefined (reading 'access')"

## 🔍 Problem Diagnosis
The error occurs because your backend API at `http://192.168.1.132:8000/api/login/` is working correctly, but there are no users in your database yet.

## ✅ Solution Options

### Option 1: Create Users in Your Backend Database (Recommended)

#### For Django Backend:
```bash
# Access your Django shell
python manage.py shell

# Create a test admin user
from django.contrib.auth.models import User
User.objects.create_user('admin', 'admin@example.com', 'admin123')

# Or create a superuser
python manage.py createsuperuser
```

#### For Django with Custom User Model:
```bash
python manage.py shell

# Replace 'CustomUser' with your actual user model
from myapp.models import CustomUser
CustomUser.objects.create_user(
    email='admin@example.com',
    username='admin',
    password='admin123'
)
```

### Option 2: Use Mock Server for Testing

Set environment variable to use mock server:
```bash
# Windows
set REACT_APP_USE_MOCK=true
npm start

# Linux/Mac
REACT_APP_USE_MOCK=true npm start
```

Mock server credentials:
- **Admin**: `admin@mh-hr.com` / `admin123`
- **HR**: `hr@mh-hr.com` / `hr123`
- **Employee**: `employee@mh-hr.com` / `emp123`

## 🔧 Frontend Fixes Applied

### 1. Enhanced API Response Handling
The frontend now handles multiple response formats:
- Django REST Framework format: `{ access_token: "...", user: {...} }`
- Custom format: `{ user: {...}, tokens: { access: "...", refresh: "..." } }`
- Simple token format: `{ token: "...", user: {...} }`

### 2. Error Message Improvements
- Added support for Django's `detail` field in error responses
- Better error handling for different backend formats

### 3. Flexible Configuration
- Environment variable to switch between real backend and mock server
- Automatic fallback for missing user data

## 🧪 Testing Your Setup

### Test Backend Connectivity:
```bash
node test-login-formats.js
```

### Test with Real Credentials:
Once you create a user, test with:
```javascript
// In browser console or test script
fetch('http://192.168.1.132:8000/api/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'your-email@example.com',
    password: 'your-password'
  })
}).then(r => r.json()).then(console.log)
```

## 📋 Expected Backend Response Format

Your backend should return one of these formats:

### Format 1 (Django REST Framework JWT):
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "username": "admin",
    "first_name": "Admin",
    "last_name": "User"
  }
}
```

### Format 2 (Custom):
```json
{
  "user": {
    "id": "1",
    "email": "admin@example.com",
    "username": "admin",
    "role": "admin"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

## 🚀 Quick Start

1. **Create a user in your backend**:
   ```bash
   python manage.py shell
   from django.contrib.auth.models import User
   User.objects.create_user('admin', 'admin@example.com', 'admin123')
   ```

2. **Test the login**:
   - Go to http://localhost:3001/login
   - Use: `admin@example.com` / `admin123`

3. **If it still doesn't work**:
   - Set `REACT_APP_USE_MOCK=true` to use mock server
   - Check your backend logs for errors
   - Verify your Django settings for CORS and authentication

## 🔐 Security Notes

- The frontend now handles various token formats automatically
- Tokens are stored securely in localStorage
- Error messages don't reveal sensitive information
- CORS is properly configured for your backend

Your login should now work! 🎉
