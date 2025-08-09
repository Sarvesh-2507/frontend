import React from 'react';
import Sidebar from '../../components/Sidebar';
import { Shield } from 'lucide-react';

const rows = [
  { id: '1', action: 'Processed payroll', actor: 'admin@company.com', at: '2024-01-31 10:12' },
  { id: '2', action: 'Updated salary structure EMP002', actor: 'hr@company.com', at: '2024-01-25 16:45' },
];

const PayrollAudit: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="header-modern px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <Shield className="w-8 h-8 text-rose-600" />
                <span>Audit & Access Control</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Track payroll actions and changes</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto card p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">Action</th>
                  <th className="text-left py-3 px-4">Actor</th>
                  <th className="text-left py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4">{r.action}</td>
                    <td className="py-3 px-4">{r.actor}</td>
                    <td className="py-3 px-4">{r.at}</td>
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

export default PayrollAudit;


