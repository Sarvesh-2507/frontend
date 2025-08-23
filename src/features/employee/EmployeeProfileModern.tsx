import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Building,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  FileText,
  Globe,
  Heart,
  Home,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  Smartphone,
  Star,
  Target,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// Redux
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchEmployeeProfile,
  setCurrentEmployee,
  setEditMode,
  updateEmployeeProfile,
  updateEmployeeStatus,
  uploadProfilePhoto,
} from "../../store/slices/employeeSlice";
import { setActiveTab } from "../../store/slices/uiSlice";

// UI Components
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

// Mock data for demonstration
const mockEmployeeData = {
  id: "1",
  employeeId: "PFP001",
  name: "Faruque Ahmad",
  email: "faruque.ahmad@company.com",
  phone: "+880 1234567890",
  avatar: "",
  status: "online" as const,
  personalInfo: {
    dateOfBirth: "1990-09-10",
    gender: "Male",
    address: "House 123, Road 456, Sector 7",
    country: "Bangladesh",
    state: "Dhaka",
    city: "Tangail",
    postalCode: "1900",
    nationality: "Bangladeshi",
    maritalStatus: "Single",
    bloodGroup: "O+",
    emergencyContact: {
      name: "John Doe",
      relationship: "Father",
      phone: "+880 9876543210",
      email: "john.doe@email.com",
    },
  },
  workInfo: {
    department: "Finance",
    jobPosition: "System Admin (Finance)",
    shift: "Night Shift",
    workType: "Work From Office",
    salary: "100,000 BDT",
    joiningDate: "2025-01-06",
    reportingManager: "Aria Powell (PFP43)",
    employeeType: "Permanent",
    workLocation: "Dhaka Office",
    probationPeriod: "6 months",
    noticePeriod: "30 days",
    workEmail: "faruque.ahmad@company.com",
  },
  skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "AWS"],
  certifications: [
    "AWS Certified Developer",
    "React Professional",
    "Scrum Master",
  ],
  education: [
    {
      degree: "Bachelor of Computer Science",
      institution: "University of Dhaka",
      year: "2012",
      grade: "First Class",
    },
    {
      degree: "Master of Information Technology",
      institution: "BUET",
      year: "2014",
      grade: "Distinction",
    },
  ],
  experience: [
    {
      company: "Tech Solutions Ltd.",
      position: "Senior Developer",
      duration: "2020-2024",
      description:
        "Led development team for multiple web applications using React and Node.js.",
    },
    {
      company: "Digital Innovations",
      position: "Full Stack Developer",
      duration: "2018-2020",
      description:
        "Developed and maintained e-commerce platforms and mobile applications.",
    },
  ],
  documents: [
    {
      id: "1",
      name: "Resume.pdf",
      type: "Resume",
      uploadDate: "2025-01-01",
      size: "2.5 MB",
    },
    {
      id: "2",
      name: "Certificates.pdf",
      type: "Certificates",
      uploadDate: "2025-01-01",
      size: "1.8 MB",
    },
  ],
  attendance: {
    totalDays: 22,
    presentDays: 20,
    absentDays: 1,
    leaveDays: 1,
    attendancePercentage: 91,
  },
  leave: {
    totalLeave: 25,
    usedLeave: 8,
    remainingLeave: 17,
    pendingRequests: 2,
  },
  performance: {
    currentRating: 4.5,
    goals: [
      {
        title: "Complete React Certification",
        status: "completed" as const,
        deadline: "2025-03-01",
      },
      {
        title: "Lead Team Project",
        status: "in-progress" as const,
        deadline: "2025-06-01",
      },
    ],
    reviews: [
      {
        period: "Q4 2024",
        rating: 4.5,
        feedback: "Excellent performance with strong technical skills.",
      },
      {
        period: "Q3 2024",
        rating: 4.2,
        feedback: "Good progress on project deliverables.",
      },
    ],
  },
};

const EmployeeProfileModern: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentEmployee, isLoading, error, editMode } = useAppSelector(
    (state) => state.employee
  );
  const { activeTab } = useAppSelector((state) => state.ui);

  // Local state for temporary edits
  const [tempBasicInfo, setTempBasicInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [tempPersonalInfo, setTempPersonalInfo] = useState({
    dateOfBirth: "",
    gender: "",
    address: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    nationality: "",
    maritalStatus: "",
    bloodGroup: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
  });

  const [tempWorkInfo, setTempWorkInfo] = useState({
    department: "",
    jobPosition: "",
    shift: "",
    workType: "",
    salary: "",
    joiningDate: "",
    reportingManager: "",
    employeeType: "",
    workLocation: "",
    probationPeriod: "",
    noticePeriod: "",
    workEmail: "",
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Initialize with mock data and set active tab
  useEffect(() => {
    dispatch(setCurrentEmployee(mockEmployeeData));
    dispatch(setActiveTab("about"));
  }, [dispatch]);

  // Update temp state when employee data changes
  useEffect(() => {
    if (currentEmployee) {
      setTempBasicInfo({
        name: currentEmployee.name || "",
        email: currentEmployee.email || "",
        phone: currentEmployee.phone || "",
      });

      setTempPersonalInfo({
        dateOfBirth: currentEmployee.personalInfo?.dateOfBirth || "",
        gender: currentEmployee.personalInfo?.gender || "",
        address: currentEmployee.personalInfo?.address || "",
        country: currentEmployee.personalInfo?.country || "",
        state: currentEmployee.personalInfo?.state || "",
        city: currentEmployee.personalInfo?.city || "",
        postalCode: currentEmployee.personalInfo?.postalCode || "",
        nationality: currentEmployee.personalInfo?.nationality || "",
        maritalStatus: currentEmployee.personalInfo?.maritalStatus || "",
        bloodGroup: currentEmployee.personalInfo?.bloodGroup || "",
        emergencyContact: {
          name: currentEmployee.personalInfo?.emergencyContact?.name || "",
          relationship:
            currentEmployee.personalInfo?.emergencyContact?.relationship || "",
          phone: currentEmployee.personalInfo?.emergencyContact?.phone || "",
          email: currentEmployee.personalInfo?.emergencyContact?.email || "",
        },
      });

      setTempWorkInfo({
        department: currentEmployee.workInfo?.department || "",
        jobPosition: currentEmployee.workInfo?.jobPosition || "",
        shift: currentEmployee.workInfo?.shift || "",
        workType: currentEmployee.workInfo?.workType || "",
        salary: currentEmployee.workInfo?.salary || "",
        joiningDate: currentEmployee.workInfo?.joiningDate || "",
        reportingManager: currentEmployee.workInfo?.reportingManager || "",
        employeeType: currentEmployee.workInfo?.employeeType || "",
        workLocation: currentEmployee.workInfo?.workLocation || "",
        probationPeriod: currentEmployee.workInfo?.probationPeriod || "",
        noticePeriod: currentEmployee.workInfo?.noticePeriod || "",
        workEmail: currentEmployee.workInfo?.workEmail || "",
      });
    }
  }, [currentEmployee]);

  // Update temp data when employee data changes
  useEffect(() => {
    if (currentEmployee) {
      setTempBasicInfo({
        name: currentEmployee.name,
        email: currentEmployee.email,
        phone: currentEmployee.phone,
      });
    }
  }, [currentEmployee]);

  const tabs = [
    { id: "about", label: "About", icon: User },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "leave", label: "Leave", icon: Calendar },
    { id: "payroll", label: "Payroll", icon: DollarSign },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  const handleTabChange = (tabId: string) => {
    dispatch(setActiveTab(tabId));
  };

  const handleEditToggle = (section: "basic" | "personal" | "work") => {
    dispatch(setEditMode({ section, enabled: !editMode[section] }));
  };

  const handleBasicSave = async () => {
    try {
      await dispatch(
        updateEmployeeProfile({
          name: tempBasicInfo.name,
          email: tempBasicInfo.email,
          phone: tempBasicInfo.phone,
        })
      ).unwrap();

      dispatch(setEditMode({ section: "basic", enabled: false }));
      toast.success("Basic information updated successfully!");
    } catch (error) {
      toast.error("Failed to update basic information");
    }
  };

  const handlePersonalSave = async () => {
    try {
      await dispatch(
        updateEmployeeProfile({
          personalInfo: tempPersonalInfo,
        })
      ).unwrap();

      dispatch(setEditMode({ section: "personal", enabled: false }));
      toast.success("Personal information updated successfully!");
    } catch (error) {
      toast.error("Failed to update personal information");
    }
  };

  const handleWorkSave = async () => {
    try {
      await dispatch(
        updateEmployeeProfile({
          workInfo: tempWorkInfo,
        })
      ).unwrap();

      dispatch(setEditMode({ section: "work", enabled: false }));
      toast.success("Work information updated successfully!");
    } catch (error) {
      toast.error("Failed to update work information");
    }
  };

  const handleBasicCancel = () => {
    if (currentEmployee) {
      setTempBasicInfo({
        name: currentEmployee.name,
        email: currentEmployee.email,
        phone: currentEmployee.phone,
      });
    }
    dispatch(setEditMode({ section: "basic", enabled: false }));
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingPhoto(true);
      try {
        await dispatch(uploadProfilePhoto(file)).unwrap();
        toast.success("Profile photo updated successfully!");
      } catch (error) {
        toast.error("Failed to upload photo");
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  const handleStatusToggle = async () => {
    if (currentEmployee) {
      const newStatus =
        currentEmployee.status === "online" ? "offline" : "online";
      try {
        await dispatch(updateEmployeeStatus(newStatus)).unwrap();
        toast.success(`Status changed to ${newStatus}!`);
      } catch (error) {
        toast.error("Failed to update status");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "busy":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading employee profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <div className="text-red-500 mb-4">
            <X className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => dispatch(fetchEmployeeProfile("1"))}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentEmployee) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card variant="soft" shadow="soft" className="overflow-hidden">
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/20 to-purple-50/20 dark:from-transparent dark:via-blue-900/10 dark:to-purple-900/10"></div>

            <div className="relative flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8 p-8">
              {/* Profile Photo */}
              <div className="relative group">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 p-1 shadow-soft-xl">
                  {currentEmployee.avatar ? (
                    <img
                      src={currentEmployee.avatar}
                      alt={currentEmployee.name}
                      className="w-full h-full rounded-full object-cover bg-white"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-4xl lg:text-5xl font-bold text-gray-600 dark:text-gray-300">
                        {currentEmployee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Photo Upload */}
                <label className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-all duration-200 cursor-pointer shadow-soft-xl group-hover:scale-110">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  {uploadingPhoto ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                </label>

                {/* Status Indicator */}
                <button
                  type="button"
                  onClick={handleStatusToggle}
                  className="absolute top-2 right-2 group/status"
                  title={`Click to change status (Currently: ${getStatusLabel(
                    currentEmployee.status
                  )})`}
                >
                  <div
                    className={`w-6 h-6 ${getStatusColor(
                      currentEmployee.status
                    )} rounded-full border-3 border-white dark:border-gray-800 shadow-soft-md group-hover/status:scale-110 transition-transform duration-200`}
                  ></div>
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    {editMode.basic ? (
                      <Input
                        value={tempBasicInfo.name}
                        onChange={(e) =>
                          setTempBasicInfo((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="text-3xl lg:text-4xl font-bold mb-2"
                        variant="soft"
                      />
                    ) : (
                      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {currentEmployee.name}
                      </h1>
                    )}
                    <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                      <span className="text-lg text-gray-600 dark:text-gray-400">
                        ID: {currentEmployee.employeeId}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          currentEmployee.status
                        )} text-white shadow-soft-md`}
                      >
                        {getStatusLabel(currentEmployee.status)}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant={editMode.basic ? "secondary" : "soft"}
                    onClick={() => handleEditToggle("basic")}
                    icon={<Edit className="w-4 h-4" />}
                    className="self-center lg:self-start"
                  >
                    {editMode.basic ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-center lg:justify-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                    <Mail className="w-5 h-5 text-blue-600" />
                    {editMode.basic ? (
                      <Input
                        type="email"
                        value={tempBasicInfo.email}
                        onChange={(e) =>
                          setTempBasicInfo((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        variant="soft"
                        size="sm"
                      />
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">
                        {currentEmployee.email}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center lg:justify-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                    <Phone className="w-5 h-5 text-green-600" />
                    {editMode.basic ? (
                      <Input
                        type="tel"
                        value={tempBasicInfo.phone}
                        onChange={(e) =>
                          setTempBasicInfo((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        variant="soft"
                        size="sm"
                      />
                    ) : (
                      <span className="text-gray-700 dark:text-gray-300">
                        {currentEmployee.phone}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center lg:justify-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                    <Building className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {currentEmployee.workInfo.department}
                    </span>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {currentEmployee.workInfo.jobPosition}
                    </span>
                  </div>
                </div>

                {/* Basic Info Save/Cancel */}
                <AnimatePresence>
                  {editMode.basic && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-center lg:justify-start space-x-3 pt-4"
                    >
                      <Button
                        variant="ghost"
                        onClick={handleBasicCancel}
                        icon={<X className="w-4 h-4" />}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleBasicSave}
                        icon={<Save className="w-4 h-4" />}
                        loading={isLoading}
                      >
                        Save Changes
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <Card variant="soft" padding="none" className="overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-all duration-200 whitespace-nowrap border-b-2 ${
                      isActive
                        ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </Card>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "about" && (
              <div className="space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card variant="gradient" hover className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl mx-auto mb-4">
                      <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {currentEmployee.attendance.attendancePercentage}%
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Attendance
                    </p>
                  </Card>

                  <Card variant="gradient" hover className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl mx-auto mb-4">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {currentEmployee.leave.remainingLeave}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Leave Days
                    </p>
                  </Card>

                  <Card variant="gradient" hover className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl mx-auto mb-4">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {currentEmployee.performance.currentRating}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Performance
                    </p>
                  </Card>

                  <Card variant="gradient" hover className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl mx-auto mb-4">
                      <Target className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {
                        currentEmployee.performance.goals.filter(
                          (g) => g.status === "completed"
                        ).length
                      }
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Goals Completed
                    </p>
                  </Card>
                </div>

                {/* Personal Information */}
                <Card variant="soft" shadow="soft">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Personal Information
                    </h3>
                    <Button
                      variant="soft"
                      size="sm"
                      onClick={() => handleEditToggle("personal")}
                      icon={<Edit className="w-4 h-4" />}
                    >
                      {editMode.personal ? "Cancel" : "Edit"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        Date of Birth
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(
                          currentEmployee.personalInfo.dateOfBirth
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4 mr-2" />
                        Gender
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {currentEmployee.personalInfo.gender}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Heart className="w-4 h-4 mr-2" />
                        Marital Status
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {currentEmployee.personalInfo.maritalStatus}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Shield className="w-4 h-4 mr-2" />
                        Blood Group
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {currentEmployee.personalInfo.bloodGroup}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Globe className="w-4 h-4 mr-2" />
                        Nationality
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {currentEmployee.personalInfo.nationality}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Home className="w-4 h-4 mr-2" />
                        Address
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {currentEmployee.personalInfo.address},{" "}
                        {currentEmployee.personalInfo.city},{" "}
                        {currentEmployee.personalInfo.state},{" "}
                        {currentEmployee.personalInfo.country} -{" "}
                        {currentEmployee.personalInfo.postalCode}
                      </p>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Smartphone className="w-5 h-5 mr-2 text-red-600" />
                      Emergency Contact
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Name
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {currentEmployee.personalInfo.emergencyContact.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Relationship
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {
                            currentEmployee.personalInfo.emergencyContact
                              .relationship
                          }
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Phone
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {currentEmployee.personalInfo.emergencyContact.phone}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Email
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {currentEmployee.personalInfo.emergencyContact.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Work Information */}
                <Card variant="soft" shadow="soft">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
                      Work Information
                    </h3>
                    <Button
                      variant="soft"
                      size="sm"
                      onClick={() => handleEditToggle("work")}
                      icon={<Edit className="w-4 h-4" />}
                    >
                      {editMode.work ? "Cancel" : "Edit"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Building className="w-4 h-4 mr-2" />
                        Department
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {currentEmployee.workInfo.department}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Job Position
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {currentEmployee.workInfo.jobPosition}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        Shift
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {currentEmployee.workInfo.shift}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-2" />
                        Work Type
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {currentEmployee.workInfo.workType}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Salary
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {currentEmployee.workInfo.salary}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        Joining Date
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(
                          currentEmployee.workInfo.joiningDate
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4 mr-2" />
                        Reporting Manager
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {currentEmployee.workInfo.reportingManager}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Employee Type
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {currentEmployee.workInfo.employeeType}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        Work Location
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {currentEmployee.workInfo.workLocation}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Skills & Certifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card variant="soft" shadow="soft">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentEmployee.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Card>

                  <Card variant="soft" shadow="soft">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-yellow-600" />
                      Certifications
                    </h3>
                    <div className="space-y-2">
                      {currentEmployee.certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-900 dark:text-white">
                            {cert}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Education & Experience */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card variant="soft" shadow="soft">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                      Education
                    </h3>
                    <div className="space-y-4">
                      {currentEmployee.education.map((edu, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-indigo-500 pl-4"
                        >
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {edu.degree}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {edu.institution}
                          </p>
                          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-500">
                            <span>{edu.year}</span>
                            <span>{edu.grade}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card variant="soft" shadow="soft">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-orange-600" />
                      Experience
                    </h3>
                    <div className="space-y-4">
                      {currentEmployee.experience.map((exp, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-orange-500 pl-4"
                        >
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {exp.position}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {exp.company}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                            {exp.duration}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab !== "about" && (
              <Card variant="soft" className="text-center py-16">
                <div className="text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🚧</div>
                  <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                  <p>
                    The {tabs.find((t) => t.id === activeTab)?.label} section is
                    under development.
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmployeeProfileModern;
