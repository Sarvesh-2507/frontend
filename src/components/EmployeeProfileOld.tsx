// Define types for personal and work info fields
type PersonalInfo = {
  date_of_birth: string;
  gender: string;
  marital_status: string;
  religion: string;
  nationality: string;
  present_address: string;
  permanent_address: string;
  emergency_contact_number: string;
  emergency_contact_relationship: string;
  city: string;
};
type WorkInfo = {
  emp_id: string;
  designation: string;
  employment_type: string;
  work_location: string;
  date_of_joining: string;
  reporting_manager: string;
  department_ref: string;
  highest_qualification: string;
};
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
  Loader2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import ProfileProgressBar from "./ui/ProfileProgressBar";
import { toast } from "react-hot-toast";
import { Profile } from "../types/profile";
import { profileApi } from "../services/profileApi";

const EmployeeProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingWork, setEditingWork] = useState(false);
  const [editingBasic, setEditingBasic] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Profile data from API
  const [profileData, setProfileData] = useState<Profile | null>(null);

  // Temporary edit states
  const [tempPersonalInfo, setTempPersonalInfo] = useState({
    date_of_birth: "",
    gender: "",
    marital_status: "",
    religion: "",
    nationality: "",
    present_address: "",
    permanent_address: "",
    emergency_contact_number: "",
    emergency_contact_relationship: "",
    city: "",
  });

  const [tempWorkInfo, setTempWorkInfo] = useState({
    emp_id: "",
    designation: "",
    employment_type: "",
    work_location: "",
    date_of_joining: "",
    reporting_manager: "",
    department_ref: "",
    highest_qualification: "",
  });

  const [tempBasicInfo, setTempBasicInfo] = useState({
    first_name: "",
    last_name: "",
    email_id: "",
    phone_number: "",
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const profile = await profileApi.getMyProfile();
        setProfileData(profile);
        
        // Initialize temp states with actual data
        setTempPersonalInfo({
          date_of_birth: profile.date_of_birth || "",
          gender: profile.gender || "",
          marital_status: profile.marital_status || "",
          religion: profile.religion || "",
          nationality: profile.nationality || "",
          present_address: profile.present_address || "",
          permanent_address: profile.permanent_address || "",
          emergency_contact_number: profile.emergency_contact_number || "",
          emergency_contact_relationship: profile.emergency_contact_relationship || "",
          city: profile.city || "",
        });

        setTempWorkInfo({
          emp_id: profile.emp_id || "",
          designation: profile.designation || "",
          employment_type: profile.employment_type || "",
          work_location: profile.work_location || "",
          date_of_joining: profile.date_of_joining || "",
          reporting_manager: profile.reporting_manager || "",
          department_ref: profile.department_ref?.toString() || "",
          highest_qualification: profile.highest_qualification || "",
        });

        setTempBasicInfo({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          email_id: profile.email_id || "",
          phone_number: profile.phone_number || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data. Please try again.");
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const tabs = [
    { id: "about", label: "About", icon: User },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "leave", label: "Leave", icon: Calendar },
    { id: "payroll", label: "Payroll", icon: DollarSign },
    { id: "performance", label: "Performance", icon: CheckCircle },
    { id: "documents", label: "Documents", icon: Briefcase },
  ];

  // Basic Info Handlers
  const handleBasicSave = async () => {
    if (!profileData) return;
    
    try {
      const updateData = {
        first_name: tempBasicInfo.first_name,
        last_name: tempBasicInfo.last_name,
        email_id: tempBasicInfo.email_id,
        phone_number: tempBasicInfo.phone_number,
      };
      
      const updatedProfile = await profileApi.updateMyProfile(updateData);
      setProfileData(updatedProfile);
      setEditingBasic(false);
      toast.success("Basic information updated successfully!");
    } catch (error) {
      console.error("Error updating basic info:", error);
      toast.error("Failed to update basic information");
    }
  };

  const handleBasicCancel = () => {
    if (!profileData) return;
    
    setTempBasicInfo({
      first_name: profileData.first_name || "",
      last_name: profileData.last_name || "",
      email_id: profileData.email_id || "",
      phone_number: profileData.phone_number || "",
    });
    setEditingBasic(false);
  };

  // Personal Info Handlers
  const handlePersonalSave = async () => {
    if (!profileData) return;
    
    try {
      const updateData = {
        date_of_birth: tempPersonalInfo.date_of_birth,
        gender: tempPersonalInfo.gender as 'M' | 'F' | 'O' | 'N',
        marital_status: tempPersonalInfo.marital_status,
        religion: tempPersonalInfo.religion,
        nationality: tempPersonalInfo.nationality,
        present_address: tempPersonalInfo.present_address,
        permanent_address: tempPersonalInfo.permanent_address,
        emergency_contact_number: tempPersonalInfo.emergency_contact_number,
        emergency_contact_relationship: tempPersonalInfo.emergency_contact_relationship,
        city: tempPersonalInfo.city,
      };
      
      const updatedProfile = await profileApi.updateMyProfile(updateData);
      setProfileData(updatedProfile);
      setEditingPersonal(false);
      toast.success("Personal information updated successfully!");
    } catch (error) {
      console.error("Error updating personal info:", error);
      toast.error("Failed to update personal information");
    }
  };

  const handlePersonalCancel = () => {
    if (!profileData) return;
    
    setTempPersonalInfo({
      date_of_birth: profileData.date_of_birth || "",
      gender: profileData.gender || "",
      marital_status: profileData.marital_status || "",
      religion: profileData.religion || "",
      nationality: profileData.nationality || "",
      present_address: profileData.present_address || "",
      permanent_address: profileData.permanent_address || "",
      emergency_contact_number: profileData.emergency_contact_number || "",
      emergency_contact_relationship: profileData.emergency_contact_relationship || "",
      city: profileData.city || "",
    });
    setEditingPersonal(false);
  };

  // Work Info Handlers
  const handleWorkSave = async () => {
    if (!profileData) return;
    
    try {
      const updateData = {
        emp_id: tempWorkInfo.emp_id,
        designation: tempWorkInfo.designation,
        employment_type: tempWorkInfo.employment_type,
        work_location: tempWorkInfo.work_location,
        date_of_joining: tempWorkInfo.date_of_joining,
        reporting_manager: tempWorkInfo.reporting_manager,
        department_ref: tempWorkInfo.department_ref ? parseInt(tempWorkInfo.department_ref) : undefined,
        highest_qualification: tempWorkInfo.highest_qualification,
      };
      
      const updatedProfile = await profileApi.updateMyProfile(updateData);
      setProfileData(updatedProfile);
      setEditingWork(false);
      toast.success("Work information updated successfully!");
    } catch (error) {
      console.error("Error updating work info:", error);
      toast.error("Failed to update work information");
    }
  };

  const handleWorkCancel = () => {
    if (!profileData) return;
    
    setTempWorkInfo({
      emp_id: profileData.emp_id || "",
      designation: profileData.designation || "",
      employment_type: profileData.employment_type || "",
      work_location: profileData.work_location || "",
      date_of_joining: profileData.date_of_joining || "",
      reporting_manager: profileData.reporting_manager || "",
      department_ref: profileData.department_ref?.toString() || "",
      highest_qualification: profileData.highest_qualification || "",
    });
    setEditingWork(false);
  };

  // Photo Upload Handler
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && profileData) {
      try {
        setUploadingPhoto(true);
        const result = await profileApi.uploadProfilePhoto(file);
        
        // Update the profile data with new photo URL
        setProfileData(prev => prev ? {
          ...prev,
          passport_photo: result.passport_photo
        } : null);
        
        toast.success("Profile photo updated successfully!");
      } catch (error) {
        console.error("Error uploading photo:", error);
        toast.error("Failed to upload profile photo");
      } finally {
        setUploadingPhoto(false);
      }
    }
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
            {profileData ? profileData[field] : ""}
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
            {profileData ? profileData[field] : ""}
          </p>
        )}
      </div>
    );
  };

  // Example: Calculate profile completion percentage (replace with real logic)
  const profileCompletion = (() => {
    if (!profileData) return 0;
    // Example: count filled fields in personalInfo and workInfo
    const personalFields = Object.values(tempPersonalInfo).filter(Boolean).length;
    const workFields = Object.values(tempWorkInfo).filter(Boolean).length;
    const totalFields = Object.keys(tempPersonalInfo).length + Object.keys(tempWorkInfo).length;
    return Math.round(((personalFields + workFields) / totalFields) * 100);
  })();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Completion Progress Bar */}
        <ProfileProgressBar percent={profileCompletion} />
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
                {profileData?.passport_photo ? (
                  <img
                    src={profileData.passport_photo}
                    alt={profileData.first_name + ' ' + profileData.last_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                      {profileData ? (profileData.first_name[0] + (profileData.last_name ? profileData.last_name[0] : "")) : ""}
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
              {/* Status indicator removed for now (no status in profileData) */}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {profileData ? profileData.first_name + ' ' + profileData.last_name : ''}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                    Employee ID: {profileData?.emp_id || ''}
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
                  <span className="text-gray-700 dark:text-gray-300">
                    {profileData?.email_id || ''}
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {profileData?.phone_number || ''}
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Building className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {profileData?.department || ''}
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {profileData?.designation || ''}
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
                      {/* Removed invalid key 'dateOfBirth' */}
                      {renderPersonalInfoField(
                        "Gender",
                        "gender",
                        User,
                        "select",
                        ["Male", "Female", "Other"]
                      )}
                      {/* Removed invalid keys 'address', 'country', 'state' */}
                      {renderPersonalInfoField("City", "city", Building)}
                      {/* Removed invalid key 'postalCode' */}
                      {renderPersonalInfoField("Date of Birth", "date_of_birth", Calendar)}
                      {renderPersonalInfoField("Gender", "gender", User, "select", ["Male", "Female", "Other"])}
                      {renderPersonalInfoField("Present Address", "present_address", MapPin)}
                      {renderPersonalInfoField("Permanent Address", "permanent_address", MapPin)}
                      {renderPersonalInfoField("City", "city", Building)}
                      {renderPersonalInfoField("Nationality", "nationality", Globe)}
                      {renderPersonalInfoField("Marital Status", "marital_status", User)}
                      {renderPersonalInfoField("Religion", "religion", Globe)}
                      {renderPersonalInfoField("Emergency Contact Number", "emergency_contact_number", Phone)}
                      {renderPersonalInfoField("Emergency Contact Relationship", "emergency_contact_relationship", User)}
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
                      {renderWorkInfoField("Employee ID", "emp_id", User)}
                      {renderWorkInfoField("Designation", "designation", Briefcase)}
                      {renderWorkInfoField("Employment Type", "employment_type", Briefcase)}
                      {renderWorkInfoField("Work Location", "work_location", MapPin)}
                      {renderWorkInfoField("Date of Joining", "date_of_joining", Calendar)}
                      {renderWorkInfoField("Reporting Manager", "reporting_manager", User)}
                      {renderWorkInfoField("Department Ref", "department_ref", Building)}
                      {renderWorkInfoField("Highest Qualification", "highest_qualification", Briefcase)}
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
