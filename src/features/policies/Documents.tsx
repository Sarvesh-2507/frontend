import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Upload, Filter, Download, FolderOpen } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import BackButton from '../../components/ui/BackButton';

interface DocumentItem {
  id: string;
  name: string;
  category: string;
  size: string;
  uploadedAt: string;
}

const Documents: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState('');

  const docs: DocumentItem[] = [
    { id: '1', name: 'Employee Handbook.pdf', category: 'HR', size: '2.3 MB', uploadedAt: '2024-01-12' },
    { id: '2', name: 'Leave Policy v2.pdf', category: 'HR', size: '0.8 MB', uploadedAt: '2024-01-10' },
    { id: '3', name: 'Security Guidelines.pdf', category: 'IT', size: '1.1 MB', uploadedAt: '2023-12-20' },
  ];

  const filtered = docs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center space-x-4">
            <BackButton variant="home" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <FolderOpen className="w-8 h-8 text-blue-600" />
                <span>Documents</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Browse and manage documents</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search documents..."
                  value={search}
                  onChange={(e)=>setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Upload</button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Download</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((d) => (
                <motion.div key={d.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{d.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{d.category}</p>
                    </div>
                    <span className="text-xs text-gray-500">{d.size}</span>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">Uploaded {new Date(d.uploadedAt).toLocaleDateString()}</div>
                  <div className="mt-4 flex items-center space-x-2">
                    <button className="px-3 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">View</button>
                    <button className="px-3 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Download</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Documents;
