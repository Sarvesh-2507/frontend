import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Plus, Save } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { payrollAPI } from '../../services/moduleApis';

interface TaxRuleRow {
  id: string;
  name: string;
  rate: number;
  threshold?: number;
}

const TaxManagement: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rules, setRules] = useState<TaxRuleRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await payrollAPI.getTaxRules();
        setRules(res.data as any);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addRule = () => {
    const id = Math.random().toString(36).slice(2, 8);
    setRules(prev => [...prev, { id, name: 'New Rule', rate: 0 }]);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="header-modern px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <Calculator className="w-8 h-8 text-amber-600" />
                <span>Income Tax Management (TDS)</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Configure income tax slabs and rules</p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={addRule}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
                <Plus className="w-4 h-4" />
                <span>Add Rule</span>
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Save className="w-4 h-4" />
                <span>Save</span>
              </motion.button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="card p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4">Rule Name</th>
                    <th className="text-left py-3 px-4">Rate (%)</th>
                    <th className="text-left py-3 px-4">Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((r, idx) => (
                    <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4">
                        <input value={r.name} onChange={(e) => {
                          const name = e.target.value; setRules(prev => prev.map((x, i) => i === idx ? { ...x, name } : x));
                        }} className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                      </td>
                      <td className="py-3 px-4">
                        <input type="number" min={0} max={100} value={r.rate}
                          onChange={(e) => { const rate = Number(e.target.value); setRules(prev => prev.map((x, i) => i === idx ? { ...x, rate } : x)); }}
                          className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                      </td>
                      <td className="py-3 px-4">
                        <input type="number" value={r.threshold ?? ''}
                          onChange={(e) => { const threshold = e.target.value === '' ? undefined : Number(e.target.value); setRules(prev => prev.map((x, i) => i === idx ? { ...x, threshold } : x)); }}
                          className="w-32 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading && <div className="text-sm text-gray-500 mt-4">Loading...</div>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaxManagement;


