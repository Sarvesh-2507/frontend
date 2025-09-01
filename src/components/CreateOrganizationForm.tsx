import { motion } from "framer-motion";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  FileText,
  Loader2,
  MapPin,
  Save,
  Users,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { organizationAPI } from "../services/organizationApi";
import { CreateOrganizationData, Organization } from "../types/organization";

interface CreateOrganizationFormProps {
  onSuccess?: (organization: Organization) => void;
  onCancel?: () => void;
  className?: string;
}

interface FormData extends CreateOrganizationData {
  // Additional form fields if needed
  email_domain: string;
}

const CreateOrganizationForm: React.FC<CreateOrganizationFormProps> = ({
  onSuccess,
  onCancel,
  className = "",
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      email_domain: '',
    },
  });

  const industryTypes = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Construction",
    "Transportation",
    "Energy",
    "Agriculture",
    "Entertainment",
    "Government",
    "Non-profit",
    "Other",
  ];

  const employeeRanges = [
    { value: 10, label: "1-10 employees" },
    { value: 50, label: "11-50 employees" },
    { value: 200, label: "51-200 employees" },
    { value: 1000, label: "201-1000 employees" },
    { value: 5000, label: "1001-5000 employees" },
    { value: 10000, label: "5000+ employees" },
  ];

  const onSubmit = async (data: FormData) => {
    console.log("🚀 Form submission started");
    console.log("📝 Form data received:", data);

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    // Check authentication
    const token = localStorage.getItem("accessToken");
    console.log("🔐 Auth token:", token ? "Present" : "Missing");

    if (!token) {
      setSubmitError("You must be logged in to create an organization.");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("🏢 Creating organization with data:", data);
      console.log(
        "🌐 API endpoint: http://192.168.1.132:8000/api/organizations/create/"
      );

      const response = await organizationAPI.createOrganization(data);

      console.log("✅ Organization created successfully:", response.data);
      setSubmitSuccess(true);

      // Reset form
      reset();

      // Call success callback
      if (onSuccess) {
        onSuccess(response.data);
      }

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error("❌ Failed to create organization:", error);

      let errorMessage = "Failed to create organization. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data) {
        // Handle validation errors
        const errors = error.response.data;
        if (typeof errors === "object") {
          const firstError = Object.values(errors)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === "string") {
            errorMessage = firstError;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Organization
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add a new organization to the system
              </p>
            </div>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Form */}
  <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Success Message */}
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 dark:text-green-200">
              Organization created successfully!
            </span>
          </motion.div>
        )}

        {/* Error Message */}
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 dark:text-red-200">
              {submitError}
            </span>
          </motion.div>
        )}

        {/* Company Name */}
  <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              {...register("company_name", {
                required: "Company name is required",
                minLength: {
                  value: 2,
                  message: "Company name must be at least 2 characters",
                },
              })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter company name"
            />
          </div>
          {errors.company_name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.company_name.message}
            </p>
          )}
        </div>

        {/* Email Domain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Domain *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              {...register("email_domain", {
                required: "Email domain is required",
                pattern: {
                  value: /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid domain (e.g. example.com)",
                },
              })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter email domain (e.g. example.com)"
            />
          </div>
          {errors.email_domain && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email_domain.message}
            </p>
          )}
        </div>

        {/* Alternative Name */}
  <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Alternative Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              {...register("name")}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter alternative name (optional)"
            />
          </div>
        </div>

        {/* Description */}
  <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Enter organization description (optional)"
            />
          </div>
        </div>

        {/* Location */}
  <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              {...register("location")}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter location (optional)"
            />
          </div>
        </div>

        {/* Industry Type */}
  <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Industry Type
          </label>
          <select
            {...register("industry_type")}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select industry type (optional)</option>
            {industryTypes.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

  {/* Employee Count */}
  <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Employee Count
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <select
              {...register("employee_count", { valueAsNumber: true })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select employee count (optional)</option>
              {employeeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{isSubmitting ? "Creating..." : "Create Organization"}</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateOrganizationForm;
