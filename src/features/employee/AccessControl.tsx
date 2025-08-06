import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Key,
  Lock,
  Unlock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  status: 'active' | 'inactive';
}

interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
}

const AccessControl: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('roles');
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockRoles: UserRole[] = [
      {
        id: '1',
        name: 'Administrator',
        description: 'Full system access with all permissions',
        permissions: ['user_management', 'system_settings', 'reports', 'payroll'],
        userCount: 3,
        status: 'active'
      },
      {
        id: '2',
        name: 'HR Manager',
        description: 'Human resources management permissions',
        permissions: ['employee_management', 'attendance', 'leave_management', 'reports'],
        userCount: 5,
        status: 'active'
      },
      {
        id: '3',
        name: 'Employee',
        description: 'Basic employee access permissions',
        permissions: ['view_profile', 'attendance', 'leave_request'],
        userCount: 45,
        status: 'active'
      },
      {
        id: '4',
        name: 'Manager',
        description: 'Team management permissions',
        permissions: ['team_management', 'attendance', 'leave_approval', 'reports'],
        userCount: 8,
        status: 'active'
      }
    ];

    const mockPermissions: Permission[] = [
      {
        id: '1',
        name: 'User Management',
        category: 'Administration',
        description: 'Create, edit, and delete user accounts'
      },
      {
        id: '2',
        name: 'Employee Management',
        category: 'HR',
        description: 'Manage employee profiles and information'
      },
      {
        id: '3',
        name: 'Attendance Management',
        category: 'HR',
        description: 'View and manage attendance records'
      },
      {
        id: '4',
        name: 'Leave Management',
        category: 'HR',
        description: 'Approve and manage leave requests'
      },
      {
        id: '5',
        name: 'Payroll Access',
        category: 'Finance',
        description: 'Access payroll information and processing'
      },
      {
        id: '6',
        name: 'Reports Access',
        category: 'Analytics',
        description: 'Generate and view system reports'
      }
    ];
    
    setTimeout(() => {
      setRoles(mockRoles);
      setPermissions(mockPermissions);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/employee-profile')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Control</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage user roles and permissions</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Role</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('roles')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'roles'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Roles</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('permissions')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'permissions'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Key className="w-4 h-4" />
                      <span>Permissions</span>
                    </div>
                  </button>
                </nav>
              </div>

              {/* Search */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'roles' ? (
                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      filteredRoles.map((role) => (
                        <motion.div
                          key={role.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Shield className="w-5 h-5 text-blue-500" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {role.name}
                                </h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(role.status)}`}>
                                  {role.status}
                                </span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 mb-2">
                                {role.description}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{role.userCount} users</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Key className="w-4 h-4" />
                                  <span>{role.permissions.length} permissions</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      filteredPermissions.map((permission) => (
                        <motion.div
                          key={permission.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Key className="w-5 h-5 text-green-500" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {permission.name}
                                </h3>
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                  {permission.category}
                                </span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400">
                                {permission.description}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccessControl;
