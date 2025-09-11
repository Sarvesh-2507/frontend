import React from 'react';
import { HRMChatbot } from '../../components/HRMChatbot/HRMChatbot';

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    {/* Employee Header can go here */}
    {children}
    <HRMChatbot />
  </div>
);

export default BaseLayout;
