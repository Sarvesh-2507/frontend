import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Search, Filter, FileText, Users, XCircle } from 'lucide-react';
import MainLayout from '../../../layouts/MainLayout';
import { toast } from 'react-hot-toast';
import { recruitmentAPI, JobPosting } from '../../../services/recruitmentApi';
import ReferralsModal from './ReferralsModal';
import HRRejectModal from './HRRejectModal';

const JobPostingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [referralsModal, setReferralsModal] = useState<{
    isOpen: boolean;
    jobPostingId: number | null;
    jobTitle: string;
  }>({
    isOpen: false,
    jobPostingId: null,
    jobTitle: '',
  });
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean;
    jobPosting: JobPosting | null;
  }>({
    isOpen: false,
    jobPosting: null,
  });

  useEffect(() => {
    fetchJobPostings();
    
    // Show success message if redirected from form
    if (location.state?.message) {
      toast.success(location.state.message);
      // Clear the state to prevent showing the message again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const fetchJobPostings = async () => {
    try {
      setLoading(true);
      const data = await recruitmentAPI.jobPostings.getAll({
        search: searchTerm || undefined,
        job_type: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setJobPostings(data);
      toast.success(`Loaded ${data.length} job postings`);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      toast.error('Failed to load job postings');
      setJobPostings([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPostings = jobPostings.filter(posting => {
    const matchesSearch = posting.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         posting.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         posting.Tl_Name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = statusFilter === 'all' || posting.job_type === statusFilter;
    return matchesSearch && matchesType;
  });

  const handleFillHRDetails = (posting: JobPosting) => {
    // Navigate to HR details form
    console.log('Fill HR Details for posting:', posting);
    navigate(`/recruitment/job-posting/hr-details/${posting.id}`);
  };

  const handleViewReferrals = (posting: JobPosting) => {
    setReferralsModal({
      isOpen: true,
      jobPostingId: posting.id,
      jobTitle: posting.job_title,
    });
  };

  const handleCloseReferralsModal = () => {
    setReferralsModal({
      isOpen: false,
      jobPostingId: null,
      jobTitle: '',
    });
  };

  const handleRejectRequest = (posting: JobPosting) => {
    setRejectModal({
      isOpen: true,
      jobPosting: posting,
    });
  };

  const handleCloseRejectModal = () => {
    setRejectModal({
      isOpen: false,
      jobPosting: null,
    });
  };

  const handleRejectSuccess = () => {
    // Refresh the job postings list
    fetchJobPostings();
  };

  const getTypeColor = (type: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (type) {
      case 'Full-time':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
      case 'Part-time':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
      case 'Contract':
        return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300`;
      case 'Internship':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300`;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
              </div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
            </div>

            {/* Filters skeleton */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
            </div>

            {/* Table skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                {/* Table header skeleton */}
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3">
                  <div className="grid grid-cols-9 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                      <div key={i} className="h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    ))}
                  </div>
                </div>
                
                {/* Table rows skeleton */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="px-6 py-4">
                      <div className="grid grid-cols-9 gap-4 items-center">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading text */}
            <div className="text-center mt-8">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600 dark:text-gray-400">Loading job postings...</span>
              </div>
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Job Postings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and create job postings for your organization
            </p>
          </div>
          <button
            onClick={() => setReferralsModal({
              isOpen: true,
              jobPostingId: null,
              jobTitle: 'All Job Postings',
            })}
            className="btn-primary flex items-center space-x-2"
          >
            <Users className="w-5 h-5" />
            <span>View Referrals</span>
          </button>
        </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search job postings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
      </div>

      {/* Job Postings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Job Role ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  TL Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Vacancies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Job Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Min Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Education
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPostings.length > 0 ? (
                filteredPostings.map((posting) => (
                  <tr key={posting.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {posting.job_role_id || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {posting.job_title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Skills: {posting.required_skills}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {posting.Tl_Name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {posting.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {posting.vacancies}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getTypeColor(posting.job_type)}>
                        {posting.job_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {posting.min_experience} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {posting.education}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleFillHRDetails(posting)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          title="Fill HR Details"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Fill HR Details
                        </button>
                        <button
                          onClick={() => handleRejectRequest(posting)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          title="Reject Job Posting Request"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject Request
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <div className="text-lg font-medium">No job postings found</div>
                      <div className="mt-2">
                        {searchTerm || statusFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria'
                          : 'Create your first job posting to get started'
                        }
                      </div>
                      {!searchTerm && statusFilter === 'all' && (
                        <button
                          onClick={() => navigate('/recruitment/job-posting/create')}
                          className="btn-primary mt-4"
                        >
                          Create New Posting
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Referrals Modal */}
      <ReferralsModal
        isOpen={referralsModal.isOpen}
        onClose={handleCloseReferralsModal}
        jobPostingId={referralsModal.jobPostingId}
        jobTitle={referralsModal.jobTitle}
      />

      {/* HR Reject Modal */}
      <HRRejectModal
        isOpen={rejectModal.isOpen}
        onClose={handleCloseRejectModal}
        jobPosting={rejectModal.jobPosting}
        onRejectSuccess={handleRejectSuccess}
      />
    </MainLayout>
  );
};

export default JobPostingDashboard;
