import React from "react";

// Simple component that just renders children without any authentication
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default ProtectedRoute;
