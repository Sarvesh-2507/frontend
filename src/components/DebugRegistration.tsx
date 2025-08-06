import React, { useState } from "react";

const DebugRegistration: React.FC = () => {
  const [testData, setTestData] = useState({
    email: "test@example.com",
    username: "testuser",
    password: "TestPass123!", // Strong password with uppercase, lowercase, number, special char
    confirm_password: "TestPass123!",
    organization: 1,
    role: 1,
    access_level: "Employee", // Try common access level values
    designation: "Software Engineer",
    date_of_joining: "2025-08-02",
    work_location: "Chennai",
    employment_type: "Full-time",
    department_ref: 1,
    // reporting_manager: null, // Remove this field for now since ID 1 doesn't exist
  });

  const testRegistration = async () => {
    console.log(
      "🧪 Debug - Testing registration with data:",
      JSON.stringify(testData, null, 2)
    );

    // Try multiple backend URLs
    const urls = [
      "http://127.0.0.1:8000/api/register/",
      "http://localhost:8000/api/register/",
      "http://192.168.1.132:8000/api/register/",
    ];

    for (const url of urls) {
      console.log(`🧪 Debug - Trying URL: ${url}`);
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testData),
        });

        console.log(`🧪 Debug - ${url} Response status:`, response.status);
        console.log(
          `🧪 Debug - ${url} Response headers:`,
          Object.fromEntries(response.headers.entries())
        );

        const responseData = await response.json();
        console.log(
          `🧪 Debug - ${url} Response data:`,
          JSON.stringify(responseData, null, 2)
        );

        if (response.ok) {
          alert(`✅ Registration successful with ${url}!`);
          return;
        } else {
          console.log(`❌ ${url} failed with status ${response.status}`);
        }
      } catch (error) {
        console.error(`🧪 Debug - ${url} Error:`, error);
      }
    }
    alert("❌ All backend URLs failed!");
  };

  const testMinimalData = async () => {
    const minimalData = {
      email: "minimal@example.com",
      username: "minimal",
      password: "MinimalPass123!", // Strong password
      confirm_password: "MinimalPass123!",
      organization: 1,
      role: 1,
      access_level: 1, // Use numeric value - we found this works!
      designation: "Test",
      date_of_joining: "2025-08-02",
      work_location: "Test Location",
      employment_type: "Full-time",
    };

    console.log(
      "🧪 Debug - Testing minimal registration:",
      JSON.stringify(minimalData, null, 2)
    );

    try {
      const response = await fetch("http://192.168.1.132:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(minimalData),
      });

      console.log("🧪 Debug - Minimal response status:", response.status);
      const responseData = await response.json();
      console.log(
        "🧪 Debug - Minimal response data:",
        JSON.stringify(responseData, null, 2)
      );

      if (response.ok) {
        alert("✅ Minimal registration successful!");
      } else {
        alert(
          `❌ Minimal registration failed: ${JSON.stringify(responseData)}`
        );
      }
    } catch (error) {
      console.error("🧪 Debug - Minimal error:", error);
      alert(`❌ Minimal network error: ${error}`);
    }
  };

  const testAccessLevelVariations = async () => {
    const accessLevels = [
      1,
      2,
      3,
      "1",
      "2",
      "3",
      "admin",
      "user",
      "employee",
      "manager",
    ];

    for (const level of accessLevels) {
      console.log(`🧪 Testing access_level: ${level} (type: ${typeof level})`);

      const testData = {
        email: `test-${level}@example.com`,
        username: `test${level}`,
        password: "TestPass123!",
        confirm_password: "TestPass123!",
        organization: 1,
        role: 1,
        access_level: level,
        designation: "Test",
        date_of_joining: "2025-08-02",
        work_location: "Test Location",
        employment_type: "Full-time",
      };

      try {
        const response = await fetch(
          "http://192.168.1.132:8000/api/register/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(testData),
          }
        );

        const responseData = await response.json();
        console.log(`🧪 Access level ${level} - Status: ${response.status}`);

        if (response.ok) {
          console.log(`✅ SUCCESS with access_level: ${level}`);
          alert(`✅ Found working access_level: ${level}`);
          return; // Stop on first success
        } else {
          console.log(`❌ Failed with access_level: ${level}`, responseData);
        }
      } catch (error) {
        console.error(`🧪 Error testing access_level ${level}:`, error);
      }

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    alert("❌ No working access_level found from test values");
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Registration Debug Tool</h3>

      <div className="space-y-4">
        <button
          type="button"
          onClick={testRegistration}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Full Registration
        </button>

        <button
          type="button"
          onClick={testMinimalData}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Minimal Registration
        </button>

        <button
          type="button"
          onClick={testAccessLevelVariations}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test Access Levels
        </button>

        <div className="mt-4">
          <h4 className="font-semibold">Test Data:</h4>
          <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(testData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DebugRegistration;
