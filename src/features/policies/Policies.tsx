import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Plus, Download, Eye } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import BackButton from '../../components/ui/BackButton';

interface Policy {
  id: string;
  title: string;
  category: string;
  updatedAt: string;
  status: 'active' | 'draft' | 'archived';
}

const Policies: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const policies: Policy[] = [
    { id: '1', title: 'Leave Policy', category: 'HR', updatedAt: '2024-01-10', status: 'active' },
    { id: '2', title: 'Code of Conduct', category: 'HR', updatedAt: '2024-01-05', status: 'active' },
    { id: '3', title: 'IT Security Policy', category: 'IT', updatedAt: '2023-12-22', status: 'draft' },
  ];

  const filtered = policies.filter(p =>
    (filter === 'all' || p.status === filter) &&
    (p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center space-x-4">
            <BackButton variant="home" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <span>Policies</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Manage company policies</p>
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
                  placeholder="Search policies..."
                  value={searchTerm}
                  onChange={(e)=>setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="policy-filter" className="sr-only">Filter policies by status</label>
                <select
                  id="policy-filter"
                  value={filter}
                  onChange={(e)=>setFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                  aria-label="Filter policies by status"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                <button 
                  type="button" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  aria-label="Create new policy"
                >
                  <Plus className="w-4 h-4" /><span>New Policy</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <motion.div key={p.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{p.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{p.category}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${p.status==='active'?'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400':p.status==='draft'?'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400':'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'}`}>{p.status}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-gray-500">Updated {new Date(p.updatedAt).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-2">
                      <button 
                        type="button" 
                        aria-label="View Policy" 
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        type="button" 
                        aria-label="Download Policy" 
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
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

export default Policies;
