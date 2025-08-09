import { motion } from "framer-motion";
import {
  AlertCircle,
  DollarSign,
  Download,
  Edit,
  Eye,
  Filter,
  Plus,
  Search,
  TrendingUp,
  Users,
  ArrowLeft,
  BarChart3,
  FileText,
  CreditCard,
  Calculator,
  Calendar,
  Settings,
  Shield,
  Clock,
  Building,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "../../components/Sidebar";
import Logo from "../../components/ui/Logo";
import { dashboardAPI } from "../../services/api";

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  baseSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  netPay: number;
  payPeriod: string;
  status: "pending" | "processed" | "paid";
  taxDeductions?: number;
  providentFund?: number;
  insurance?: number;
}

interface SubModule {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  description: string;
  count?: number;
}

interface PayrollStats {
  totalEmployees: number;
  totalPayroll: number;
  pendingPayroll: number;
  processedPayroll: number;
  averageSalary: number;
  totalTaxDeductions: number;
}

interface SalaryStructure {
  employeeId: string;
  employeeName: string;
  basicSalary: number;
  hra: number;
  da: number;
  allowances: number;
  pf: number;
  tax: number;
  insurance: number;
  grossSalary: number;
  netSalary: number;
}

const Payroll: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeSubModule, setActiveSubModule] = useState("salary-structure");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<PayrollStats>({
    totalEmployees: 0,
    totalPayroll: 0,
    pendingPayroll: 0,
    processedPayroll: 0,
    averageSalary: 0,
    totalTaxDeductions: 0,
  });
  const navigate = useNavigate();

  const subModules: SubModule[] = [
    {
      id: "salary-structure",
      name: "Salary Structure",
      icon: Calculator,
      path: "/payroll/salary-structure",
      description: "Setup employee salary structures",
    },
    {
      id: "payroll-run",
      name: "Payroll Run",
      icon: DollarSign,
      path: "/payroll/run",
      description: "Process monthly/quarterly payroll",
      count: stats.pendingPayroll,
    },
    {
      id: "payslip",
      name: "Payslip Generation",
      icon: FileText,
      path: "/payroll/payslip",
      description: "Generate and distribute payslips",
    },
  ];

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStats();
      if (response.data) {
        setStats({
          totalEmployees: response.data.data?.totalEmployees || payrollRecords.length,
          totalPayroll: response.data.data?.totalPayroll || payrollRecords.reduce((sum, r) => sum + r.netPay, 0),
          pendingPayroll: response.data.data?.pendingPayroll || payrollRecords.filter(r => r.status === 'pending').length,
          processedPayroll: response.data.data?.processedPayroll || payrollRecords.filter(r => r.status === 'processed').length,
          averageSalary: response.data.data?.averageSalary || 75000,
          totalTaxDeductions: response.data.data?.totalTaxDeductions || 125000,
        });
      }
      toast.success("Payroll data loaded successfully");
    } catch (error) {
      console.error("Error fetching payroll data:", error);
      setStats({
        totalEmployees: payrollRecords.length,
        totalPayroll: payrollRecords.reduce((sum, r) => sum + r.netPay, 0),
        pendingPayroll: payrollRecords.filter(r => r.status === 'pending').length,
        processedPayroll: payrollRecords.filter(r => r.status === 'processed').length,
        averageSalary: 75000,
        totalTaxDeductions: 125000,
      });
      toast.error("Using offline data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubModuleClick = (subModule: SubModule) => {
    setActiveSubModule(subModule.id);
    navigate(subModule.path);
  };

  const payrollRecords: PayrollRecord[] = [
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "John Doe",
      department: "Engineering",
      baseSalary: 5000,
      overtime: 500,
      bonuses: 1000,
      deductions: 200,
      netPay: 6300,
      payPeriod: "January 2024",
      status: "paid",
    },
    {
      id: "2",
      employeeId: "EMP002",
      employeeName: "Sarah Wilson",
      department: "Marketing",
      baseSalary: 4500,
      overtime: 200,
      bonuses: 500,
      deductions: 150,
      netPay: 5050,
      payPeriod: "January 2024",
      status: "processed",
    },
    {
      id: "3",
      employeeId: "EMP003",
      employeeName: "Mike Johnson",
      department: "HR",
      baseSalary: 4000,
      overtime: 0,
      bonuses: 300,
      deductions: 100,
      netPay: 4200,
      payPeriod: "January 2024",
      status: "pending",
    },
  ];

  const payrollStats = [
    {
      title: "Total Payroll",
      value: "$15,550",
      change: "+5.2%",
      changeType: "increase" as const,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Employees Paid",
      value: "248",
      change: "+12",
      changeType: "increase" as const,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Pending Payments",
      value: "5",
      change: "-3",
      changeType: "decrease" as const,
      icon: AlertCircle,
      color: "bg-yellow-500",
    },
    {
      title: "Avg. Salary",
      value: "$4,850",
      change: "+2.1%",
      changeType: "increase" as const,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "processed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const filteredRecords = payrollRecords.filter(
    (record) =>
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="header-modern px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                <span>Payroll Management</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage employee salaries, bonuses, and payroll processing
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Process Payroll</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Submodule Navigation */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-3">
            <div className="flex space-x-1 overflow-x-auto">
              {subModules.map((subModule) => {
                const Icon = subModule.icon;
                const isActive = activeSubModule === subModule.id;
                return (
                  <button
                    key={subModule.id}
                    onClick={() => handleSubModuleClick(subModule)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{subModule.name}</span>
                    {subModule.count !== undefined && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isActive
                          ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      }`}>
                        {subModule.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Payroll Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {payrollStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="stat-card"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p
                          className={`text-sm ${
                            stat.changeType === "increase"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {stat.change} from last month
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Payroll Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Payroll Records
                </h3>

                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    title="Filter payroll records"
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Employee
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Department
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Base Salary
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Overtime
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Net Pay
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {record.employeeName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {record.employeeId}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {record.department}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          ${record.baseSalary.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          ${record.overtime.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                          ${record.netPay.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              record.status
                            )}`}
                          >
                            {record.status.charAt(0).toUpperCase() +
                              record.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              title="View payroll record"
                              className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              title="Edit payroll record"
                              className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Payroll;
