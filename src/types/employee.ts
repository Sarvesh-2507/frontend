export interface EmployeeProfile {
  emp_id: string;
  first_name: string;
  last_name: string;
  designation: string;
  department_ref: number;
  reporting_manager: string | null;
  employment_type: string;
  email_id: string;
  phone_number: string;
  // Add other fields as needed
}

export interface EmployeeListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EmployeeProfile[];
}
