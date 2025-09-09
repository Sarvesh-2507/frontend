import React from 'react';

const PoliciesPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Company Policies</h1>
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-2">Policy Documents</h2>
      <ul className="list-disc pl-6">
        <li>Leave Policy</li>
        <li>Attendance Policy</li>
        <li>Code of Conduct</li>
        <li>Payroll & Salary Policy</li>
      </ul>
    </div>
  </div>
);

export default PoliciesPage;
