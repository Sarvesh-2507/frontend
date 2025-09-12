import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Trash2 } from 'lucide-react';
import MainLayout from '../../../layouts/MainLayout';
import { toast } from 'react-hot-toast';
import { recruitmentAPI, JobPosting, HRDetailsData } from '../../../services/recruitmentApi';

const HRDetailsForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [formData, setFormData] = useState<HRDetailsData>({
    key_responsibilities: '',
    salary_range: '',
    location: '',
    work_shift: '',
    referral_bonus: '',
    perks: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchJobPosting();
    }
  }, [id]);

  const fetchJobPosting = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const posting = await recruitmentAPI.jobPostings.getById(Number(id));
      setJobPosting(posting);
      
      // Pre-fill form data if HR details already exist
      setFormData({
        key_responsibilities: posting.key_responsibilities || '',
        salary_range: posting.salary_range || '',
        location: posting.location || '',
        work_shift: posting.work_shift || '',
        referral_bonus: posting.referral_bonus || '',
        perks: posting.perks || ''
      });
    } catch (error) {
      console.error('Error fetching job posting:', error);
      toast.error('Failed to load job posting details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.key_responsibilities.trim()) {
      newErrors.key_responsibilities = 'Key responsibilities are required';
    }
    if (!formData.salary_range.trim()) {
      newErrors.salary_range = 'Salary range is required';
    } else if (formData.salary_range.length > 50) {
      newErrors.salary_range = 'Salary range must be 50 characters or less';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.length > 100) {
      newErrors.location = 'Location must be 100 characters or less';
    }
    if (!formData.work_shift.trim()) {
      newErrors.work_shift = 'Work shift is required';
    } else if (formData.work_shift.length > 50) {
      newErrors.work_shift = 'Work shift must be 50 characters or less';
    }
    if (formData.perks && formData.perks.length < 1) {
      newErrors.perks = 'Perks must be at least 1 character if provided';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) {
      return;
    }

    setLoading(true);
    
    try {
      console.log('Submitting HR details:', formData);
      
      // Make the API call to submit HR details
      const response = await recruitmentAPI.jobPostings.fillHRDetails(Number(id), formData);
      
      toast.success('HR details saved successfully!');
      
      // Redirect back to job postings dashboard
      navigate('/recruitment/job-posting');
      
    } catch (error) {
      console.error('Error submitting HR details:', error);
      toast.error('Failed to save HR details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !jobPosting) return;

    if (!confirm(`Are you sure you want to delete the job posting "${jobPosting.job_title}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(true);
    try {
      await recruitmentAPI.jobPostings.delete(Number(id));
      toast.success('Job posting deleted successfully');
      navigate('/recruitment/job-posting');
    } catch (error) {
      console.error('Error deleting job posting:', error);
      toast.error('Failed to delete job posting');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/recruitment/job-posting');
  };

  if (loading && !jobPosting) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

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
                Fill HR Details
              </h1>
              {jobPosting && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {jobPosting.job_title} - {jobPosting.department}
                </p>
              )}
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{deleteLoading ? 'Deleting...' : 'Delete Job'}</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save HR Details'}</span>
            </button>
          </div>
        </div>

        {/* Job Posting Summary */}
        {jobPosting && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Job Posting Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Title:</span>
                <p className="text-sm text-gray-900 dark:text-white">{jobPosting.job_title}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Department:</span>
                <p className="text-sm text-gray-900 dark:text-white">{jobPosting.department}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Vacancies:</span>
                <p className="text-sm text-gray-900 dark:text-white">{jobPosting.vacancies}</p>
              </div>
            </div>
          </div>
        )}

        {/* HR Details Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              HR Details
            </h2>
            
            <div className="space-y-6">
              {/* Key Responsibilities */}
              <div>
                <label htmlFor="key_responsibilities" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Key Responsibilities *
                </label>
                <textarea
                  id="key_responsibilities"
                  name="key_responsibilities"
                  rows={4}
                  value={formData.key_responsibilities}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.key_responsibilities ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="List the key responsibilities for this role..."
                />
                {errors.key_responsibilities && (
                  <p className="mt-1 text-sm text-red-600">{errors.key_responsibilities}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Salary Range */}
                <div>
                  <label htmlFor="salary_range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Salary Range *
                  </label>
                  <input
                    type="text"
                    id="salary_range"
                    name="salary_range"
                    value={formData.salary_range}
                    onChange={handleInputChange}
                    maxLength={50}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                      errors.salary_range ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="e.g. $50,000 - $80,000"
                  />
                  {errors.salary_range && (
                    <p className="mt-1 text-sm text-red-600">{errors.salary_range}</p>
                  )}
                </div>

                {/* Location */}
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
                    maxLength={100}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                      errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="e.g. New York, NY or Remote"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                  )}
                </div>

                {/* Work Shift */}
                <div>
                  <label htmlFor="work_shift" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Work Shift *
                  </label>
                  <input
                    type="text"
                    id="work_shift"
                    name="work_shift"
                    value={formData.work_shift}
                    onChange={handleInputChange}
                    maxLength={50}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                      errors.work_shift ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="e.g. 9 AM - 5 PM, Night Shift"
                  />
                  {errors.work_shift && (
                    <p className="mt-1 text-sm text-red-600">{errors.work_shift}</p>
                  )}
                </div>

                {/* Referral Bonus */}
                <div>
                  <label htmlFor="referral_bonus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Referral Bonus
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="referral_bonus"
                    name="referral_bonus"
                    value={formData.referral_bonus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g. 1000"
                  />
                </div>
              </div>

              {/* Perks */}
              <div>
                <label htmlFor="perks" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Perks
                </label>
                <textarea
                  id="perks"
                  name="perks"
                  rows={3}
                  value={formData.perks}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.perks ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="List the perks and benefits for this role..."
                />
                {errors.perks && (
                  <p className="mt-1 text-sm text-red-600">{errors.perks}</p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default HRDetailsForm;
