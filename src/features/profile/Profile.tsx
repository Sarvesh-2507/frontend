import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Building,
  Calendar,
  Camera,
  CreditCard,
  Edit,
  FileText,
  Mail,
  Phone,
  User,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const Profile: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const profileData = {
    // Personal Information
    firstName: "Faruque",
    lastName: "Ahmad",
    employeeId: "PFP001",
    email: "mfaruqueahmad@gmail.com",
    workEmail: "mfaruqueahmad@gmail.com",
    phone: "0738630557",
    workPhone: "None",
    dateOfBirth: "10 Sep",
    gender: "Male",
    address: "Tangail",
    country: "Bangladesh",
    state: "Tangail",
    city: "Tangail",
    qualification: "MSc",
    experience: "5",
    maritalStatus: "Married",
    children: "1",
    emergencyContact: "01710651546",
    emergencyContactName: "Rasheda",
    emergencyContactRelation: "Sister",

    // Work Information
    department: "Finance",
    position: "System Admin - (Finance)",
    shiftInformation: "Night Shift",
    workType: "Work From Office",
    employeeType: "Tempo indeterminato",
    salary: "100000",
    reportingManager: "Ana Pawell (PFP43)",
    workLocation: "None",
    endDate: "01/31/2030",
    joiningDate: "06/01/2025",
    tags: "None",

    // Bank Information
    bankName: "punjab national bank",
    accountNumber: "123456789",
    branch: "noida",
    bankCode1: "123",
    bankAddress: "137",
    country2: "-1",
    bankCode2: "None",

    // Company Information
    company: "Horilla INC",
  };

  const tabs = [
    { id: "about", label: "About", icon: User },
    { id: "work-type-shift", label: "Work Type & Shift", icon: Briefcase },
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "leave", label: "Leave", icon: FileText },
    { id: "payroll", label: "Payroll", icon: CreditCard },
    { id: "allowance-deduction", label: "Allowance & Deduction", icon: Award },
    { id: "penalty-account", label: "Penalty Account", icon: Users },
    { id: "assets", label: "Assets", icon: Building },
    { id: "performance", label: "Performance", icon: Award },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "bonus-points", label: "Bonus Points", icon: Award },
  ];

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
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  User Profile
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your personal information and settings
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </motion.button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 mb-6"
            >
              <div className="flex items-start space-x-6">
                {/* Profile Photo */}
                <div className="relative">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {profileData.firstName.charAt(0)}
                      {profileData.lastName.charAt(0)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {profileData.firstName} {profileData.lastName} (
                    {profileData.employeeId})
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>Work Email: {profileData.workEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>Email: {profileData.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span>Work Phone: {profileData.workPhone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span>Phone: {profileData.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="card mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6 overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                          activeTab === tab.id
                            ? "border-blue-500 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "about" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <span>Personal Information</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date of Birth
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {profileData.dateOfBirth}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Gender
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {profileData.gender}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Address
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {profileData.address}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Country
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {profileData.country}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            State
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {profileData.state}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            City
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {profileData.city}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Work Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <Briefcase className="w-5 h-5 text-green-600" />
                        <span>Work Information</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Department
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {profileData.department}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Position
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {profileData.position}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Company
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {profileData.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Other tabs content */}
                {activeTab !== "about" && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <FileText className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {tabs.find((tab) => tab.id === activeTab)?.label}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      This section is coming soon.
                    </p>
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

export default Profile;
