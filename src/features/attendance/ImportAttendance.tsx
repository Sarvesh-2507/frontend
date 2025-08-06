import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  RefreshCw,
  FileSpreadsheet,
  Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

interface ImportRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'valid' | 'error' | 'warning';
  errors?: string[];
  warnings?: string[];
}

interface ImportStats {
  totalRecords: number;
  validRecords: number;
  errorRecords: number;
  warningRecords: number;
}

const ImportAttendance: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importRecords, setImportRecords] = useState<ImportRecord[]>([]);
  const [importStats, setImportStats] = useState<ImportStats>({
    totalRecords: 0,
    validRecords: 0,
    errorRecords: 0,
    warningRecords: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowPreview(false);
      setImportRecords([]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setSelectedFile(file);
      setShowPreview(false);
      setImportRecords([]);
    }
  };

  const processFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock processed data
      const mockRecords: ImportRecord[] = [
        {
          id: '1',
          employeeId: 'EMP001',
          employeeName: 'John Doe',
          date: '2024-01-15',
          checkIn: '09:00',
          checkOut: '18:00',
          status: 'valid'
        },
        {
          id: '2',
          employeeId: 'EMP002',
          employeeName: 'Jane Smith',
          date: '2024-01-15',
          checkIn: '09:15',
          checkOut: '17:45',
          status: 'warning',
          warnings: ['Late check-in']
        },
        {
          id: '3',
          employeeId: 'EMP999',
          employeeName: 'Unknown Employee',
          date: '2024-01-15',
          checkIn: '09:00',
          checkOut: '18:00',
          status: 'error',
          errors: ['Employee ID not found']
        },
        {
          id: '4',
          employeeId: 'EMP003',
          employeeName: 'Mike Johnson',
          date: '2024-01-15',
          checkIn: '25:00',
          checkOut: '18:00',
          status: 'error',
          errors: ['Invalid check-in time format']
        }
      ];

      setImportRecords(mockRecords);
      
      const stats = {
        totalRecords: mockRecords.length,
        validRecords: mockRecords.filter(r => r.status === 'valid').length,
        errorRecords: mockRecords.filter(r => r.status === 'error').length,
        warningRecords: mockRecords.filter(r => r.status === 'warning').length
      };
      
      setImportStats(stats);
      setShowPreview(true);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const validRecords = importRecords.filter(r => r.status === 'valid' || r.status === 'warning');
      console.log('Importing records:', validRecords);
      
      // Reset state after successful import
      setSelectedFile(null);
      setImportRecords([]);
      setShowPreview(false);
      setImportStats({ totalRecords: 0, validRecords: 0, errorRecords: 0, warningRecords: 0 });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing data:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    // Create CSV template
    const csvContent = `Employee ID,Employee Name,Date,Check In,Check Out,Notes
EMP001,John Doe,2024-01-15,09:00,18:00,
EMP002,Jane Smith,2024-01-15,09:15,17:45,Late arrival`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/attendance')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Import Attendance</h1>
                <p className="text-gray-600 dark:text-gray-400">Import attendance data from Excel or CSV files</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={downloadTemplate}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Template</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload File</h3>
              
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  
                  {selectedFile ? (
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                        Drop your file here or click to browse
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Supports CSV, XLS, XLSX files up to 10MB
                      </p>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Choose File
                    </button>
                    
                    {selectedFile && !showPreview && (
                      <button
                        onClick={processFile}
                        disabled={isProcessing}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>Preview</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Import Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Import Instructions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
                <div>
                  <h5 className="font-medium mb-2">Required Columns:</h5>
                  <ul className="space-y-1">
                    <li>• Employee ID</li>
                    <li>• Employee Name</li>
                    <li>• Date (YYYY-MM-DD)</li>
                    <li>• Check In (HH:MM)</li>
                    <li>• Check Out (HH:MM)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">File Requirements:</h5>
                  <ul className="space-y-1">
                    <li>• Maximum file size: 10MB</li>
                    <li>• Supported formats: CSV, XLS, XLSX</li>
                    <li>• First row should contain headers</li>
                    <li>• Date format: YYYY-MM-DD</li>
                    <li>• Time format: 24-hour (HH:MM)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                {/* Stats */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Import Preview</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setShowPreview(false)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear</span>
                      </button>
                      <button
                        onClick={handleImport}
                        disabled={isImporting || importStats.errorRecords === importStats.totalRecords}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isImporting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Importing...</span>
                          </>
                        ) : (
                          <>
                            <Database className="w-4 h-4" />
                            <span>Import Data</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <FileSpreadsheet className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{importStats.totalRecords}</p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Valid</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">{importStats.validRecords}</p>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-600">Warnings</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{importStats.warningRecords}</p>
                    </div>
                    
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-red-600">Errors</span>
                      </div>
                      <p className="text-2xl font-bold text-red-900 dark:text-red-100">{importStats.errorRecords}</p>
                    </div>
                  </div>
                </div>

                {/* Records Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Check In
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Check Out
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Issues
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {importRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {getStatusIcon(record.status)}
                              <span className="capitalize">{record.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {record.employeeName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {record.employeeId}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {record.date}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {record.checkIn}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {record.checkOut}
                          </td>
                          <td className="px-6 py-4">
                            {record.errors && record.errors.length > 0 && (
                              <div className="space-y-1">
                                {record.errors.map((error, index) => (
                                  <div key={index} className="text-xs text-red-600 dark:text-red-400">
                                    • {error}
                                  </div>
                                ))}
                              </div>
                            )}
                            {record.warnings && record.warnings.length > 0 && (
                              <div className="space-y-1">
                                {record.warnings.map((warning, index) => (
                                  <div key={index} className="text-xs text-yellow-600 dark:text-yellow-400">
                                    • {warning}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ImportAttendance;
