// Recruitment API base URL
const RECRUITMENT_API_BASE_URL = 'http://192.168.1.97:8000';

// Helper function for making API calls
const makeApiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${RECRUITMENT_API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
};

// Job Posting interface
export interface JobPosting {
  id: number;
  job_role_id: number;
  Tl_Name: string;
  job_title: string;
  department: string;
  vacancies: number;
  job_type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  required_skills: string;
  min_experience: number;
  education: string;
  description?: string;
  salary_range?: string;
  location?: string;
  deadline?: string;
  status?: 'active' | 'inactive' | 'closed';
  created_at?: string;
  updated_at?: string;
  // HR Details fields
  key_responsibilities?: string;
  work_shift?: string;
  referral_bonus?: string;
  perks?: string;
}

// Create Job Posting interface
export interface CreateJobPostingData {
  job_role_id?: number;
  job_title: string;
  department: string;
  vacancies: number;
  job_type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  required_skills: string;
  min_experience: number;
  education: string;
  description?: string;
  salary_range?: string;
  location?: string;
  deadline?: string;
}

// Update Job Posting interface
export interface UpdateJobPostingData extends Partial<CreateJobPostingData> {
  status?: 'active' | 'inactive' | 'closed';
}

// HR Details interface
export interface HRDetailsData {
  key_responsibilities: string;
  salary_range: string;
  location: string;
  work_shift: string;
  referral_bonus?: string;
  perks?: string;
}

// Candidate interface
export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone?: string;
  position_applied: string;
  experience_years: number;
  skills: string;
  education: string;
  resume_url?: string;
  cover_letter?: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  applied_date: string;
  interview_date?: string;
  notes?: string;
  rating?: number;
}

// Interview interface
export interface Interview {
  id: number;
  candidate_id: number;
  interviewer_name: string;
  interview_date: string;
  interview_time: string;
  interview_type: 'phone' | 'video' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  feedback?: string;
  rating?: number;
}

// Recruitment Stats interface
export interface RecruitmentStats {
  total_jobs: number;
  active_jobs: number;
  total_candidates: number;
  interviews_scheduled: number;
  offers_extended: number;
  hired_this_month: number;
  applications_this_week: number;
  interview_completion_rate: number;
}

// Referral interface
export interface Referral {
  id: number;
  job_role_id: string;
  job_title: string;
  employee_name: string;
  friend_name: string;
  friend_email: string;
  friend_phone: string;
  friend_resume: string;
  linkedin_url: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW' | 'INTERVIEWED';
  remarks: string | null;
  submitted_at: string;
}

// API Response interface
interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
  count?: number;
  next?: string;
  previous?: string;
}

// Job Posting API functions
export const jobPostingAPI = {
  // Get all job postings
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    job_type?: string;
    status?: string;
  }): Promise<JobPosting[]> => {
    console.log('🔄 Fetching job postings...');
    try {
      const url = new URL(`${RECRUITMENT_API_BASE_URL}/vacancy/tl-only/`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value) url.searchParams.append(key, String(value));
        });
      }
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Job postings fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching job postings:', error);
      throw error;
    }
  },

  // Get single job posting by ID
  getById: async (id: number): Promise<JobPosting> => {
    console.log(`🔄 Fetching job posting with ID: ${id}`);
    try {
      const data = await makeApiCall(`/vacancy/tl-only/${id}/`);
      console.log('✅ Job posting fetched successfully:', data);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching job posting ${id}:`, error);
      throw error;
    }
  },

  // Create new job posting
  create: async (data: CreateJobPostingData): Promise<JobPosting> => {
    console.log('🔄 Creating new job posting:', data);
    try {
      const response = await fetch(`${RECRUITMENT_API_BASE_URL}/vacancy/job-postings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Job posting created successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error creating job posting:', error);
      throw error;
    }
  },

  // Update existing job posting
  update: async (id: number, data: UpdateJobPostingData): Promise<JobPosting> => {
    console.log(`🔄 Updating job posting ${id}:`, data);
    try {
      const result = await makeApiCall(`/vacancy/job-postings/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      console.log('✅ Job posting updated successfully:', result);
      return result;
    } catch (error) {
      console.error(`❌ Error updating job posting ${id}:`, error);
      throw error;
    }
  },

  // Delete job posting
  delete: async (id: number): Promise<void> => {
    console.log(`🔄 Deleting job posting ${id}`);
    try {
      const response = await fetch(`${RECRUITMENT_API_BASE_URL}/vacancy/tl-only/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log('✅ Job posting deleted successfully');
    } catch (error) {
      console.error(`❌ Error deleting job posting ${id}:`, error);
      throw error;
    }
  },

  // Publish job posting (change status to active)
  publish: async (id: number): Promise<JobPosting> => {
    console.log(`🔄 Publishing job posting ${id}`);
    try {
      const result = await makeApiCall(`/vacancy/job-postings/${id}/publish/`, {
        method: 'POST',
      });
      console.log('✅ Job posting published successfully:', result);
      return result;
    } catch (error) {
      console.error(`❌ Error publishing job posting ${id}:`, error);
      throw error;
    }
  },

  // Close job posting
  close: async (id: number): Promise<JobPosting> => {
    console.log(`🔄 Closing job posting ${id}`);
    try {
      const result = await makeApiCall(`/vacancy/job-postings/${id}/close/`, {
        method: 'POST',
      });
      console.log('✅ Job posting closed successfully:', result);
      return result;
    } catch (error) {
      console.error(`❌ Error closing job posting ${id}:`, error);
      throw error;
    }
  },

  // Fill HR Details
  fillHRDetails: async (id: number, data: HRDetailsData): Promise<JobPosting> => {
    console.log(`🔄 Filling HR details for job posting ${id}:`, data);
    try {
      const response = await fetch(`${RECRUITMENT_API_BASE_URL}/vacancy/tl-hr-post/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ HR details filled successfully:', result);
      return result;
    } catch (error) {
      console.error(`❌ Error filling HR details for job posting ${id}:`, error);
      throw error;
    }
  },

  // HR Reject Team Lead Request
  hrRejectRequest: async (id: number, status: string, remarks: string): Promise<JobPosting> => {
    console.log(`🔄 HR rejecting TL request for job posting ${id}:`, { status, remarks });
    try {
      const response = await fetch(`${RECRUITMENT_API_BASE_URL}/vacancy/hr/tl_vacancy_status/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
        body: JSON.stringify({
          status,
          remarks,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ HR rejection processed successfully:', result);
      return result;
    } catch (error) {
      console.error(`❌ Error rejecting TL request for job posting ${id}:`, error);
      throw error;
    }
  },
};

// Candidate API functions
export const candidateAPI = {
  // Get all candidates
  getAll: async (params: {
    limit?: number;
    search?: string;
    position?: string;
    status?: string;
    job_posting_id?: number;
  }): Promise<Candidate[]> => {
    console.log('🔄 Fetching candidates...');
    try {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      const endpoint = queryString ? `/recruitment/candidates/?${queryString}` : '/recruitment/candidates/';
      const result = await makeApiCall(endpoint);
      console.log('✅ Candidates fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching candidates:', error);
      throw error;
    }
  },

  // Get single candidate by ID
  getById: async (id: number): Promise<Candidate> => {
    console.log(`🔄 Fetching candidate with ID: ${id}`);
    try {
      const result = await makeApiCall(`/recruitment/candidates/${id}/`);
      console.log('✅ Candidate fetched successfully:', result);
      return result;
    } catch (error) {
      console.error(`❌ Error fetching candidate ${id}:`, error);
      throw error;
    }
  },

  // Update candidate status
  updateStatus: async (id: number, status: Candidate['status'], notes?: string): Promise<Candidate> => {
    console.log(`🔄 Updating candidate ${id} status to: ${status}`);
    try {
      const result = await makeApiCall(`/recruitment/candidates/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          status,
          notes,
        }),
      });
      console.log('✅ Candidate status updated successfully:', result);
      return result;
    } catch (error) {
      console.error(`❌ Error updating candidate ${id} status:`, error);
      throw error;
    }
  },

  // Update candidate general information
  update: async (id: number, data: Partial<Candidate>): Promise<Candidate> => {
    console.log(`🔄 Updating candidate ${id} with data:`, data);
    try {
      const result = await makeApiCall(`/recruitment/candidates/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...data,
        }),
      });
      console.log('✅ Candidate updated successfully:', result);
      return result;
    } catch (error) {
      console.error(`❌ Error updating candidate ${id}:`, error);
      throw error;
    }
  },

  // Add candidate rating
  rate: async (id: number, rating: number, feedback?: string): Promise<Candidate> => {
    console.log(`🔄 Rating candidate ${id}: ${rating}/5`);
    try {
      const result = await makeApiCall(`/recruitment/candidates/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          rating,
          notes: feedback,
        }),
      });
      console.log('✅ Candidate rated successfully:', result);
      return result;
    } catch (error) {
      console.error(`❌ Error rating candidate ${id}:`, error);
      throw error;
    }
  },
};

// Interview API functions
export const interviewAPI = {
  // Get all interviews
  getAll: async (params?: {
    page?: number;
    limit?: number;
    candidate_id?: number;
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<Interview[]> => {
    console.log('🔄 Fetching interviews...');
    try {
      const queryString = params ? new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString() : '';
      const endpoint = queryString ? `/recruitment/interviews/?${queryString}` : '/recruitment/interviews/';
      const result = await makeApiCall(endpoint);
      console.log('✅ Interviews fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching interviews:', error);
      throw error;
    }
  },

  // Schedule new interview
  schedule: async (data: {
    candidate_id: number;
    interviewer_name: string;
    interview_date: string;
    interview_time: string;
    interview_type: Interview['interview_type'];
    notes?: string;
  }): Promise<Interview> => {
    console.log('🔄 Scheduling new interview:', data);
    try {
      const result = await makeApiCall('/recruitment/interviews/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      console.log('✅ Interview scheduled successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error scheduling interview:', error);
      throw error;
    }
  },

  // Update interview
  update: async (id: number, data: Partial<Interview>): Promise<Interview> => {
    console.log(`🔄 Updating interview ${id}:`, data);
    try {
      const result = await makeApiCall(`/recruitment/interviews/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      console.log('✅ Interview updated successfully:', result);
      return result;
    } catch (error) {
      console.error(`❌ Error updating interview ${id}:`, error);
      throw error;
    }
  },

  // Cancel interview
  cancel: async (id: number, reason?: string): Promise<Interview> => {
    console.log(`🔄 Cancelling interview ${id}`);
    try {
      const result = await makeApiCall(`/recruitment/interviews/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'cancelled',
          notes: reason,
        }),
      });
      console.log('✅ Interview cancelled successfully:', result);
      return result;
    } catch (error) {
      console.error(`❌ Error cancelling interview ${id}:`, error);
      throw error;
    }
  },
};

// Referrals API functions
export const referralsAPI = {
  // Get all referrals for HR view
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    job_posting_id?: number;
  }): Promise<Referral[]> => {
    console.log('🔄 Fetching referrals...');
    try {
      const url = new URL(`${RECRUITMENT_API_BASE_URL}/vacancy/hr/referrals/`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) url.searchParams.append(key, String(value));
        });
      }
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Referrals fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching referrals:', error);
      throw error;
    }
  },

  // Get referrals for a specific job posting
  getByJobPosting: async (jobPostingId: number): Promise<Referral[]> => {
    console.log(`🔄 Fetching referrals for job posting ${jobPostingId}`);
    try {
      const response = await fetch(`${RECRUITMENT_API_BASE_URL}/vacancy/hr/referrals/?job_posting_id=${jobPostingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Job posting referrals fetched successfully:', data);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching referrals for job posting ${jobPostingId}:`, error);
      throw error;
    }
  },

  // Get single referral by ID
  getById: async (id: number): Promise<Referral> => {
    console.log(`🔄 Fetching referral with ID: ${id}`);
    try {
      const result = await makeApiCall(`/vacancy/hr/referrals/${id}/`);
      console.log('✅ Referral fetched successfully:', result);
      return result;
    } catch (error) {
      console.error(`❌ Error fetching referral ${id}:`, error);
      throw error;
    }
  },

  // Update referral status
  updateStatus: async (id: number, status: Referral['status'], remarks?: string): Promise<Referral> => {
    console.log(`🔄 Updating referral ${id} status to: ${status}`);
    try {
      const response = await fetch(`${RECRUITMENT_API_BASE_URL}/vacancy/hr/referrals/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
        body: JSON.stringify({
          id,
          status,
          remarks: remarks || null,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Referral status updated successfully:', result);
      return result;
    } catch (error) {
      console.error(`❌ Error updating referral ${id} status:`, error);
      throw error;
    }
  },
};

// Recruitment Analytics API functions
export const recruitmentAnalyticsAPI = {
  // Get recruitment statistics
  getStats: async (params?: {
    date_from?: string;
    date_to?: string;
    department?: string;
  }): Promise<RecruitmentStats> => {
    console.log('🔄 Fetching recruitment statistics...');
    try {
      const queryString = params ? new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString() : '';
      const endpoint = queryString ? `/recruitment/analytics/stats/?${queryString}` : '/recruitment/analytics/stats/';
      const result = await makeApiCall(endpoint);
      console.log('✅ Recruitment stats fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching recruitment stats:', error);
      throw error;
    }
  },

  // Get hiring funnel data
  getFunnelData: async (params?: {
    job_posting_id?: number;
    date_from?: string;
    date_to?: string;
  }): Promise<{
    applied: number;
    screening: number;
    interview: number;
    offer: number;
    hired: number;
    rejected: number;
  }> => {
    console.log('🔄 Fetching hiring funnel data...');
    try {
      const queryString = params ? new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString() : '';
      const endpoint = queryString ? `/recruitment/analytics/funnel/?${queryString}` : '/recruitment/analytics/funnel/';
      const result = await makeApiCall(endpoint);
      console.log('✅ Funnel data fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching funnel data:', error);
      throw error;
    }
  },

  // Get recruitment performance metrics
  getPerformanceMetrics: async (params?: {
    date_from?: string;
    date_to?: string;
    department?: string;
  }): Promise<{
    time_to_hire: number;
    cost_per_hire: number;
    offer_acceptance_rate: number;
    quality_of_hire: number;
    source_effectiveness: Array<{
      source: string;
      applications: number;
      hires: number;
      conversion_rate: number;
    }>;
  }> => {
    console.log('🔄 Fetching performance metrics...');
    try {
      const queryString = params ? new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString() : '';
      const endpoint = queryString ? `/recruitment/analytics/performance/?${queryString}` : '/recruitment/analytics/performance/';
      const result = await makeApiCall(endpoint);
      console.log('✅ Performance metrics fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching performance metrics:', error);
      throw error;
    }
  },
};

// Combined recruitment API object
export const recruitmentAPI = {
  jobPostings: jobPostingAPI,
  candidates: candidateAPI,
  interviews: interviewAPI,
  referrals: referralsAPI,
  analytics: recruitmentAnalyticsAPI,
};

export default recruitmentAPI;
