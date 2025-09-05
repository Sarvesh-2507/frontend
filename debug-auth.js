// Debug script to check authentication state
// Run this in your browser's console (F12 > Console tab)

console.log("=== AUTHENTICATION DEBUG ===");

// Check localStorage tokens
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');
const currentUser = localStorage.getItem('currentUser');

console.log("Access Token:", accessToken ? "EXISTS" : "MISSING");
console.log("Refresh Token:", refreshToken ? "EXISTS" : "MISSING");
console.log("Current User:", currentUser ? "EXISTS" : "MISSING");

if (accessToken) {
  console.log("Access Token (first 50 chars):", accessToken.substring(0, 50) + "...");
}

if (currentUser) {
  try {
    const user = JSON.parse(currentUser);
    console.log("User Data:", user);
  } catch (e) {
    console.log("User Data (invalid JSON):", currentUser);
  }
}

// Check if token is expired (basic check)
if (accessToken) {
  try {
    const parts = accessToken.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;
      console.log("Token expires at:", new Date(payload.exp * 1000));
      console.log("Current time:", new Date());
      console.log("Token is expired:", payload.exp < currentTime);
    }
  } catch (e) {
    console.log("Token is not a valid JWT");
  }
}

// Check Zustand auth store state
const authStore = JSON.parse(localStorage.getItem('auth-storage') || '{}');
console.log("Auth Store State:", authStore);

console.log("=== DEBUG COMPLETE ===");
