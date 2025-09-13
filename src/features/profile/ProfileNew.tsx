import {
  ArrowLeft,
  Award,
  Briefcase,
  Building,
  Calendar,
  Camera,
  Clock,
  CreditCard,
  DollarSign,
  Edit,
  FileText,
  Globe,
  MapPin,
  Target,
  User,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";

const Profile: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Profile data matching the Horilla design exactly
  const [profileData, setProfileData] = useState({
    // Personal Information
    dateOfBirth: "10 Sep",
    gender: "Male",
    address: "Tangail",
    country: "Bangladesh",
    state: "Tangail",
    city: "Tangail",
    qualification: "MSc",
    experience: "5",
    maritalStatus: "Married",
    children: "",

    // Work Information
    department: "Finance",
    jobPosition: "System Admin (Finance)",
    shiftInformation: "Night Shift",
    workType: "Work From Office",
    employeeType: "Tempo indeterminato",
    salary: "100000",
    reportingManager: "Aria Powell (PFP43)",
    workLocation: "None",
    company: "Horilla INC",
    joiningDate: "06/01/2025",
    endDate: "01/31/2030",
    tags: "None",

    // Bank Information
    bankName: "punjab national bank",
    accountNumber: "123456789",
  });

  const tabs = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "work", label: "Work Information", icon: Building },
    { id: "contact", label: "Contract details", icon: FileText },
    { id: "bank", label: "Bank Information", icon: CreditCard },
  ];

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
    // You can add API call here
  };

  const renderPersonalInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Date of Birth */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          Date of Birth
        </label>
        {isEditing ? (
          <input
            type="text"
            value={profileData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        ) : (
          <p className="text-gray-900 dark:text-white">
            {profileData.dateOfBirth}
          </p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <User className="w-4 h-4 mr-2" />
          Gender
        </label>
        {isEditing ? (
          <select
            value={profileData.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        ) : (
          <p className="text-gray-900 dark:text-white">{profileData.gender}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          Address
        </label>
        {isEditing ? (
          <input
            type="text"
            value={profileData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        ) : (
          <p className="text-gray-900 dark:text-white">{profileData.address}</p>
        )}
      </div>

      {/* Country */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <Globe className="w-4 h-4 mr-2" />
          Country
        </label>
        {isEditing ? (
          <input
            type="text"
            value={profileData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        ) : (
          <p className="text-gray-900 dark:text-white">{profileData.country}</p>
        )}
      </div>

      {/* State */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          State
        </label>
        {isEditing ? (
          <input
            type="text"
            value={profileData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        ) : (
          <p className="text-gray-900 dark:text-white">{profileData.state}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <Building className="w-4 h-4 mr-2" />
          City
        </label>
        {isEditing ? (
          <input
            type="text"
            value={profileData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        ) : (
          <p className="text-gray-900 dark:text-white">{profileData.city}</p>
        )}
      </div>

      {/* Qualification */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <Award className="w-4 h-4 mr-2" />
          Qualification
        </label>
        {isEditing ? (
          <input
            type="text"
            value={profileData.qualification}
            onChange={(e) => handleInputChange("qualification", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        ) : (
          <p className="text-gray-900 dark:text-white">
            {profileData.qualification}
          </p>
        )}
      </div>

      {/* Experience */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <Briefcase className="w-4 h-4 mr-2" />
          Experience
        </label>
        {isEditing ? (
          <input
            type="text"
            value={profileData.experience}
            onChange={(e) => handleInputChange("experience", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        ) : (
          <p className="text-gray-900 dark:text-white">
            {profileData.experience}
          </p>
        )}
      </div>

      {/* Marital Status */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <Users className="w-4 h-4 mr-2" />
          Marital Status
        </label>
        {isEditing ? (
          <select
            value={profileData.maritalStatus}
            onChange={(e) => handleInputChange("maritalStatus", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        ) : (
          <p className="text-gray-900 dark:text-white">
            {profileData.maritalStatus}
          </p>
        )}
      </div>

      {/* Children */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <Users className="w-4 h-4 mr-2" />
          Children
        </label>
        {isEditing ? (
          <input
            type="text"
            value={profileData.children}
            onChange={(e) => handleInputChange("children", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Number of children"
          />
        ) : (
          <p className="text-gray-900 dark:text-white">
            {profileData.children || "None"}
          </p>
        )}
      </div>
    </div>
  );

  const renderWorkInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Department */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <Building className="w-4 h-4 mr-2" />
          Department
        </label>
        <p className="text-gray-900 dark:text-white">
          {profileData.department}
        </p>
      </div>

      {/* Job Position */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <Briefcase className="w-4 h-4 mr-2" />
          Job Position
        </label>
        <p className="text-gray-900 dark:text-white">
          {profileData.jobPosition}
        </p>
      </div>

      {/* Shift Information */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <Clock className="w-4 h-4 mr-2" />
          Shift Information
        </label>
        <p className="text-gray-900 dark:text-white">
          {profileData.shiftInformation}
        </p>
      </div>

      {/* Work Type */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <Building className="w-4 h-4 mr-2" />
          Work Type
        </label>
        <p className="text-gray-900 dark:text-white">{profileData.workType}</p>
      </div>

      {/* Employee Type */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <User className="w-4 h-4 mr-2" />
          Employee Type
        </label>
        <p className="text-gray-900 dark:text-white">
          {profileData.employeeType}
        </p>
      </div>

      {/* Salary */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <DollarSign className="w-4 h-4 mr-2" />
          Salary
        </label>
        <p className="text-gray-900 dark:text-white">{profileData.salary}</p>
      </div>

      {/* Reporting Manager */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <Users className="w-4 h-4 mr-2" />
          Reporting Manager
        </label>
        <p className="text-gray-900 dark:text-white">
          {profileData.reportingManager}
        </p>
      </div>

      {/* Work Location */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          Work Location
        </label>
        <p className="text-gray-900 dark:text-white">
          {profileData.workLocation}
        </p>
      </div>

      {/* Company */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <Building className="w-4 h-4 mr-2" />
          Company
        </label>
        <p className="text-gray-900 dark:text-white">{profileData.company}</p>
      </div>

      {/* Joining Date */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          Joining Date
        </label>
        <p className="text-gray-900 dark:text-white">
          {profileData.joiningDate}
        </p>
      </div>

      {/* End Date */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          End Date
        </label>
        <p className="text-gray-900 dark:text-white">{profileData.endDate}</p>
      </div>

      {/* Tags */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <Target className="w-4 h-4 mr-2" />
          Tags
        </label>
        <p className="text-gray-900 dark:text-white">{profileData.tags}</p>
      </div>
    </div>
  );

  const renderBankInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Bank Name */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <CreditCard className="w-4 h-4 mr-2" />
          Bank Name
        </label>
        <p className="text-gray-900 dark:text-white">{profileData.bankName}</p>
      </div>

      {/* Account Number */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <CreditCard className="w-4 h-4 mr-2" />
          Account Number
        </label>
        <p className="text-gray-900 dark:text-white">
          {profileData.accountNumber}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div />

      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Profile
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your profile information
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-2xl">
                    FA
                  </span>
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                  title="Change photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Faruque Ahmad
                </h2>
                <p className="text-gray-600 dark:text-gray-400">PFP001</p>
                <p className="text-gray-600 dark:text-gray-400">
                  mfaruqueahmad@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
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
              {activeTab === "personal" && renderPersonalInfo()}
              {activeTab === "work" && renderWorkInfo()}
              {activeTab === "bank" && renderBankInfo()}
              {activeTab === "contact" && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Contract details coming soon...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
