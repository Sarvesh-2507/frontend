import { motion } from "framer-motion";
import { Building2, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../context/authStore";
import {
  Department,
  Employee,
  organizationAPI,
  Role,
} from "../../services/organizationApi";
import type { RegisterCredentials } from "../../types/auth";
import { Organization } from "../../types/organization";

interface RegisterFormData extends RegisterCredentials {
  // No additional fields needed since RegisterCredentials now has all required fields
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [reportingManagers, setReportingManagers] = useState<Employee[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingManagers, setLoadingManagers] = useState(false);

  const navigate = useNavigate();
  const { register: registerUser, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch("password");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingOrgs(true);
        setLoadingDepts(true);
        setLoadingRoles(true);
        setLoadingManagers(true);

        // Fetch organizations
        console.log("🏢 Register - Fetching organizations...");
        const orgResponse = await organizationAPI.getPublicOrganizations();
        console.log("🏢 Register - Organizations response:", orgResponse.data);

        if (
          orgResponse.data &&
          Array.isArray(orgResponse.data) &&
          orgResponse.data.length > 0
        ) {
          setOrganizations(orgResponse.data);
        } else {
          setOrganizations([
            {
              id: 1,
              company_name: "Default Organization",
              name: "Default Organization",
              industry_type: "Technology",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);
        }

        // Fetch departments
        console.log("🏢 Register - Fetching departments...");
        const deptResponse = await organizationAPI.getPublicDepartments();
        console.log("🏢 Register - Departments response:", deptResponse.data);
        setDepartments(deptResponse.data || []);

        // Fetch roles
        console.log("🏢 Register - Fetching roles...");
        const roleResponse = await organizationAPI.getPublicRoles();
        console.log("🏢 Register - Roles response:", roleResponse.data);
        setRoles(roleResponse.data || []);

        // Fetch reporting managers
        console.log("👥 Register - Fetching reporting managers...");
        const managersResponse =
          await organizationAPI.getPublicReportingManagers();
        console.log(
          "👥 Register - Reporting managers response:",
          managersResponse.data
        );
        setReportingManagers(managersResponse.data || []);
      } catch (error) {
        console.error("❌ Register - Error fetching data:", error);
        // Set defaults on error
        setOrganizations([
          {
            id: 1,
            company_name: "Default Organization",
            name: "Default Organization",
            industry_type: "Technology",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            company_name: "Sample Company",
            name: "Sample Company",
            industry_type: "Business",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        setDepartments([
          { id: 1, name: "Engineering" },
          { id: 2, name: "Marketing" },
          { id: 3, name: "Sales" },
          { id: 4, name: "Human Resources" },
        ]);
        setRoles([
          { id: 1, name: "Employee" },
          { id: 2, name: "Manager" },
          { id: 3, name: "Admin" },
        ]);
        setReportingManagers([
          {
            id: 1,
            name: "John Doe",
            email: "john.doe@company.com",
            designation: "Manager",
            department: "Engineering",
            role: "Manager",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@company.com",
            designation: "Director",
            department: "HR",
            role: "Director",
          },
        ]);
      } finally {
        setLoadingOrgs(false);
        setLoadingDepts(false);
        setLoadingRoles(false);
        setLoadingManagers(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Ensure organization is included and is a number
      const orgId = parseInt(String(data.organization));
      if (!orgId || isNaN(orgId)) {
        data.organization = organizations[0]?.id || 1;
      } else {
        data.organization = orgId;
      }

      // Ensure role is included and is a number
      const roleId = parseInt(String(data.role));
      if (!roleId || isNaN(roleId)) {
        (data as any).role = roles[0]?.id || 1;
      } else {
        (data as any).role = roleId;
      }

      // Include department_ref if selected
      if (data.department_ref) {
        data.department_ref = parseInt(String(data.department_ref));
      }

      // Include reporting_manager if selected
      if (data.reporting_manager) {
        data.reporting_manager = String(data.reporting_manager);
      }

      // Ensure access_level is a string
      if (data.access_level) {
        data.access_level = String(data.access_level);
      }

      // Clean up empty optional fields
      if (!data.department_ref) {
        delete (data as any).department_ref;
      }
      if (!data.reporting_manager) {
        delete (data as any).reporting_manager;
      }

      console.log("🔍 Register - Final data being submitted:", data);
      console.log(
        "🔍 Register - Stringified data:",
        JSON.stringify(data, null, 2)
      );
      console.log("🔍 Register - Data types:", {
        organization: typeof data.organization,
        role: typeof data.role,
        department_ref: typeof data.department_ref,
        access_level: typeof data.access_level,
        designation: typeof data.designation,
        date_of_joining: typeof data.date_of_joining,
        work_location: typeof data.work_location,
        employment_type: typeof data.employment_type,
      });

      await registerUser(data);
      navigate("/login");
    } catch (error: any) {
      console.error("❌ Register - Full error object:", error);
      console.error("❌ Register - Error response:", error.response?.data);
      console.error("❌ Register - Error status:", error.response?.status);
      console.error("❌ Register - Error message:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background Image */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-1 relative"
      >
        <div className="absolute inset-0 gradient-bg"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-4xl font-bold mb-4"
            >
              Join MH-HR Today
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-xl opacity-90"
            >
              Start managing your HR processes efficiently
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Register Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900"
      >
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Create Account
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign up to get started with MH-HR
              </p>
            </motion.div>
          </div>

          {/* Register Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                  type="text"
                  className="input-field pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className="input-field pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Organization Field */}
            <div>
              <label
                htmlFor="organization"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Organization *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  {...register("organization", {
                    required: "Organization is required",
                    valueAsNumber: true,
                  })}
                  className="input-field pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  disabled={loadingOrgs}
                >
                  <option value="">
                    {loadingOrgs
                      ? "Loading organizations..."
                      : "Select an organization"}
                  </option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.company_name}
                    </option>
                  ))}
                  {organizations.length === 0 && !loadingOrgs && (
                    <option value="1">Default Organization</option>
                  )}
                </select>
              </div>
              {errors.organization && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.organization.message}
                </p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Role *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  {...register("role", {
                    required: "Role is required",
                    valueAsNumber: true,
                  })}
                  className="input-field pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  disabled={loadingRoles}
                >
                  <option value="">
                    {loadingRoles ? "Loading roles..." : "Select a role"}
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Access Level Field */}
            <div>
              <label
                htmlFor="access_level"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Access Level *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  {...register("access_level", {
                    required: "Access level is required",
                  })}
                  className="input-field pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select access level</option>
                  <option value="1">Employee Level 1</option>
                  <option value="2">Employee Level 2</option>
                  <option value="3">Employee Level 3</option>
                  <option value="4">Manager Level 1</option>
                  <option value="5">Manager Level 2</option>
                  <option value="6">Administrator</option>
                  <option value="7">Super Admin</option>
                </select>
              </div>
              {errors.access_level && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.access_level.message}
                </p>
              )}
            </div>

            {/* Designation Field */}
            <div>
              <label
                htmlFor="designation"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Designation *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("designation", {
                    required: "Designation is required",
                    maxLength: {
                      value: 100,
                      message: "Designation must be less than 100 characters",
                    },
                  })}
                  type="text"
                  className="input-field pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your designation"
                />
              </div>
              {errors.designation && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.designation.message}
                </p>
              )}
            </div>

            {/* Reporting Manager Field */}
            <div>
              <label
                htmlFor="reporting_manager"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Reporting Manager
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  {...register("reporting_manager", {
                    valueAsNumber: true,
                  })}
                  className="input-field pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  disabled={loadingManagers}
                >
                  <option value="">
                    {loadingManagers
                      ? "Loading managers..."
                      : "Select a reporting manager"}
                  </option>
                  {reportingManagers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} - {manager.designation} (
                      {manager.department})
                    </option>
                  ))}
                </select>
              </div>
              {errors.reporting_manager && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.reporting_manager.message}
                </p>
              )}
            </div>

            {/* Date of Joining Field */}
            <div>
              <label
                htmlFor="date_of_joining"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Date of Joining *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("date_of_joining", {
                    required: "Date of joining is required",
                  })}
                  type="date"
                  className="input-field pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              {errors.date_of_joining && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.date_of_joining.message}
                </p>
              )}
            </div>

            {/* Work Location Field */}
            <div>
              <label
                htmlFor="work_location"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Work Location *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("work_location", {
                    required: "Work location is required",
                    maxLength: {
                      value: 100,
                      message: "Work location must be less than 100 characters",
                    },
                  })}
                  type="text"
                  className="input-field pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Enter work location"
                />
              </div>
              {errors.work_location && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.work_location.message}
                </p>
              )}
            </div>

            {/* Employment Type Field */}
            <div>
              <label
                htmlFor="employment_type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Employment Type *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  {...register("employment_type", {
                    required: "Employment type is required",
                  })}
                  className="input-field pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select employment type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>
              {errors.employment_type && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.employment_type.message}
                </p>
              )}
            </div>

            {/* Department Reference Field */}
            <div>
              <label
                htmlFor="department_ref"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Department
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  {...register("department_ref", {
                    valueAsNumber: true,
                  })}
                  className="input-field pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  disabled={loadingDepts}
                >
                  <option value="">
                    {loadingDepts
                      ? "Loading departments..."
                      : "Select a department"}
                  </option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>



            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain uppercase, lowercase, and number",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  className="input-field pl-10 pr-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register("confirm_password", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  className="input-field pl-10 pr-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
              >
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </motion.button>

            {/* Links */}
            <div className="text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
              >
                Sign In
              </Link>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
