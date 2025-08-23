import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Simple test component to check if basic routing works
const TestApp: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Application Test
          </h1>
          <p className="text-gray-600">
            If you can see this, the basic React setup is working.
          </p>
          <Routes>
            <Route path="/" element={
              <div className="mt-4 p-4 bg-green-100 rounded-lg">
                <p className="text-green-800">✅ Routing is working!</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default TestApp;
