import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCcw, Search } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { attendanceAPI } from '../../services/moduleApis';

interface IntegrationRow {
  employee_id: string;
  employee_name: string;
  total_hours: number;
  overtime_hours: number;
  month: string;
}

const AttendanceIntegration: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rows, setRows] = useState<IntegrationRow[]>([]);
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await attendanceAPI.getAttendance({ month });
        const data = (res.data as any[]).reduce<Record<string, IntegrationRow>>((acc, r: any) => {
          const key = r.employee_id;
          if (!acc[key]) {
            acc[key] = {
              employee_id: r.employee_id,
              employee_name: r.employee_name,
              total_hours: 0,
              overtime_hours: 0,
              month,
            };
          }
          acc[key].total_hours += r.hours_worked ?? 0;
          return acc;
        }, {});
        setRows(Object.values(data));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [month]);

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
                <Clock className="w-8 h-8 text-sky-600" />
                <span>Attendance & Time Integration</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Sync attendance data for payroll calculations</p>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                aria-label="Integration month"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                onClick={() => setMonth(month)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-60"
              >
                <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </motion.button>
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
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4">Employee</th>
                      <th className="text-left py-3 px-4">Month</th>
                      <th className="text-left py-3 px-4">Total Hours</th>
                      <th className="text-left py-3 px-4">Overtime Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.employee_id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900 dark:text-white">{r.employee_name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{r.employee_id}</p>
                        </td>
                        <td className="py-3 px-4">{r.month}</td>
                        <td className="py-3 px-4">{r.total_hours.toFixed(1)}</td>
                        <td className="py-3 px-4">{r.overtime_hours?.toFixed?.(1) ?? '0.0'}</td>
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

export default AttendanceIntegration;


