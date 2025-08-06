import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Building,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Globe,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  Users,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface PersonalInfo {
  dateOfBirth: string;
  gender: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  nationality: string;
}

interface WorkInfo {
  department: string;
  jobPosition: string;
  shift: string;
  workType: string;
  salary: string;
  joiningDate: string;
  reportingManager: string;
  employeeType: string;
  workLocation: string;
}

interface EmployeeData {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: "online" | "offline";
  personalInfo: PersonalInfo;
  workInfo: WorkInfo;
}

interface BasicInfo {
  name: string;
  email: string;
  phone: string;
}

const EmployeeProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingWork, setEditingWork] = useState(false);
  const [editingBasic, setEditingBasic] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Dummy employee data
  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    id: "PFP001",
    name: "Faruque Ahmad",
    email: "faruque.ahmad@company.com",
    phone: "+880 1234567890",
    avatar: "/api/placeholder/150/150",
    status: "online",
    personalInfo: {
      dateOfBirth: "10 Sep 1990",
      gender: "Male",
      address: "House 123, Road 456",
      country: "Bangladesh",
      state: "Dhaka",
      city: "Tangail",
      postalCode: "1900",
      nationality: "Bangladeshi",
    },
    workInfo: {
      department: "Finance",
      jobPosition: "System Admin (Finance)",
      shift: "Night Shift",
      workType: "Work From Office",
      salary: "100,000 BDT",
      joiningDate: "06/01/2025",
      reportingManager: "Aria Powell (PFP43)",
      employeeType: "Permanent",
      workLocation: "Dhaka Office",
    },
  });

  const [tempPersonalInfo, setTempPersonalInfo] = useState<PersonalInfo>(
    employeeData.personalInfo
  );
  const [tempWorkInfo, setTempWorkInfo] = useState<WorkInfo>(
    employeeData.workInfo
  );
  const [tempBasicInfo, setTempBasicInfo] = useState<BasicInfo>({
    name: employeeData.name,
    email: employeeData.email,
    phone: employeeData.phone,
  });

  const tabs = [
    { id: "about", label: "About", icon: User },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "leave", label: "Leave", icon: Calendar },
    { id: "payroll", label: "Payroll", icon: DollarSign },
    { id: "performance", label: "Performance", icon: CheckCircle },
    { id: "documents", label: "Documents", icon: Briefcase },
  ];

  // Basic Info Handlers
  const handleBasicSave = () => {
    setEmployeeData((prev) => ({
      ...prev,
      name: tempBasicInfo.name,
      email: tempBasicInfo.email,
      phone: tempBasicInfo.phone,
    }));
    setEditingBasic(false);
    toast.success("Basic information updated successfully!");
  };

  const handleBasicCancel = () => {
    setTempBasicInfo({
      name: employeeData.name,
      email: employeeData.email,
      phone: employeeData.phone,
    });
    setEditingBasic(false);
  };

  // Personal Info Handlers
  const handlePersonalSave = () => {
    setEmployeeData((prev) => ({
      ...prev,
      personalInfo: tempPersonalInfo,
    }));
    setEditingPersonal(false);
    toast.success("Personal information updated successfully!");
  };

  const handlePersonalCancel = () => {
    setTempPersonalInfo(employeeData.personalInfo);
    setEditingPersonal(false);
  };

  // Work Info Handlers
  const handleWorkSave = () => {
    setEmployeeData((prev) => ({
      ...prev,
      workInfo: tempWorkInfo,
    }));
    setEditingWork(false);
    toast.success("Work information updated successfully!");
  };

  const handleWorkCancel = () => {
    setTempWorkInfo(employeeData.workInfo);
    setEditingWork(false);
  };

  // Photo Upload Handler
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingPhoto(true);

      // Simulate upload process
      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          setEmployeeData((prev) => ({
            ...prev,
            avatar: e.target?.result as string,
          }));
          setUploadingPhoto(false);
          toast.success("Profile photo updated successfully!");
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  // Status Toggle Handler
  const handleStatusToggle = () => {
    setEmployeeData((prev) => ({
      ...prev,
      status: prev.status === "online" ? "offline" : "online",
    }));
    toast.success(
      `Status changed to ${
        employeeData.status === "online" ? "offline" : "online"
      }!`
    );
  };

  const renderPersonalInfoField = (
    label: string,
    field: keyof PersonalInfo,
    icon: React.ComponentType<any>,
    type: "input" | "select" = "input",
    options?: string[]
  ) => {
    const Icon = icon;
    return (
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </label>
        {editingPersonal ? (
          type === "select" ? (
            <select
              value={tempPersonalInfo[field]}
              onChange={(e) =>
                setTempPersonalInfo((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={tempPersonalInfo[field]}
              onChange={(e) =>
                setTempPersonalInfo((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          )
        ) : (
          <p className="text-gray-900 dark:text-white">
            {employeeData.personalInfo[field]}
          </p>
        )}
      </div>
    );
  };

  const renderWorkInfoField = (
    label: string,
    field: keyof WorkInfo,
    icon: React.ComponentType<any>,
    type: "input" | "select" = "input",
    options?: string[]
  ) => {
    const Icon = icon;
    return (
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </label>
        {editingWork ? (
          type === "select" ? (
            <select
              value={tempWorkInfo[field]}
              onChange={(e) =>
                setTempWorkInfo((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={tempWorkInfo[field]}
              onChange={(e) =>
                setTempWorkInfo((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          )
        ) : (
          <p className="text-gray-900 dark:text-white">
            {employeeData.workInfo[field]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1">
                {employeeData.avatar &&
                employeeData.avatar !== "/api/placeholder/150/150" ? (
                  <img
                    src={employeeData.avatar}
                    alt={employeeData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                      {employeeData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                )}
              </div>

              {/* Photo Upload Button */}
              <label className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                {uploadingPhoto ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </label>

              {/* Status Indicator - Clickable */}
              <button
                type="button"
                onClick={handleStatusToggle}
                className="absolute top-2 right-2 group"
                title={`Click to change status to ${
                  employeeData.status === "online" ? "offline" : "online"
                }`}
              >
                {employeeData.status === "online" ? (
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 group-hover:scale-110 transition-transform"></div>
                ) : (
                  <div className="w-4 h-4 bg-gray-400 rounded-full border-2 border-white dark:border-gray-800 group-hover:scale-110 transition-transform"></div>
                )}
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-between mb-4">
                <div>
                  {editingBasic ? (
                    <input
                      type="text"
                      value={tempBasicInfo.name}
                      onChange={(e) =>
                        setTempBasicInfo((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {employeeData.name}
                    </h1>
                  )}
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                    Employee ID: {employeeData.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingBasic(!editingBasic)}
                  className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {editingBasic ? "Cancel" : "Edit"}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Mail className="w-5 h-5 text-gray-500" />
                  {editingBasic ? (
                    <input
                      type="email"
                      value={tempBasicInfo.email}
                      onChange={(e) =>
                        setTempBasicInfo((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="text-gray-700 dark:text-gray-300 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">
                      {employeeData.email}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Phone className="w-5 h-5 text-gray-500" />
                  {editingBasic ? (
                    <input
                      type="tel"
                      value={tempBasicInfo.phone}
                      onChange={(e) =>
                        setTempBasicInfo((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="text-gray-700 dark:text-gray-300 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">
                      {employeeData.phone}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Building className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {employeeData.workInfo.department}
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {employeeData.workInfo.jobPosition}
                  </span>
                </div>
              </div>

              {/* Basic Info Save/Cancel Buttons */}
              <AnimatePresence>
                {editingBasic && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-center md:justify-start space-x-3 mt-4"
                  >
                    <button
                      type="button"
                      onClick={handleBasicCancel}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleBasicSave}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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
            <AnimatePresence mode="wait">
              {activeTab === "about" && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {/* Personal Information Card */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Personal Information
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingPersonal(!editingPersonal)}
                        className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>{editingPersonal ? "Cancel" : "Edit"}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {renderPersonalInfoField(
                        "Date of Birth",
                        "dateOfBirth",
                        Calendar
                      )}
                      {renderPersonalInfoField(
                        "Gender",
                        "gender",
                        User,
                        "select",
                        ["Male", "Female", "Other"]
                      )}
                      {renderPersonalInfoField("Address", "address", MapPin)}
                      {renderPersonalInfoField("Country", "country", Globe)}
                      {renderPersonalInfoField("State", "state", MapPin)}
                      {renderPersonalInfoField("City", "city", Building)}
                      {renderPersonalInfoField(
                        "Postal Code",
                        "postalCode",
                        MapPin
                      )}
                      {renderPersonalInfoField(
                        "Nationality",
                        "nationality",
                        Globe
                      )}
                    </div>

                    <AnimatePresence>
                      {editingPersonal && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600"
                        >
                          <button
                            type="button"
                            onClick={handlePersonalCancel}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                          <button
                            type="button"
                            onClick={handlePersonalSave}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Work Information Card */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <Briefcase className="w-5 h-5 mr-2" />
                        Work Information
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingWork(!editingWork)}
                        className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>{editingWork ? "Cancel" : "Edit"}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {renderWorkInfoField(
                        "Department",
                        "department",
                        Building,
                        "select",
                        ["Finance", "HR", "IT", "Marketing", "Operations"]
                      )}
                      {renderWorkInfoField(
                        "Job Position",
                        "jobPosition",
                        Briefcase
                      )}
                      {renderWorkInfoField("Shift", "shift", Clock, "select", [
                        "Day Shift",
                        "Night Shift",
                        "Flexible",
                      ])}
                      {renderWorkInfoField(
                        "Work Type",
                        "workType",
                        Users,
                        "select",
                        ["Work From Office", "Work From Home", "Hybrid"]
                      )}
                      {renderWorkInfoField("Salary", "salary", DollarSign)}
                      {renderWorkInfoField(
                        "Joining Date",
                        "joiningDate",
                        Calendar
                      )}
                      {renderWorkInfoField(
                        "Reporting Manager",
                        "reportingManager",
                        User
                      )}
                      {renderWorkInfoField(
                        "Employee Type",
                        "employeeType",
                        Briefcase,
                        "select",
                        ["Permanent", "Contract", "Intern"]
                      )}
                      {renderWorkInfoField(
                        "Work Location",
                        "workLocation",
                        MapPin
                      )}
                    </div>

                    <AnimatePresence>
                      {editingWork && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600"
                        >
                          <button
                            type="button"
                            onClick={handleWorkCancel}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleWorkSave}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {activeTab !== "about" && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="text-center py-12"
                >
                  <div className="text-gray-500 dark:text-gray-400">
                    <div className="text-6xl mb-4">🚧</div>
                    <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                    <p>
                      The {tabs.find((t) => t.id === activeTab)?.label} section
                      is under development.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
