# Change Password API Debugging Guide

## 1. Test the Backend Endpoint Directly

### Using curl:
```bash
# Test 1: With current_password (what your frontend sends)
curl -X POST http://192.168.1.132:8000/api/change-password/ \
  -H "Authorization: Bearer YOUR_ACTUAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "your_current_password",
    "new_password": "new_secure_password123!"
  }' \
  -v

# Test 2: With old_password (what you mentioned)
curl -X POST http://192.168.1.132:8000/api/change-password/ \
  -H "Authorization: Bearer YOUR_ACTUAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "old_password": "your_current_password",
    "new_password": "new_secure_password123!"
  }' \
  -v

# Test 3: Check what fields are actually expected
curl -X POST http://192.168.1.132:8000/api/change-password/ \
  -H "Authorization: Bearer YOUR_ACTUAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}' \
  -v
```

### Using Postman:
1. **Method**: POST
2. **URL**: `http://192.168.1.132:8000/api/change-password/`
3. **Headers**:
   - `Authorization: Bearer YOUR_TOKEN`
   - `Content-Type: application/json`
4. **Body** (raw JSON):
```json
{
  "current_password": "your_current_password",
  "new_password": "new_secure_password123!"
}
```

## 2. Common Django REST Framework Change Password Formats

### Format 1: Django's built-in PasswordChangeSerializer
```json
{
  "old_password": "current_password",
  "new_password1": "new_password",
  "new_password2": "new_password_confirmation"
}
```

### Format 2: Custom serializer (most common)
```json
{
  "current_password": "current_password",
  "new_password": "new_password"
}
```

### Format 3: Alternative naming
```json
{
  "old_password": "current_password",
  "new_password": "new_password"
}
```

## 3. Expected Django Backend Implementation

### Serializer (serializers.py):
```python
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate_new_password(self, value):
        # Add password validation here
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
```

### View (views.py):
```python
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)
```

## 4. Frontend Debugging Steps

### Add detailed logging to your API call:
```typescript
// In src/utils/api.ts
changePassword: async (data: { current_password: string; new_password: string }): Promise<ApiResponse<any>> => {
  console.log('🔐 API - Making change password request to:', `${API_BASE_URL}/change-password/`);
  console.log('📤 API - Request body:', JSON.stringify(data));
  console.log('🔑 API - Token:', localStorage.getItem('accessToken'));

  try {
    const response = await apiRequest('/change-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    console.log('✅ API - Success response:', response);
    return response;
  } catch (error) {
    console.error('❌ API - Error response:', error);
    console.error('❌ API - Error details:', error.response?.data);
    throw error;
  }
},
```

## 5. Common Issues and Solutions

### Issue 1: Field Name Mismatch
**Problem**: Backend expects `old_password` but frontend sends `current_password`
**Solution**: Update frontend to match backend expectations

### Issue 2: CSRF Token Required
**Problem**: Django requires CSRF token for POST requests
**Solution**: Add CSRF exemption or include CSRF token

### Issue 3: Authentication Issues
**Problem**: Token is invalid or expired
**Solution**: Check token validity and refresh if needed

### Issue 4: Permission Issues
**Problem**: User doesn't have permission to change password
**Solution**: Ensure proper permissions are set

## 6. Testing Checklist

- [ ] Test with correct field names
- [ ] Verify token is valid and not expired
- [ ] Check if CSRF is required
- [ ] Ensure user is authenticated
- [ ] Verify password validation rules
- [ ] Test with different password formats
- [ ] Check Django logs for detailed errors

## 7. Django Backend Debugging

### Enable Django logging:
```python
# In settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

### Add debug prints to your view:
```python
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    print(f"Request data: {request.data}")
    print(f"User: {request.user}")
    print(f"Headers: {request.headers}")
    
    # Your existing code...
```
