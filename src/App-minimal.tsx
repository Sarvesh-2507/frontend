import React from 'react';
import './AppMinimal.css';

const AppMinimal: React.FC = () => {
  return (
    <div className="app-minimal-container">
      <h1 className="app-minimal-title">MH-HR Application</h1>
      <p>If you can see this, React is working!</p>
      <div className="app-minimal-success">
        ✅ React is loading correctly
      </div>
      <div className="app-minimal-info">
        🔧 Testing basic functionality
      </div>
    </div>
  );
};

export default AppMinimal;
