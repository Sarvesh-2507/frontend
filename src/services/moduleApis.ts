import axios, { AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_USE_MOCK !== "false"
  ? "http://localhost:3002/api"
  : "http://192.168.1.132:8000/api";

// Common headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
});

// Types
export interface Employee {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: 'active' | 'inactive';
  joining_date: string;
  avatar?: string;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_date: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  date: string;
  check_in: string;
  check_out: string;
  hours_worked: number;
  status: 'present' | 'absent' | 'late' | 'half_day';
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract';
  description: string;
  requirements: string[];
  salary_range: string;
  status: 'active' | 'closed';
  posted_date: string;
  applications_count: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position_applied: string;
  status: 'applied' | 'screening' | 'interview' | 'selected' | 'rejected';
  resume_url?: string;
  applied_date: string;
  experience_years: number;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  serial_number: string;
  assigned_to?: string;
  assigned_employee?: string;
  status: 'available' | 'assigned' | 'maintenance' | 'retired';
  purchase_date: string;
  warranty_expiry?: string;
  value: number;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_by: string;
  assigned_to?: string;
  created_date: string;
  updated_date: string;
}

// Recruitment API
export const recruitmentAPI = {
  // Job Postings
  getJobPostings: async (): Promise<AxiosResponse<JobPosting[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recruitment/jobs/`, {
        headers: getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error('Error fetching job postings:', error);
      // Mock data fallback
      return {
        data: [
          {
            id: '1',
            title: 'Senior Software Engineer',
            department: 'Engineering',
            location: 'Remote',
            type: 'full_time',
            description: 'We are looking for a senior software engineer...',
            requirements: ['5+ years experience', 'React', 'Node.js'],
            salary_range: '$80,000 - $120,000',
            status: 'active',
            posted_date: '2024-01-15',
            applications_count: 25,
          },
        ],
        status: 200,
      } as AxiosResponse<JobPosting[]>;
    }
  },

  createJobPosting: async (jobData: Partial<JobPosting>): Promise<AxiosResponse<JobPosting>> => {
    return axios.post(`${API_BASE_URL}/recruitment/jobs/`, jobData, {
      headers: getAuthHeaders(),
    });
  },

  updateJobPosting: async (id: string, jobData: Partial<JobPosting>): Promise<AxiosResponse<JobPosting>> => {
    return axios.put(`${API_BASE_URL}/recruitment/jobs/${id}/`, jobData, {
      headers: getAuthHeaders(),
    });
  },

  deleteJobPosting: async (id: string): Promise<AxiosResponse<void>> => {
    return axios.delete(`${API_BASE_URL}/recruitment/jobs/${id}/`, {
      headers: getAuthHeaders(),
    });
  },

  // Candidates
  getCandidates: async (): Promise<AxiosResponse<Candidate[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recruitment/candidates/`, {
        headers: getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      // Mock data fallback
      return {
        data: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+1234567890',
            position_applied: 'Senior Software Engineer',
            status: 'interview',
            applied_date: '2024-01-10',
            experience_years: 6,
          },
        ],
        status: 200,
      } as AxiosResponse<Candidate[]>;
    }
  },

  updateCandidateStatus: async (id: string, status: string): Promise<AxiosResponse<Candidate>> => {
    return axios.patch(`${API_BASE_URL}/recruitment/candidates/${id}/`, { status }, {
      headers: getAuthHeaders(),
    });
  },
};

// Employee API
export const employeeAPI = {
  getEmployees: async (params?: any): Promise<AxiosResponse<Employee[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees/`, {
        headers: getAuthHeaders(),
        params,
      });
      return response;
    } catch (error) {
      console.error('Error fetching employees:', error);
      // Mock data fallback
      return {
        data: [
          {
            id: '1',
            employee_id: 'EMP001',
            name: 'Alice Johnson',
            email: 'alice@company.com',
            phone: '+1234567890',
            department: 'Engineering',
            designation: 'Senior Developer',
            status: 'active',
            joining_date: '2023-01-15',
          },
        ],
        status: 200,
      } as AxiosResponse<Employee[]>;
    }
  },

  getEmployeeById: async (id: string): Promise<AxiosResponse<Employee>> => {
    return axios.get(`${API_BASE_URL}/employees/${id}/`, {
      headers: getAuthHeaders(),
    });
  },

  createEmployee: async (employeeData: Partial<Employee>): Promise<AxiosResponse<Employee>> => {
    return axios.post(`${API_BASE_URL}/employees/`, employeeData, {
      headers: getAuthHeaders(),
    });
  },

  updateEmployee: async (id: string, employeeData: Partial<Employee>): Promise<AxiosResponse<Employee>> => {
    return axios.put(`${API_BASE_URL}/employees/${id}/`, employeeData, {
      headers: getAuthHeaders(),
    });
  },

  deleteEmployee: async (id: string): Promise<AxiosResponse<void>> => {
    return axios.delete(`${API_BASE_URL}/employees/${id}/`, {
      headers: getAuthHeaders(),
    });
  },
};

// Attendance API
export const attendanceAPI = {
  getAttendance: async (params?: any): Promise<AxiosResponse<AttendanceRecord[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/attendance/`, {
        headers: getAuthHeaders(),
        params,
      });
      return response;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      // Mock data fallback
      return {
        data: [
          {
            id: '1',
            employee_id: '1',
            employee_name: 'Alice Johnson',
            date: '2024-01-15',
            check_in: '09:00',
            check_out: '17:30',
            hours_worked: 8.5,
            status: 'present',
          },
        ],
        status: 200,
      } as AxiosResponse<AttendanceRecord[]>;
    }
  },

  markAttendance: async (attendanceData: Partial<AttendanceRecord>): Promise<AxiosResponse<AttendanceRecord>> => {
    return axios.post(`${API_BASE_URL}/attendance/`, attendanceData, {
      headers: getAuthHeaders(),
    });
  },

  updateAttendance: async (id: string, attendanceData: Partial<AttendanceRecord>): Promise<AxiosResponse<AttendanceRecord>> => {
    return axios.put(`${API_BASE_URL}/attendance/${id}/`, attendanceData, {
      headers: getAuthHeaders(),
    });
  },
};

// Leave API
export const leaveAPI = {
  getLeaveRequests: async (params?: any): Promise<AxiosResponse<LeaveRequest[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/leave/`, {
        headers: getAuthHeaders(),
        params,
      });
      return response;
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      // Mock data fallback
      return {
        data: [
          {
            id: '1',
            employee_id: '1',
            employee_name: 'Alice Johnson',
            leave_type: 'Annual Leave',
            start_date: '2024-02-01',
            end_date: '2024-02-05',
            days: 5,
            reason: 'Family vacation',
            status: 'pending',
            applied_date: '2024-01-15',
          },
        ],
        status: 200,
      } as AxiosResponse<LeaveRequest[]>;
    }
  },

  createLeaveRequest: async (leaveData: Partial<LeaveRequest>): Promise<AxiosResponse<LeaveRequest>> => {
    return axios.post(`${API_BASE_URL}/leave/`, leaveData, {
      headers: getAuthHeaders(),
    });
  },

  updateLeaveStatus: async (id: string, status: string): Promise<AxiosResponse<LeaveRequest>> => {
    return axios.patch(`${API_BASE_URL}/leave/${id}/`, { status }, {
      headers: getAuthHeaders(),
    });
  },
};

// Assets API
export const assetsAPI = {
  getAssets: async (params?: any): Promise<AxiosResponse<Asset[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/assets/`, {
        headers: getAuthHeaders(),
        params,
      });
      return response;
    } catch (error) {
      console.error('Error fetching assets:', error);
      // Mock data fallback
      return {
        data: [
          {
            id: '1',
            name: 'MacBook Pro 16"',
            category: 'Laptop',
            serial_number: 'MBP2024001',
            assigned_to: '1',
            assigned_employee: 'Alice Johnson',
            status: 'assigned',
            purchase_date: '2024-01-01',
            warranty_expiry: '2027-01-01',
            value: 2500,
          },
        ],
        status: 200,
      } as AxiosResponse<Asset[]>;
    }
  },

  createAsset: async (assetData: Partial<Asset>): Promise<AxiosResponse<Asset>> => {
    return axios.post(`${API_BASE_URL}/assets/`, assetData, {
      headers: getAuthHeaders(),
    });
  },

  updateAsset: async (id: string, assetData: Partial<Asset>): Promise<AxiosResponse<Asset>> => {
    return axios.put(`${API_BASE_URL}/assets/${id}/`, assetData, {
      headers: getAuthHeaders(),
    });
  },

  assignAsset: async (id: string, employeeId: string): Promise<AxiosResponse<Asset>> => {
    return axios.patch(`${API_BASE_URL}/assets/${id}/assign/`, { employee_id: employeeId }, {
      headers: getAuthHeaders(),
    });
  },

  returnAsset: async (id: string): Promise<AxiosResponse<Asset>> => {
    return axios.patch(`${API_BASE_URL}/assets/${id}/return/`, {}, {
      headers: getAuthHeaders(),
    });
  },
};

// Help Desk API
export const helpDeskAPI = {
  getTickets: async (params?: any): Promise<AxiosResponse<SupportTicket[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/helpdesk/tickets/`, {
        headers: getAuthHeaders(),
        params,
      });
      return response;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      // Mock data fallback
      return {
        data: [
          {
            id: '1',
            title: 'Login Issues',
            description: 'Unable to login to the system',
            category: 'Technical',
            priority: 'high',
            status: 'open',
            created_by: 'Alice Johnson',
            created_date: '2024-01-15',
            updated_date: '2024-01-15',
          },
        ],
        status: 200,
      } as AxiosResponse<SupportTicket[]>;
    }
  },

  createTicket: async (ticketData: Partial<SupportTicket>): Promise<AxiosResponse<SupportTicket>> => {
    return axios.post(`${API_BASE_URL}/helpdesk/tickets/`, ticketData, {
      headers: getAuthHeaders(),
    });
  },

  updateTicket: async (id: string, ticketData: Partial<SupportTicket>): Promise<AxiosResponse<SupportTicket>> => {
    return axios.put(`${API_BASE_URL}/helpdesk/tickets/${id}/`, ticketData, {
      headers: getAuthHeaders(),
    });
  },

  updateTicketStatus: async (id: string, status: string): Promise<AxiosResponse<SupportTicket>> => {
    return axios.patch(`${API_BASE_URL}/helpdesk/tickets/${id}/`, { status }, {
      headers: getAuthHeaders(),
    });
  },
};

// Payroll API
export const payrollAPI = {
  getPayrollRecords: async (params?: any): Promise<AxiosResponse<any[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payroll/`, {
        headers: getAuthHeaders(),
        params,
      });
      return response;
    } catch (error) {
      console.error('Error fetching payroll records:', error);
      // Mock data fallback
      return {
        data: [
          {
            id: '1',
            employee_id: '1',
            employee_name: 'Alice Johnson',
            month: '2024-01',
            basic_salary: 5000,
            allowances: 1000,
            deductions: 500,
            net_salary: 5500,
            status: 'processed',
          },
        ],
        status: 200,
      } as AxiosResponse<any[]>;
    }
  },

  processPayroll: async (month: string): Promise<AxiosResponse<any>> => {
    return axios.post(`${API_BASE_URL}/payroll/process/`, { month }, {
      headers: getAuthHeaders(),
    });
  },
};

// Performance API
export const performanceAPI = {
  getPerformanceReviews: async (params?: any): Promise<AxiosResponse<any[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/performance/reviews/`, {
        headers: getAuthHeaders(),
        params,
      });
      return response;
    } catch (error) {
      console.error('Error fetching performance reviews:', error);
      // Mock data fallback
      return {
        data: [
          {
            id: '1',
            employee_id: '1',
            employee_name: 'Alice Johnson',
            review_period: 'Q1 2024',
            overall_rating: 4.5,
            goals_achieved: 8,
            total_goals: 10,
            status: 'completed',
          },
        ],
        status: 200,
      } as AxiosResponse<any[]>;
    }
  },

  createPerformanceReview: async (reviewData: any): Promise<AxiosResponse<any>> => {
    return axios.post(`${API_BASE_URL}/performance/reviews/`, reviewData, {
      headers: getAuthHeaders(),
    });
  },
};
