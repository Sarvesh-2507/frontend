import axios from 'axios';
import { User, LeaveRequest, LeaveBalance, Holiday } from '../types/leave';

const API_BASE_URL = 'http://192.168.1.132:8000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const MOCK_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...';
const MOCK_USERS = {
  employee: { id: 1, username: 'john.doe', email: 'john@company.com', role: 'employee' as const, first_name: 'John', last_name: 'Doe' },
  manager: { id: 2, username: 'jane.manager', email: 'jane@company.com', role: 'manager' as const, first_name: 'Jane', last_name: 'Manager' },
  hr: { id: 3, username: 'hr.admin', email: 'hr@company.com', role: 'hr' as const, first_name: 'HR', last_name: 'Admin' }
};

class ApiService {
  private setAuthHeader(token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  mockLogin(role: 'employee' | 'manager' | 'hr'): Promise<{ user: User; token: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = MOCK_USERS[role];
        this.setAuthHeader(MOCK_TOKEN);
        resolve({ user, token: MOCK_TOKEN });
      }, 500);
    });
  }

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    const response = await api.get('/leave/leave-requests/');
    return response.data;
  }

  async createLeaveRequest(data: any): Promise<LeaveRequest> {
    const response = await api.post('/leave/leave-requests/', data);
    return response.data;
  }

  async getTeamRequests(): Promise<LeaveRequest[]> {
    const response = await api.get('/leave/leave-requests/my_team_requests/');
    return response.data;
  }

  async getPendingApprovals(): Promise<LeaveRequest[]> {
    const response = await api.get('/leave/leave-requests/pending_approvals/');
    return response.data;
  }

  async cancelLeaveRequest(id: number): Promise<void> {
    await api.patch(`/leave/leave-requests/${id}/cancel/`);
  }

  async tlApprove(id: number): Promise<void> {
    await api.patch(`/leave/leave-requests/${id}/tl_approve/`);
  }

  async tlReject(id: number, rejection_reason: string): Promise<void> {
    await api.patch(`/leave/leave-requests/${id}/tl_reject/`, { rejection_reason });
  }

  async hrApprove(id: number): Promise<void> {
    await api.patch(`/leave/leave-requests/${id}/hr_approve/`);
  }

  async hrReject(id: number, rejection_reason: string): Promise<void> {
    await api.patch(`/leave/leave-requests/${id}/hr_reject/`, { rejection_reason });
  }

  async getLeaveBalances(): Promise<LeaveBalance[]> {
    const response = await api.get('/leave-balances/');
    return response.data;
  }

  async getHolidays(): Promise<Holiday[]> {
    const response = await api.get('/holidays/');
    return response.data;
  }

  async createHoliday(holiday: Omit<Holiday, 'id'>): Promise<Holiday> {
    const response = await api.post('/holidays/', holiday);
    return response.data;
  }

  async updateHoliday(id: number, holiday: Omit<Holiday, 'id'>): Promise<Holiday> {
    const response = await api.put(`/holidays/${id}/`, holiday);
    return response.data;
  }

  async deleteHoliday(id: number): Promise<void> {
    await api.delete(`/holidays/${id}/`);
  }
}

export const apiService = new ApiService();
