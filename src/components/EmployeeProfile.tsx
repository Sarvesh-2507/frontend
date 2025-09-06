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
  FileText,
  Globe,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  Users,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileProgressBar from "./ui/ProfileProgressBar";
import { toast } from "react-hot-toast";
import { Profile } from "../types/profile";
import { profileApi } from "../services/profileApi";

type PersonalInfoField = keyof Pick<Profile, 
  'date_of_birth' | 'gender' | 'marital_status' | 'religion' | 'nationality' | 
  'present_address' | 'permanent_address' | 'emergency_contact_number' | 
  'emergency_contact_relationship' | 'city' | 'birth_place' | 'age' | 
  'native_state' | 'state_of_domicile' | 'marriage_date' | 'country_code' |
  'present_address_pin_code' | 'permanent_address_pin_code' | 'aadhar_number' |
  'pan_number' | 'passport_number' | 'passport_issue_date' | 'passport_valid_upto' |
  'passport_country_of_issue' | 'valid_visa_details' | 'height_cm' | 'weight_kg' |
  'blood_group' | 'eyesight_right' | 'eyesight_left' | 'physical_disability' |
  'identification_marks'
>;

type WorkInfoField = keyof Pick<Profile, 
  'emp_id' | 'designation' | 'employment_type' | 'work_location' | 
  'date_of_joining' | 'reporting_manager' | 'department_ref' | 'highest_qualification' |
  'previous_company_name' | 'years_of_experience' | 'college_university_name' |
  'graduation_year' | 'is_reporting_manager' | 'probation_period_months' |
  'confirmation_date'
>;

const EmployeeProfile: React.FC = () => {
  const navigate = useNavigate();
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
    birth_place: "",
    age: "",
    native_state: "",
    state_of_domicile: "",
    marriage_date: "",
    country_code: "",
    present_address_pin_code: "",
    permanent_address_pin_code: "",
    aadhar_number: "",
    pan_number: "",
    passport_number: "",
    passport_issue_date: "",
    passport_valid_upto: "",
    passport_country_of_issue: "",
    valid_visa_details: "",
    height_cm: "",
    weight_kg: "",
    blood_group: "",
    eyesight_right: "",
    eyesight_left: "",
    physical_disability: "",
    identification_marks: "",
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
    previous_company_name: "",
    years_of_experience: "",
    college_university_name: "",
    graduation_year: "",
    is_reporting_manager: false,
    probation_period_months: "",
    confirmation_date: "",
  });

  const [tempBasicInfo, setTempBasicInfo] = useState({
    first_name: "",
    last_name: "",
    email_id: "",
    phone_number: "",
  });

  // Fetch profile data on component mount
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts
    
    const fetchProfile = async () => {
      try {
        if (!isMounted) return; // Don't proceed if component unmounted
        
        setLoading(true);
        setError(null);
        console.log("Fetching profile data...");
        
        const profile = await profileApi.getMyProfile();
        
        if (!isMounted) return; // Don't update state if component unmounted
        
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
          birth_place: profile.birth_place || "",
          age: profile.age?.toString() || "",
          native_state: profile.native_state || "",
          state_of_domicile: profile.state_of_domicile || "",
          marriage_date: profile.marriage_date || "",
          country_code: profile.country_code || "",
          present_address_pin_code: profile.present_address_pin_code || "",
          permanent_address_pin_code: profile.permanent_address_pin_code || "",
          aadhar_number: profile.aadhar_number || "",
          pan_number: profile.pan_number || "",
          passport_number: profile.passport_number || "",
          passport_issue_date: profile.passport_issue_date || "",
          passport_valid_upto: profile.passport_valid_upto || "",
          passport_country_of_issue: profile.passport_country_of_issue || "",
          valid_visa_details: profile.valid_visa_details || "",
          height_cm: profile.height_cm || "",
          weight_kg: profile.weight_kg || "",
          blood_group: profile.blood_group || "",
          eyesight_right: profile.eyesight_right || "",
          eyesight_left: profile.eyesight_left || "",
          physical_disability: profile.physical_disability || "",
          identification_marks: profile.identification_marks || "",
        });

        // Extract work experience details from the array
        const workExp = profile.work_experiences?.[0];
        
        // Extract education details from the array
        const education = profile.education_details?.[0];

        setTempWorkInfo({
          emp_id: profile.emp_id || "",
          designation: profile.designation || "",
          employment_type: profile.employment_type || "",
          work_location: profile.work_location || "",
          date_of_joining: profile.date_of_joining || "",
          reporting_manager: profile.reporting_manager || "",
          department_ref: profile.department_ref?.toString() || "",
          highest_qualification: profile.highest_qualification || "",
          previous_company_name: profile.previous_company_name || "",
          years_of_experience: profile.years_of_experience || "",
          college_university_name: profile.college_university_name || "",
          graduation_year: profile.graduation_year?.toString() || "",
          is_reporting_manager: profile.is_reporting_manager || false,
          probation_period_months: profile.probation_period_months?.toString() || "",
          confirmation_date: profile.confirmation_date || "",
          // Additional mapped fields from real data
          department: workExp?.employer_name || "",
          location: profile.work_location || "",
          division: "",
          salary: workExp?.lastdrawn_salary || "",
          total_experience: profile.years_of_experience || "",
          grade: "",
          sub_department: "",
          office_location: profile.work_location || "",
          job_status: profile.status || "",
          hire_date: profile.date_of_joining || "",
          termination_date: "",
          cost_center: "",
          notice_period_days: "",
          increment_month: "",
          previous_company_designation: workExp?.designation || "",
          previous_experience_years: workExp?.duration || "",
          previous_company_salary: workExp?.salary_at_join || "",
          // Education fields from education_details array
          graduation_college: education?.institution || "",
          graduation_university: education?.university_board || "",
          graduation_percentage: education?.grade_or_percentage || "",
          post_graduation_year: "",
          post_graduation_college: "",
          post_graduation_university: "",
          post_graduation_percentage: "",
          twelfth_year: "",
          twelfth_school: "",
          twelfth_board: "",
          twelfth_percentage: "",
          tenth_year: "",
          tenth_school: "",
          tenth_board: "",
          tenth_percentage: "",
        });

        setTempBasicInfo({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          email_id: profile.email_id || "",
          phone_number: profile.phone_number || "",
        });
        
        console.log("Profile data loaded successfully");
      } catch (err) {
        console.error("Error fetching profile:", err);
        
        if (!isMounted) return; // Don't update state if component unmounted
        
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        setError(`Failed to load profile data: ${errorMessage}`);
        
        // Only show toast once per error, not on every re-render
        if (isMounted) {
          toast.error("Failed to load profile data", {
            id: 'profile-error', // Prevent duplicate toasts
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
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
        birth_place: tempPersonalInfo.birth_place,
        age: tempPersonalInfo.age ? parseInt(tempPersonalInfo.age) : undefined,
        native_state: tempPersonalInfo.native_state,
        state_of_domicile: tempPersonalInfo.state_of_domicile,
        marriage_date: tempPersonalInfo.marriage_date,
        country_code: tempPersonalInfo.country_code,
        present_address_pin_code: tempPersonalInfo.present_address_pin_code,
        permanent_address_pin_code: tempPersonalInfo.permanent_address_pin_code,
        aadhar_number: tempPersonalInfo.aadhar_number,
        pan_number: tempPersonalInfo.pan_number,
        passport_number: tempPersonalInfo.passport_number,
        passport_issue_date: tempPersonalInfo.passport_issue_date,
        passport_valid_upto: tempPersonalInfo.passport_valid_upto,
        passport_country_of_issue: tempPersonalInfo.passport_country_of_issue,
        valid_visa_details: tempPersonalInfo.valid_visa_details,
        height_cm: tempPersonalInfo.height_cm,
        weight_kg: tempPersonalInfo.weight_kg,
        blood_group: tempPersonalInfo.blood_group,
        eyesight_right: tempPersonalInfo.eyesight_right,
        eyesight_left: tempPersonalInfo.eyesight_left,
        physical_disability: tempPersonalInfo.physical_disability,
        identification_marks: tempPersonalInfo.identification_marks,
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
      birth_place: profileData.birth_place || "",
      age: profileData.age?.toString() || "",
      native_state: profileData.native_state || "",
      state_of_domicile: profileData.state_of_domicile || "",
      marriage_date: profileData.marriage_date || "",
      country_code: profileData.country_code || "",
      present_address_pin_code: profileData.present_address_pin_code || "",
      permanent_address_pin_code: profileData.permanent_address_pin_code || "",
      aadhar_number: profileData.aadhar_number || "",
      pan_number: profileData.pan_number || "",
      passport_number: profileData.passport_number || "",
      passport_issue_date: profileData.passport_issue_date || "",
      passport_valid_upto: profileData.passport_valid_upto || "",
      passport_country_of_issue: profileData.passport_country_of_issue || "",
      valid_visa_details: profileData.valid_visa_details || "",
      height_cm: profileData.height_cm || "",
      weight_kg: profileData.weight_kg || "",
      blood_group: profileData.blood_group || "",
      eyesight_right: profileData.eyesight_right || "",
      eyesight_left: profileData.eyesight_left || "",
      physical_disability: profileData.physical_disability || "",
      identification_marks: profileData.identification_marks || "",
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
        department: tempWorkInfo.department,
        location: tempWorkInfo.location,
        division: tempWorkInfo.division,
        salary: tempWorkInfo.salary ? parseFloat(tempWorkInfo.salary) : undefined,
        total_experience: tempWorkInfo.total_experience,
        grade: tempWorkInfo.grade,
        sub_department: tempWorkInfo.sub_department,
        office_location: tempWorkInfo.office_location,
        job_status: tempWorkInfo.job_status,
        hire_date: tempWorkInfo.hire_date,
        termination_date: tempWorkInfo.termination_date,
        cost_center: tempWorkInfo.cost_center,
        probation_period_months: tempWorkInfo.probation_period_months ? parseInt(tempWorkInfo.probation_period_months) : undefined,
        notice_period_days: tempWorkInfo.notice_period_days ? parseInt(tempWorkInfo.notice_period_days) : undefined,
        confirmation_date: tempWorkInfo.confirmation_date,
        increment_month: tempWorkInfo.increment_month,
        previous_company_name: tempWorkInfo.previous_company_name,
        previous_company_designation: tempWorkInfo.previous_company_designation,
        previous_experience_years: tempWorkInfo.previous_experience_years ? parseFloat(tempWorkInfo.previous_experience_years) : undefined,
        previous_company_salary: tempWorkInfo.previous_company_salary ? parseFloat(tempWorkInfo.previous_company_salary) : undefined,
        graduation_year: tempWorkInfo.graduation_year ? parseInt(tempWorkInfo.graduation_year) : undefined,
        graduation_college: tempWorkInfo.graduation_college,
        graduation_university: tempWorkInfo.graduation_university,
        graduation_percentage: tempWorkInfo.graduation_percentage ? parseFloat(tempWorkInfo.graduation_percentage) : undefined,
        post_graduation_year: tempWorkInfo.post_graduation_year ? parseInt(tempWorkInfo.post_graduation_year) : undefined,
        post_graduation_college: tempWorkInfo.post_graduation_college,
        post_graduation_university: tempWorkInfo.post_graduation_university,
        post_graduation_percentage: tempWorkInfo.post_graduation_percentage ? parseFloat(tempWorkInfo.post_graduation_percentage) : undefined,
        twelfth_year: tempWorkInfo.twelfth_year ? parseInt(tempWorkInfo.twelfth_year) : undefined,
        twelfth_school: tempWorkInfo.twelfth_school,
        twelfth_board: tempWorkInfo.twelfth_board,
        twelfth_percentage: tempWorkInfo.twelfth_percentage ? parseFloat(tempWorkInfo.twelfth_percentage) : undefined,
        tenth_year: tempWorkInfo.tenth_year ? parseInt(tempWorkInfo.tenth_year) : undefined,
        tenth_school: tempWorkInfo.tenth_school,
        tenth_board: tempWorkInfo.tenth_board,
        tenth_percentage: tempWorkInfo.tenth_percentage ? parseFloat(tempWorkInfo.tenth_percentage) : undefined,
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
      previous_company_name: profileData.previous_company_name || "",
      years_of_experience: profileData.years_of_experience || "",
      college_university_name: profileData.college_university_name || "",
      graduation_year: profileData.graduation_year?.toString() || "",
      is_reporting_manager: profileData.is_reporting_manager || false,
      probation_period_months: profileData.probation_period_months?.toString() || "",
      confirmation_date: profileData.confirmation_date || "",
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
    field: PersonalInfoField,
    icon: React.ComponentType<any>,
    type: "input" | "select" = "input",
    options?: string[]
  ) => {
    const Icon = icon;
    return (
      <div className="space-y-2" key={field}>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </label>
        {editingPersonal ? (
          type === "select" ? (
            <select
              value={tempPersonalInfo[field] as string}
              onChange={(e) =>
                setTempPersonalInfo((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              title={label}
            >
              {options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.includes('date') ? 'date' : 'text'}
              value={tempPersonalInfo[field] as string}
              onChange={(e) =>
                setTempPersonalInfo((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder={label}
              title={label}
            />
          )
        ) : (
          <p className="text-gray-900 dark:text-white">
            {profileData?.[field] || 'Not specified'}
          </p>
        )}
      </div>
    );
  };

  const renderWorkInfoField = (
    label: string,
    field: WorkInfoField,
    icon: React.ComponentType<any>,
    type: "input" | "select" = "input",
    options?: string[]
  ) => {
    const Icon = icon;
    return (
      <div className="space-y-2" key={field}>
        <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </label>
        {editingWork ? (
          type === "select" ? (
            <select
              value={tempWorkInfo[field] as string}
              onChange={(e) =>
                setTempWorkInfo((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              title={label}
            >
              {options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.includes('date') ? 'date' : 'text'}
              value={tempWorkInfo[field] as string}
              onChange={(e) =>
                setTempWorkInfo((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder={label}
              title={label}
            />
          )
        ) : (
          <p className="text-gray-900 dark:text-white">
            {profileData?.[field]?.toString() || 'Not specified'}
          </p>
        )}
      </div>
    );
  };

  // Calculate profile completion percentage
  const profileCompletion = (() => {
    if (!profileData) return 0;
    
    const allFields = [
      profileData.first_name,
      profileData.last_name,
      profileData.email_id,
      profileData.phone_number,
      profileData.date_of_birth,
      profileData.gender,
      profileData.marital_status,
      profileData.nationality,
      profileData.present_address,
      profileData.designation,
      profileData.employment_type,
      profileData.work_location,
      profileData.date_of_joining,
    ];
    
    const filledFields = allFields.filter(field => field && field.toString().trim()).length;
    return Math.round((filledFields / allFields.length) * 100);
  })();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600 dark:text-gray-400">Loading profile...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to Load Profile
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            {error || "Unable to load profile data. Please try again."}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Debug Information
              </summary>
              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                <p><strong>Token:</strong> {localStorage.getItem('accessToken') ? 'Present' : 'Missing'}</p>
                <p><strong>API URL:</strong> http://192.168.1.132:8000/api/profiles/profiles/me/</p>
                <p><strong>Error:</strong> {error}</p>
                <p><strong>Check browser console for more details</strong></p>
              </div>
            </details>
          </div>
        </div>
      </div>
    );
  }

  const fullName = `${profileData.first_name} ${profileData.last_name}`.trim();
  const initials = `${profileData.first_name?.[0] || ''}${profileData.last_name?.[0] || ''}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md flex items-center"
          style={{ fontWeight: 500 }}
          aria-label="Back to Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Home
        </button>
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
                {profileData.passport_photo ? (
                  <img
                    src={profileData.passport_photo}
                    alt={fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                      {initials}
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
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-between mb-4">
                <div>
                  {editingBasic ? (
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={tempBasicInfo.first_name}
                          onChange={(e) =>
                            setTempBasicInfo((prev) => ({
                              ...prev,
                              first_name: e.target.value,
                            }))
                          }
                          placeholder="First Name"
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <input
                          type="text"
                          value={tempBasicInfo.last_name}
                          onChange={(e) =>
                            setTempBasicInfo((prev) => ({
                              ...prev,
                              last_name: e.target.value,
                            }))
                          }
                          placeholder="Last Name"
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {fullName}
                    </h1>
                  )}
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {profileData.designation || 'Employee'} • {profileData.emp_id || 'N/A'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingBasic(!editingBasic)}
                  className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>{editingBasic ? "Cancel" : "Edit"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  {editingBasic ? (
                    <input
                      type="email"
                      value={tempBasicInfo.email_id}
                      onChange={(e) =>
                        setTempBasicInfo((prev) => ({
                          ...prev,
                          email_id: e.target.value,
                        }))
                      }
                      placeholder="Email"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <span>{profileData.email_id}</span>
                  )}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  {editingBasic ? (
                    <input
                      type="tel"
                      value={tempBasicInfo.phone_number}
                      onChange={(e) =>
                        setTempBasicInfo((prev) => ({
                          ...prev,
                          phone_number: e.target.value,
                        }))
                      }
                      placeholder="Phone Number"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <span>{profileData.phone_number}</span>
                  )}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Building className="w-4 h-4 mr-2" />
                  <span>{profileData.work_location || 'Not specified'}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Joined {profileData.date_of_joining || 'N/A'}</span>
                </div>
              </div>

              <AnimatePresence>
                {editingBasic && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
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
                      {renderPersonalInfoField("Date of Birth", "date_of_birth", Calendar)}
                      {renderPersonalInfoField("Gender", "gender", User, "select", ["M", "F", "O", "N"])}
                      {renderPersonalInfoField("Marital Status", "marital_status", User)}
                      {renderPersonalInfoField("Religion", "religion", Globe)}
                      {renderPersonalInfoField("Nationality", "nationality", Globe)}
                      {renderPersonalInfoField("Present Address", "present_address", MapPin)}
                      {renderPersonalInfoField("Permanent Address", "permanent_address", MapPin)}
                      {renderPersonalInfoField("City", "city", Building)}
                      {renderPersonalInfoField("Emergency Contact", "emergency_contact_number", Phone)}
                      {renderPersonalInfoField("Emergency Relationship", "emergency_contact_relationship", User)}
                      
                      {/* Additional Personal Fields */}
                      {renderPersonalInfoField("Birth Place", "birth_place", MapPin)}
                      {renderPersonalInfoField("Age", "age", Calendar)}
                      {renderPersonalInfoField("Native State", "native_state", Globe)}
                      {renderPersonalInfoField("State of Domicile", "state_of_domicile", Globe)}
                      {renderPersonalInfoField("Marriage Date", "marriage_date", Calendar)}
                      {renderPersonalInfoField("Country Code", "country_code", Globe)}
                      {renderPersonalInfoField("Present Address PIN", "present_address_pin_code", MapPin)}
                      {renderPersonalInfoField("Permanent Address PIN", "permanent_address_pin_code", MapPin)}
                      {renderPersonalInfoField("Aadhar Number", "aadhar_number", User)}
                      {renderPersonalInfoField("PAN Number", "pan_number", User)}
                      {renderPersonalInfoField("Passport Number", "passport_number", User)}
                      {renderPersonalInfoField("Passport Issue Date", "passport_issue_date", Calendar)}
                      {renderPersonalInfoField("Passport Valid Until", "passport_valid_upto", Calendar)}
                      {renderPersonalInfoField("Passport Country", "passport_country_of_issue", Globe)}
                      {renderPersonalInfoField("Visa Details", "valid_visa_details", User)}
                      {renderPersonalInfoField("Height (cm)", "height_cm", User)}
                      {renderPersonalInfoField("Weight (kg)", "weight_kg", User)}
                      {renderPersonalInfoField("Blood Group", "blood_group", User)}
                      {renderPersonalInfoField("Right Eye Sight", "eyesight_right", User)}
                      {renderPersonalInfoField("Left Eye Sight", "eyesight_left", User)}
                      {renderPersonalInfoField("Physical Disability", "physical_disability", User)}
                      {renderPersonalInfoField("Identification Marks", "identification_marks", User)}
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
                      {renderWorkInfoField("Employee ID", "emp_id", User)}
                      {renderWorkInfoField("Designation", "designation", Briefcase)}
                      {renderWorkInfoField("Employment Type", "employment_type", Users, "select", ["Permanent", "Contract", "Intern"])}
                      {renderWorkInfoField("Work Location", "work_location", MapPin)}
                      {renderWorkInfoField("Date of Joining", "date_of_joining", Calendar)}
                      {renderWorkInfoField("Reporting Manager", "reporting_manager", User)}
                      {renderWorkInfoField("Department", "department_ref", Building)}
                      {renderWorkInfoField("Highest Qualification", "highest_qualification", CheckCircle)}
                      
                      {/* Additional Work Fields */}
                      {renderWorkInfoField("Department", "department", Building)}
                      {renderWorkInfoField("Location", "location", MapPin)}
                      {renderWorkInfoField("Division", "division", Building)}
                      {renderWorkInfoField("Salary", "salary", User)}
                      {renderWorkInfoField("Total Experience", "total_experience", CheckCircle)}
                      {renderWorkInfoField("Grade", "grade", CheckCircle)}
                      {renderWorkInfoField("Sub Department", "sub_department", Building)}
                      {renderWorkInfoField("Office Location", "office_location", MapPin)}
                      {renderWorkInfoField("Job Status", "job_status", CheckCircle)}
                      {renderWorkInfoField("Hire Date", "hire_date", Calendar)}
                      {renderWorkInfoField("Termination Date", "termination_date", Calendar)}
                      {renderWorkInfoField("Cost Center", "cost_center", Building)}
                      {renderWorkInfoField("Probation Period (Months)", "probation_period_months", CheckCircle)}
                      {renderWorkInfoField("Notice Period (Days)", "notice_period_days", CheckCircle)}
                      {renderWorkInfoField("Confirmation Date", "confirmation_date", Calendar)}
                      {renderWorkInfoField("Increment Month", "increment_month", Calendar)}
                      {renderWorkInfoField("Previous Company", "previous_company_name", Building)}
                      {renderWorkInfoField("Previous Designation", "previous_company_designation", Briefcase)}
                      {renderWorkInfoField("Previous Experience (Years)", "previous_experience_years", CheckCircle)}
                      {renderWorkInfoField("Previous Salary", "previous_company_salary", User)}
                      
                      {/* Education Fields */}
                      {renderWorkInfoField("Graduation Year", "graduation_year", Calendar)}
                      {renderWorkInfoField("Graduation College", "graduation_college", Building)}
                      {renderWorkInfoField("Graduation University", "graduation_university", Building)}
                      {renderWorkInfoField("Graduation Percentage", "graduation_percentage", CheckCircle)}
                      {renderWorkInfoField("Post Graduation Year", "post_graduation_year", Calendar)}
                      {renderWorkInfoField("Post Graduation College", "post_graduation_college", Building)}
                      {renderWorkInfoField("Post Graduation University", "post_graduation_university", Building)}
                      {renderWorkInfoField("Post Graduation Percentage", "post_graduation_percentage", CheckCircle)}
                      {renderWorkInfoField("12th Year", "twelfth_year", Calendar)}
                      {renderWorkInfoField("12th School", "twelfth_school", Building)}
                      {renderWorkInfoField("12th Board", "twelfth_board", Building)}
                      {renderWorkInfoField("12th Percentage", "twelfth_percentage", CheckCircle)}
                      {renderWorkInfoField("10th Year", "tenth_year", Calendar)}
                      {renderWorkInfoField("10th School", "tenth_school", Building)}
                      {renderWorkInfoField("10th Board", "tenth_board", Building)}
                      {renderWorkInfoField("10th Percentage", "tenth_percentage", CheckCircle)}
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

                  {/* Family Members Section */}
                  {profileData?.family_members && profileData.family_members.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mt-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-6">
                        <Users className="w-5 h-5 mr-2" />
                        Family Members
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profileData.family_members.map((member, index) => (
                          <div key={member.id || index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <div className="font-medium text-gray-900 dark:text-white">{member.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{member.relationship}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-500">
                              DOB: {member.date_of_birth} • {member.gender} • {member.occupation}
                            </div>
                            {member.qualification && (
                              <div className="text-sm text-gray-500 dark:text-gray-500">Qualification: {member.qualification}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education Details Section */}
                  {profileData?.education_details && profileData.education_details.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mt-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-6">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Education Details
                      </h3>
                      <div className="space-y-4">
                        {profileData.education_details.map((edu, index) => (
                          <div key={edu.id || index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{edu.exam_passed}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{edu.specialization}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Institution</div>
                                <div className="font-medium text-gray-900 dark:text-white">{edu.institution}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-500">{edu.university_board}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Performance</div>
                                <div className="font-medium text-gray-900 dark:text-white">{edu.grade_or_percentage}%</div>
                                <div className="text-sm text-gray-500 dark:text-gray-500">Passed: {edu.month_year_of_passing}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Work Experience Section */}
                  {profileData?.work_experiences && profileData.work_experiences.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mt-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-6">
                        <Briefcase className="w-5 h-5 mr-2" />
                        Work Experience
                      </h3>
                      <div className="space-y-4">
                        {profileData.work_experiences.map((exp, index) => (
                          <div key={exp.id || index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{exp.employer_name}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{exp.designation}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-500">{exp.duration}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {exp.from_date} to {exp.to_date}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-500">
                                  Supervisor: {exp.superior_name}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Salary</div>
                                <div className="font-medium text-gray-900 dark:text-white">₹{exp.lastdrawn_salary}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-500">
                                  Joining: ₹{exp.salary_at_join}
                                </div>
                              </div>
                            </div>
                            {exp.duties && (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Duties</div>
                                <div className="text-sm text-gray-900 dark:text-white">{exp.duties}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages Known Section */}
                  {profileData?.languages_known && profileData.languages_known.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mt-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-6">
                        <Globe className="w-5 h-5 mr-2" />
                        Languages Known
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {profileData.languages_known.map((lang, index) => (
                          <div key={lang.id || index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <div className="font-medium text-gray-900 dark:text-white capitalize">{lang.language}</div>
                            <div className="flex space-x-4 mt-2">
                              <span className={`text-xs px-2 py-1 rounded ${lang.can_read ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                Read
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${lang.can_write ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                Write
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${lang.can_speak ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                Speak
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hobbies Section */}
                  {profileData?.hobbies && profileData.hobbies.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mt-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-6">
                        <Heart className="w-5 h-5 mr-2" />
                        Hobbies & Interests
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.hobbies.map((hobby, index) => (
                          <span 
                            key={hobby.id || index} 
                            className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm"
                          >
                            {hobby.hobby_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
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
