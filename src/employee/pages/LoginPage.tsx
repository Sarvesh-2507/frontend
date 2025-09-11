import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      console.log("Login API Response:", res.data); // Debug log

      const { access, refresh, user } = res.data;

      console.log("User object:", user); // Debug log
      console.log("Access Level:", user?.access_level); // Debug log

      if (!access || !user || !user.access_level || !user.access_level.value) {
        setError("Invalid response from server.");
        setLoading(false);
        return;
      }

      const accessValue = user.access_level.value; // e.g., "Emp1", "Emp2", "Hr1", "Hr2"
      const accessLabel = user.access_level.label; // e.g., "Team Member"

      console.log("Access Value:", accessValue, "Access Label:", accessLabel);

      // Store auth data with complete user info
      localStorage.setItem(
        "auth",
        JSON.stringify({
          access_token: access,
          refresh_token: refresh,
          user: user,
          access_level: user.access_level,
          role: accessValue, // Keep role for backward compatibility
        })
      );

      // Route based on access_level value
      if (accessValue.startsWith("Hr")) {
        // Hr1, Hr2, etc. -> HR dashboard
        console.log("Redirecting to HR dashboard");
        navigate("/home");
      } else if (accessValue.startsWith("Emp")) {
        // Emp1, Emp2, etc. -> Employee dashboard
        console.log("Redirecting to Employee dashboard");
        navigate("/emp-home");
      } else {
        console.log("Unknown access level received:", accessValue);
        setError(
          `Unknown access level: ${accessValue} (${accessLabel}). Please contact administrator.`
        );
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email or Employee ID</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your email or employee ID"
            title="Email or Employee ID"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your password"
            title="Password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
