import React, { useMemo, useState, useRef } from 'react';
import Modal from '../../components/compound/Modal';
import { Download, FileText, Filter, Search } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

import apiClient from '../../services/api';



interface PayslipRow {
  id: string;
  employee_id: string;
  employee_name: string;
  month: string;
  net_salary: number;
  status: 'pending' | 'processed' | 'paid';
  pdf_url?: string;
}


const Payslips: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<PayslipRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    employee: '', // employee ID as string
    basic_salary: '',
    hra: '',
    allowances: '',
    deductions: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filtered rows based on search
  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    return rows.filter(
      (r) =>
        r.employee_name.toLowerCase().includes(search.toLowerCase()) ||
        r.employee_id.toLowerCase().includes(search.toLowerCase())
    );
  }, [rows, search]);

  // Handle input change for form
  // For salary fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Remove employee search/autocomplete logic

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate all fields
    if (!form.employee || !form.basic_salary || !form.hra || !form.allowances || !form.deductions) {
      setError('All fields are required.');
      return;
    }
    // All salary fields must be valid decimals (as strings)
    if ([form.basic_salary, form.hra, form.allowances, form.deductions].some(f => isNaN(Number(f)))) {
      setError('All salary fields must be valid numbers.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        employee: parseInt(form.employee, 10),
        basic_salary: form.basic_salary,
        hra: form.hra,
        allowances: form.allowances,
        deductions: form.deductions,
      };
      console.log('Payslip payload:', payload);
      const res = await apiClient.post(
        '/payroll/salary/create/',
        JSON.stringify(payload),
        { headers: { 'Content-Type': 'application/json' } }
      );
      const newPayslip = res.data;
      setRows((prev) => [
        ...prev,
        {
          id: newPayslip.id || Math.random().toString(36).slice(2),
          employee_id: String(payload.employee),
          employee_name: newPayslip.employee_name || '',
          month: newPayslip.month || '',
          net_salary:
            Number(form.basic_salary) + Number(form.hra) + Number(form.allowances) - Number(form.deductions),
          status: newPayslip.status || 'pending',
          pdf_url: newPayslip.pdf_url,
        },
      ]);
      setSuccess('Payslip created successfully!');
      setForm({ employee: '', basic_salary: '', hra: '', allowances: '', deductions: '' });
      setTimeout(() => setModalOpen(false), 1200);
    } catch (err: any) {
      // Log the full error for debugging
      console.error('Payslip POST error:', err);
      if (err?.response) {
        console.error('Backend response data:', err.response.data);
        console.error('Backend response status:', err.response.status);
        console.error('Backend response headers:', err.response.headers);
      }
      setError('Failed to create payslip. ' + (err?.response?.data ? JSON.stringify(err.response.data) : err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="header-modern px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white dark:text-white flex items-center space-x-3">
                <FileText className="w-8 h-8 text-indigo-600" />
                <span>Payslips</span>
              </h1>
              <p className="text-gray-600 dark:text-white">Generate and download payslips</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Search bar and filter at the top */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employee..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button title="Filter" aria-label="Filter" className="ml-4 p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            {/* Table and actions below, no card or box, just spacing */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-white border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4">Employee</th>
                    <th className="text-left py-3 px-4">Month</th>
                    <th className="text-left py-3 px-4">Net Salary</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Generate</th>
                    <th className="text-left py-3 px-4 flex items-center justify-between">
                      <span>Actions</span>
                      <button
                        title="Add Payslip"
                        aria-label="Add Payslip"
                        className="ml-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-xl font-bold flex items-center justify-center"
                        onClick={() => setModalOpen(true)}
                      >
                        +
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900 dark:text-white">{r.employee_name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{r.employee_id}</p>
                      </td>
                      <td className="py-3 px-4 dark:text-white">{r.month}</td>
                      <td className="py-3 px-4 font-medium dark:text-white">${r.net_salary.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white">{r.status}</span>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        {/* Generate Payslip Button */}
                        <button
                          title="Generate payslip"
                          aria-label="Generate payslip"
                          className="inline-flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={async () => {
                            // TODO: Call the backend generate API here with employee_id
                            // Example: await apiClient.post('/payroll/generate/', { employee: r.employee_id });
                            // Replace '/payroll/generate/' with your actual API endpoint when available
                            alert('Generate API call goes here for employee ID: ' + r.employee_id);
                          }}
                        >
                          <span>Generate</span>
                        </button>
                        {/* Download Payslip Button */}
                        {r.pdf_url ? (
                          <a
                            href={r.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </a>
                        ) : (
                          <button
                            title="Download payslip"
                            aria-label="Download payslip"
                            className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gray-400 text-white rounded cursor-not-allowed"
                            disabled
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="md">
          <Modal.Header>New Payslip</Modal.Header>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Employee ID</label>
              <input
                type="number"
                name="employee"
                value={form.employee}
                onChange={e => setForm(prev => ({ ...prev, employee: e.target.value }))}
                required
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Basic Salary</label>
                <input
                  type="number"
                  name="basic_salary"
                  value={form.basic_salary}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">HRA</label>
                <input
                  type="number"
                  name="hra"
                  value={form.hra}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Allowances</label>
                <input
                  type="number"
                  name="allowances"
                  value={form.allowances}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deductions</label>
                <input
                  type="number"
                  name="deductions"
                  value={form.deductions}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <div className="flex justify-end gap-2">
              <Modal.CloseButton variant="ghost">Cancel</Modal.CloseButton>
              <button
                type="submit"
                className="btn-primary px-6 py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Payslip'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Payslips;

