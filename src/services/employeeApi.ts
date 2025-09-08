export interface EmployeeProfile {
  id: number;
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  workEmail: string;
  phone: string;
  workPhone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  country: string;
  state: string;
  city: string;
  qualification: string;
  experience: string;
  department: string;
  position: string;
  company: string;
  status: string;
  joiningDate: string;
}

export const employeeApi = {
  fetchEmployeeProfile: async (employeeId: string): Promise<EmployeeProfile> => {
    try {
      const response = await fetch(`http://192.168.1.132:8000/api/employees/${employeeId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee profile');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching employee profile:', error);
      throw error;
    }
  },
  
  // Add other employee-related API endpoints here
};
