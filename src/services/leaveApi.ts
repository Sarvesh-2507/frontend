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

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    const response = await api.get('/leave/leave-requests/');
    return response.data;
  }

  async createLeaveRequest(data: any, token?: string): Promise<LeaveRequest> {
    if (!token) {
      throw new Error('Authentication token required for leave request');
    }
    this.setAuthHeader(token);
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

  async getLeaveBalances(id: number, token?: string): Promise<LeaveBalance[]> {
    // Always set the token if provided, else throw error
    if (!token) {
      throw new Error('Authentication token required for leave balance requests');
    }
    this.setAuthHeader(token);
    // Use employeeId in the endpoint as per backend spec
    const response = await api.get(`/leave/leave-balances/${id}/`);
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
