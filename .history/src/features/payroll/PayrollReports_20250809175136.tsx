import React from 'react';
import Sidebar from '../../components/Sidebar';
import { BarChart3, Download } from 'lucide-react';

const data = [
  { label: 'Jan', total: 15550 },
  { label: 'Feb', total: 16720 },
  { label: 'Mar', total: 16010 },
  { label: 'Apr', total: 17100 },
];

const PayrollReports: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="header-modern px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <span>Payroll Reports & Analytics</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Track payroll costs and trends</p>
            </div>
            <button className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Monthly Payroll Total</div>
              <div className="space-y-3">
                {(() => {
                  const max = Math.max(...data.map(d => d.total));
                  return data.map(d => (
                    <div key={d.label} className="flex items-center space-x-3">
                      <div className="w-10 text-sm text-gray-700 dark:text-gray-300">{d.label}</div>
                      <progress className="flex-1 h-3 [&::-webkit-progress-bar]:bg-gray-200 dark:[&::-webkit-progress-bar]:bg-gray-700 [&::-webkit-progress-value]:bg-blue-600 [&::-moz-progress-bar]:bg-blue-600 rounded" value={d.total} max={max} />
                      <div className="w-20 text-right text-sm font-medium">${d.total.toLocaleString()}</div>
                    </div>
                  ));
                })()}
              </div>
            </div>
            <div className="card p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Highlights</div>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Average salary up 2.1%</li>
                <li>Pending payments decreased by 3</li>
                <li>Overtime costs steady MoM</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PayrollReports;


