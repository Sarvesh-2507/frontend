import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, User } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import BackButton from '../../components/ui/BackButton';

interface AckItem {
  id: string;
  policy: string;
  employee: string;
  date: string;
  status: 'acknowledged' | 'pending';
}

const Acknowledgements: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const items: AckItem[] = [
    { id: '1', policy: 'Code of Conduct', employee: 'John Doe', date: '2024-01-10', status: 'acknowledged' },
    { id: '2', policy: 'IT Security', employee: 'Sarah Wilson', date: '2024-01-12', status: 'pending' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center space-x-4">
            <BackButton variant="home" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <span>Acknowledgements</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Track policy acknowledgements</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3">Policy</th>
                    <th className="py-3">Employee</th>
                    <th className="py-3">Date</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i)=> (
                    <tr key={i.id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3">{i.policy}</td>
                      <td className="py-3 flex items-center space-x-2"><User className="w-4 h-4" />{i.employee}</td>
                      <td className="py-3">{new Date(i.date).toLocaleDateString()}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${i.status==='acknowledged'?'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400':'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'}`}>{i.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Acknowledgements;
