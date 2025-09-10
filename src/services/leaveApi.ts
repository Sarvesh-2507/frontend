import axios from 'axios';
import { User, LeaveRequest, LeaveBalance, Holiday } from '../types/leave';
import { getApiUrl } from "../config";

// API Configuration using environment variables
const API_BASE_URL = getApiUrl();
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

class ApiService {
  private setAuthHeader(token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  private getAuthHeader(): { [key: string]: string } {
    const token = localStorage.getItem('accessToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    const response = await api.get('/leave/leave-requests/', {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async createLeaveRequest(data: any, token?: string): Promise<LeaveRequest> {
    const authToken = token || localStorage.getItem('accessToken');
    if (!authToken) {
      throw new Error('Authentication token required for leave request');
    }
    
    const response = await api.post('/leave/leave-requests/', data, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    return response.data;
  }

  async getTeamRequests(): Promise<LeaveRequest[]> {
    const response = await api.get('/leave/leave-requests/my_team_requests/', {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async getPendingApprovals(): Promise<LeaveRequest[]> {
    const response = await api.get('/leave/leave-requests/pending_approvals/', {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async getHRDashboardRequests(): Promise<LeaveRequest[]> {
    const response = await api.get('/leave/leave-requests/hr_dashboard/', {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async cancelLeaveRequest(id: number): Promise<void> {
    await api.patch(`/leave/leave-requests/${id}/cancel/`, {}, {
      headers: this.getAuthHeader()
    });
  }

  async tlApprove(id: number): Promise<void> {
    await api.patch(`/leave/leave-requests/${id}/tl_approve/`, {}, {
      headers: this.getAuthHeader()
    });
  }

  async tlReject(id: number, rejection_reason: string): Promise<void> {
    await api.patch(`/leave/leave-requests/${id}/tl_reject/`, { rejection_reason }, {
      headers: this.getAuthHeader()
    });
  }

  async hrApprove(id: number): Promise<void> {
    await api.patch(`/leave/leave-requests/${id}/hr_approve/`, {}, {
      headers: this.getAuthHeader()
    });
  }

  async hrReject(id: number, rejection_reason: string): Promise<void> {
    await api.patch(`/leave/leave-requests/${id}/hr_reject/`, { rejection_reason }, {
      headers: this.getAuthHeader()
    });
  }

  async getLeaveBalances(id: number, token?: string): Promise<LeaveBalance[]> {
    const authToken = token || localStorage.getItem('accessToken');
    if (!authToken) {
      throw new Error('Authentication token required for leave balance requests');
    }
    
    const response = await api.get(`/leave/leave-balances/${id}/`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
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
