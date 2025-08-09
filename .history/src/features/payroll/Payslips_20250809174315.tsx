import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Filter, Search } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

interface PayslipRow {
  id: string;
  employee_id: string;
  employee_name: string;
  month: string; // YYYY-MM
  net_salary: number;
  status: 'pending' | 'processed' | 'paid';
  pdf_url?: string;
}

const mockPayslips: PayslipRow[] = [
  { id: 'ps1', employee_id: 'EMP001', employee_name: 'John Doe', month: '2024-01', net_salary: 6300, status: 'paid' },
  { id: 'ps2', employee_id: 'EMP002', employee_name: 'Sarah Wilson', month: '2024-01', net_salary: 5050, status: 'processed' },
];

const Payslips: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [rows] = useState<PayslipRow[]>(mockPayslips);

  const filtered = useMemo(
    () => rows.filter(r => r.employee_name.toLowerCase().includes(search.toLowerCase())),
    [rows, search]
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="header-modern px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <FileText className="w-8 h-8 text-indigo-600" />
                <span>Payslips</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Generate and download payslips</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search employee..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <button className="ml-4 p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4">Employee</th>
                      <th className="text-left py-3 px-4">Month</th>
                      <th className="text-left py-3 px-4">Net Salary</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900 dark:text-white">{r.employee_name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{r.employee_id}</p>
                        </td>
                        <td className="py-3 px-4">{r.month}</td>
                        <td className="py-3 px-4 font-medium">${r.net_salary.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">{r.status}</span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="inline-flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Payslips;


