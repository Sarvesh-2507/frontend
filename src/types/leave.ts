// Leave management types and interfaces
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'employee' | 'manager' | 'hr';
  first_name: string;
  last_name: string;
}

export interface LeaveRequest {
  id: number;
  employee: string;
  employee_name: string;
  leave_type: 'Sick Leave' | 'Casual Leave' | 'Compensatory Off';
  start_date: string;
  end_date: string;
  half_day_session: 'FULL_DAY' | 'FIRST_HALF' | 'SECOND_HALF';
  reason: string;
  attachment?: string;
  status: 'Pending' | 'Team Lead Approved' | 'Approved' | 'Rejected' | 'Cancelled';
  total_days: number;
  created_at: string;
  rejection_reason?: string;
  action_logs: ActionLog[];
}

export interface ActionLog {
  id: number;
  action: string;
  performed_by: string;
  timestamp: string;
  comments?: string;
}

export interface LeaveBalance {
  leave_type: string;
  used: number;
  total: number;
  remaining: number;
}

export interface Holiday {
  id: number;
  name: string;
  date: string;
  is_regional: boolean;
}

export interface ApiError {
  message: string;
  status: number;
}
