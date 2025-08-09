import React from 'react';
import Sidebar from '../../components/Sidebar';
import { Shield } from 'lucide-react';

const PayrollCompliance: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const items = [
    { id: 'pf', name: 'Provident Fund (PF)', status: 'configured' },
    { id: 'esi', name: 'ESI', status: 'pending' },
    { id: 'pt', name: 'Professional Tax', status: 'configured' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="header-modern px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <Shield className="w-8 h-8 text-teal-600" />
                <span>Statutory Compliance</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Manage payroll statutory configurations</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map(it => (
              <div key={it.id} className="card p-5">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{it.name}</div>
                <div className="mt-2 text-sm">
                  Status: <span className={`font-medium ${it.status === 'configured' ? 'text-green-600' : 'text-yellow-600'}`}>{it.status}</span>
                </div>
                <button className="mt-4 px-3 py-2 rounded bg-teal-600 text-white hover:bg-teal-700">Configure</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PayrollCompliance;


