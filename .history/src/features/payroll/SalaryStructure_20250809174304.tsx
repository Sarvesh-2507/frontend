import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Download, Edit, Filter, Search, User2 } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { payrollAPI } from '../../services/moduleApis';

interface SalaryRow {
  employee_id: string;
  employee_name: string;
  basic_salary: number;
  hra: number;
  da: number;
  allowances: number;
  pf: number;
  tax: number;
  insurance: number;
  gross_salary: number;
  net_salary: number;
}

const SalaryStructure: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rows, setRows] = useState<SalaryRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await payrollAPI.getSalaryStructures();
        setRows(res.data as any);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(
    () => rows.filter(r => r.employee_name.toLowerCase().includes(search.toLowerCase())),
    [rows, search]
  );

  const exportCsv = () => {
    if (!filtered.length) return;
    const csvHeader = Object.keys(filtered[0]).join(',');
    const csvRows = filtered.map(r => Object.values(r).join(',')).join('\n');
    const blob = new Blob([`${csvHeader}\n${csvRows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'salary_structures.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="header-modern px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <Calculator className="w-8 h-8 text-emerald-600" />
                <span>Salary Structure</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Manage employee salary components</p>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={exportCsv} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
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
                <button title="Filter" aria-label="Filter"
                  className="ml-4 p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4">Employee</th>
                      <th className="text-left py-3 px-4">Basic</th>
                      <th className="text-left py-3 px-4">HRA</th>
                      <th className="text-left py-3 px-4">DA</th>
                      <th className="text-left py-3 px-4">Allowances</th>
                      <th className="text-left py-3 px-4">PF</th>
                      <th className="text-left py-3 px-4">Tax</th>
                      <th className="text-left py-3 px-4">Insurance</th>
                      <th className="text-left py-3 px-4">Gross</th>
                      <th className="text-left py-3 px-4">Net</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.employee_id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                              <User2 className="w-4 h-4 text-emerald-700 dark:text-emerald-200" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{r.employee_name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{r.employee_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">${r.basic_salary.toLocaleString()}</td>
                        <td className="py-3 px-4">${r.hra.toLocaleString()}</td>
                        <td className="py-3 px-4">${r.da.toLocaleString()}</td>
                        <td className="py-3 px-4">${r.allowances.toLocaleString()}</td>
                        <td className="py-3 px-4">${r.pf.toLocaleString()}</td>
                        <td className="py-3 px-4">${r.tax.toLocaleString()}</td>
                        <td className="py-3 px-4">${r.insurance.toLocaleString()}</td>
                        <td className="py-3 px-4 font-medium">${r.gross_salary.toLocaleString()}</td>
                        <td className="py-3 px-4 font-medium">${r.net_salary.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <button title="Edit salary structure" aria-label="Edit salary structure" className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400">
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {loading && <div className="text-sm text-gray-500 mt-4">Loading...</div>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SalaryStructure;


