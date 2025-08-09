import React from 'react';
import Sidebar from '../../components/Sidebar';
import { FileText } from 'lucide-react';

const myPayslips = [
  { id: 'ps1', month: '2024-01', net: 6300, url: '#' },
  { id: 'ps2', month: '2023-12', net: 6200, url: '#' },
];

const PayrollSelfService: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="header-modern px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <FileText className="w-8 h-8 text-indigo-600" />
                <span>Payroll Self-Service</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">View and download your payslips</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto card p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">Month</th>
                  <th className="text-left py-3 px-4">Net Salary</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myPayslips.map(r => (
                  <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4">{r.month}</td>
                    <td className="py-3 px-4 font-medium">${r.net.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <a href={r.url} className="px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700">Download</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PayrollSelfService;


