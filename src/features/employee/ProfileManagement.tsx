import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  ArrowLeft,
  Camera,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  location: string;
  joinDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
  manager: string;
  employeeId: string;
  salary: string;
  emergencyContact: string;
}

const ProfileManagement: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockEmployees: Employee[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@company.com',
        phone: '+1 234 567 8900',
        department: 'Engineering',
        position: 'Senior Developer',
        location: 'New York',
        joinDate: '2023-01-15',
        status: 'active',
        manager: 'Sarah Wilson',
        employeeId: 'EMP001',
        salary: '$85,000',
        emergencyContact: '+1 234 567 8901'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        phone: '+1 234 567 8901',
        department: 'Marketing',
        position: 'Marketing Manager',
        location: 'California',
        joinDate: '2022-11-20',
        status: 'active',
        manager: 'Mike Johnson',
        employeeId: 'EMP002',
        salary: '$75,000',
        emergencyContact: '+1 234 567 8902'
      }
    ];
    
    setTimeout(() => {
      setEmployees(mockEmployees);
      setSelectedEmployee(mockEmployees[0]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form logic here
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage employee profiles and information</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Employee List */}
          <div className="w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="space-y-2">
                {filteredEmployees.map((employee) => (
                  <motion.div
                    key={employee.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedEmployee(employee)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedEmployee?.id === employee.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                          {employee.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {employee.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {employee.employeeId} • {employee.department}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedEmployee ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
              >
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-2xl">
                          {selectedEmployee.name.charAt(0)}
                        </span>
                      </div>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                          <Camera className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          defaultValue={selectedEmployee.name}
                          className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none"
                        />
                      ) : (
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedEmployee.name}
                        </h2>
                      )}
                      <p className="text-gray-600 dark:text-gray-400">{selectedEmployee.position}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">{selectedEmployee.employeeId}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        selectedEmployee.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {selectedEmployee.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        {isEditing ? (
                          <input
                            type="email"
                            defaultValue={selectedEmployee.email}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        ) : (
                          <span className="text-gray-900 dark:text-white">{selectedEmployee.email}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        {isEditing ? (
                          <input
                            type="tel"
                            defaultValue={selectedEmployee.phone}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        ) : (
                          <span className="text-gray-900 dark:text-white">{selectedEmployee.phone}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        {isEditing ? (
                          <input
                            type="text"
                            defaultValue={selectedEmployee.location}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        ) : (
                          <span className="text-gray-900 dark:text-white">{selectedEmployee.location}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Work Information */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Work Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-gray-400" />
                        {isEditing ? (
                          <select className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                            <option value={selectedEmployee.department}>{selectedEmployee.department}</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Marketing">Marketing</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                          </select>
                        ) : (
                          <span className="text-gray-900 dark:text-white">{selectedEmployee.department}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        {isEditing ? (
                          <input
                            type="text"
                            defaultValue={selectedEmployee.manager}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          />
                        ) : (
                          <span className="text-gray-900 dark:text-white">{selectedEmployee.manager}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          Joined {new Date(selectedEmployee.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Select an Employee
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose an employee from the list to view and edit their profile
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
