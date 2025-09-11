import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import MainLayout from '../../../layouts/MainLayout';
import { toast } from 'react-hot-toast';
import { recruitmentAPI, CreateJobPostingData } from '../../../services/recruitmentApi';

interface JobPostingFormData {
  job_title: string;
  department: string;
  location: string;
  job_type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  min_experience: number;
  required_skills: string;
  education: string;
  vacancies: number;
  salary_range: string;
  description: string;
  deadline: string;
  status: 'draft' | 'active';
}

const JobPostingForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<JobPostingFormData>({
    job_title: '',
    department: '',
    location: '',
    job_type: 'Full-time',
    min_experience: 0,
    required_skills: '',
    education: '',
    vacancies: 1,
    salary_range: '',
    description: '',
    deadline: '',
    status: 'draft'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vacancies' || name === 'min_experience'
        ? Number(value)
        : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof JobPostingFormData]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.job_title.trim()) newErrors.job_title = 'Job title is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.required_skills.trim()) newErrors.required_skills = 'Required skills are required';
    if (!formData.education.trim()) newErrors.education = 'Education requirements are required';
    if (!formData.deadline) newErrors.deadline = 'Application deadline is required';
    if (formData.vacancies < 1) newErrors.vacancies = 'Number of vacancies must be at least 1';
    if (formData.min_experience < 0) newErrors.min_experience = 'Minimum experience cannot be negative';

    // Validate deadline is in the future
    if (formData.deadline && new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = 'Application deadline must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    
    if (!isDraft && !validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const submissionData: CreateJobPostingData = {
        job_title: formData.job_title,
        department: formData.department,
        location: formData.location,
        job_type: formData.job_type,
        min_experience: formData.min_experience,
        required_skills: formData.required_skills,
        education: formData.education,
        vacancies: formData.vacancies,
        salary_range: formData.salary_range,
        description: formData.description,
        deadline: formData.deadline,
      };
      
      console.log('Submitting job posting:', submissionData);
      
      // Make the actual API call
      const response = await recruitmentAPI.jobPostings.create(submissionData);
      
      toast.success(`Job posting ${isDraft ? 'saved as draft' : 'created'} successfully!`);
      
      // Redirect back to dashboard on success
      navigate('/recruitment/job-posting');
      
    } catch (error) {
      console.error('Error submitting job posting:', error);
      toast.error('Failed to create job posting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (Object.values(formData).some(value => value.trim() !== '')) {
      if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
        navigate('/recruitment/job-posting');
      }
    } else {
      navigate('/recruitment/job-posting');
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/recruitment/job-posting')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Job Posting
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Fill in the details below to create a new job posting
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="btn-secondary flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save as Draft'}</span>
          </button>
          <button
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Publishing...' : 'Publish Job'}</span>
          </button>
          </div>
        </div>

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="job_title"
                name="job_title"
                value={formData.job_title}
                onChange={handleInputChange}
                className={`input-field ${
                  errors.job_title ? 'border-red-500' : ''
                }`}
                placeholder="e.g. Senior Software Engineer"
              />
              {errors.job_title && <p className="mt-1 text-sm text-red-600">{errors.job_title}</p>}
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department *
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.department ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g. Engineering"
              />
              {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g. Remote, New York, San Francisco"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            <div>
              <label htmlFor="job_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employment Type
              </label>
              <select
                id="job_type"
                name="job_type"
                value={formData.job_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label htmlFor="min_experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Experience (years)
              </label>
              <input
                type="number"
                id="min_experience"
                name="min_experience"
                value={formData.min_experience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. 3"
                min={0}
              />
              {errors.min_experience && <p className="mt-1 text-sm text-red-600">{errors.min_experience}</p>}
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Application Closing Date *
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.deadline ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.deadline && <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label htmlFor="salary_range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Salary Range
              </label>
              <input
                type="text"
                id="salary_range"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. 50000-80000"
              />
            </div>

            <div>
              <label htmlFor="vacancies" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Vacancies *
              </label>
              <input
                type="number"
                id="vacancies"
                name="vacancies"
                value={formData.vacancies}
                onChange={handleInputChange}
                min={1}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.vacancies ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g. 3"
              />
              {errors.vacancies && <p className="mt-1 text-sm text-red-600">{errors.vacancies}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Job Details
          </h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Provide a detailed description of the job role..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="required_skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Requirements & Qualifications *
              </label>
              <textarea
                id="required_skills"
                name="required_skills"
                rows={4}
                value={formData.required_skills}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.required_skills ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="List the required skills, qualifications, and experience..."
              />
              {errors.required_skills && <p className="mt-1 text-sm text-red-600">{errors.required_skills}</p>}
            </div>

            <div>
              <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Benefits & Perks
              </label>
              <textarea
                id="benefits"
                name="benefits"
                rows={3}
                value={(formData as any).benefits || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="List the benefits, perks, and compensation details..."
              />
            {/* Remove benefits field if not present in JobPostingFormData */}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Draft posts are not visible to applicants. Active posts are live and accepting applications.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
    </MainLayout>
  );
};

export default JobPostingForm;
