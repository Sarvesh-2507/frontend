import axios, { AxiosResponse } from "axios";
import {
  Company,
  CreateCompanyData,
  CreateOrganizationData,
  Domain,
  Organization,
} from "../types/organization";

// Use dynamic base URL that adapts to the deployment environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' // In production, assume API is on the same domain
  : process.env.REACT_APP_API_URL || window.location.origin + '/api'; // In development, use env var or same domain

console.log("Organizations API base URL:", API_BASE_URL);

// Create axios instance with auth headers
const createAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// Department and Role types
export interface Department {
  id: string | number;
  name: string;
  head?: string;
  employeeCount?: number;
  budget?: number;
}

export interface Role {
  id: string | number;
  name: string;
  description?: string;
  permissions?: string[];
}

export interface Employee {
  id: string | number;
  name: string;
  email: string;
  designation: string;
  department: string;
  role: string;
}

// Test function for debugging organizations API
export const testOrganizationsAPI = async () => {
  console.log("🧪 Testing Organizations API...");

  try {
    const response = await organizationAPI.getPublicOrganizations();
    console.log("✅ Organizations API Test - Success!");
    console.log("📊 Organizations data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Organizations API Test - Failed:", error);
    return null;
  }
};

// Make test function available globally for browser console testing
(window as any).testOrganizationsAPI = testOrganizationsAPI;

export const organizationAPI = {

  // Organizations - Public endpoint for registration (fallback to mock data if auth required)
  getPublicOrganizations: async (): Promise<AxiosResponse<Organization[]>> => {
    const url = `${API_BASE_URL}/organizations/`;
    console.log("🏢 API - Fetching public organizations from:", url);

    try {
      // First try without authentication for public access
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 15000,
        withCredentials: false,
      });

      console.log(
        "✅ API - Public organizations response:",
        response.status,
        response.data
      );
      return response;
    } catch (error: any) {
      console.error(
        "❌ API - Public organizations fetch error:",
        error.message
      );

      // If authentication is required, try to fetch with any available token
      if (error.response && error.response.status === 401) {
        console.log("🔄 API - Auth required, trying with available token...");

        try {
          // Try to get token from localStorage (if user was previously logged in)
          const token =
            localStorage.getItem("accessToken") ||
            localStorage.getItem("authToken") ||
            JSON.parse(localStorage.getItem("currentUser") || "{}")
              .access_token;

          if (token) {
            console.log("🔑 API - Found token, retrying with authentication");
            const authResponse = await axios.get(url, {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
              timeout: 15000,
              withCredentials: false,
            });

            console.log(
              "✅ API - Authenticated organizations response:",
              authResponse.status,
              authResponse.data
            );
            return authResponse;
          }
        } catch (authError: any) {
          console.error(
            "❌ API - Authenticated request also failed:",
            authError.message
          );
        }

        // Return comprehensive mock data for registration since API endpoint doesn't exist yet
        console.log(
          "🔄 API - Organizations endpoint not found, returning mock data for registration"
        );
        console.log(
          "💡 Note: You need to create the organizations API endpoint in your Django backend"
        );

        const mockOrganizations: Organization[] = [
          {
            id: 1,
            company_name: "MH Technologies",
            name: "MH Technologies",
            description: "Leading technology solutions provider",
            location: "New York, USA",
            industry_type: "Technology",
            employee_count: 150,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            company_name: "Global Solutions Inc",
            name: "Global Solutions Inc",
            description: "Comprehensive business solutions worldwide",
            location: "London, UK",
            industry_type: "Business Services",
            employee_count: 250,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 3,
            company_name: "Innovation Labs",
            name: "Innovation Labs",
            description: "Research and development company",
            location: "San Francisco, USA",
            industry_type: "Research & Development",
            employee_count: 75,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 4,
            company_name: "Digital Dynamics",
            name: "Digital Dynamics",
            description: "Digital transformation specialists",
            location: "Toronto, Canada",
            industry_type: "Digital Services",
            employee_count: 120,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 5,
            company_name: "Future Enterprises",
            name: "Future Enterprises",
            description: "Next-generation business solutions",
            location: "Sydney, Australia",
            industry_type: "Technology",
            employee_count: 200,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 6,
            company_name: "Smart Systems Ltd",
            name: "Smart Systems Ltd",
            description: "Intelligent automation systems",
            location: "Berlin, Germany",
            industry_type: "Automation",
            employee_count: 90,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 7,
            company_name: "NextGen Corporation",
            name: "NextGen Corporation",
            description: "Future-focused technology company",
            location: "Tokyo, Japan",
            industry_type: "Technology",
            employee_count: 300,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 8,
            company_name: "Quantum Industries",
            name: "Quantum Industries",
            description: "Advanced quantum computing solutions",
            location: "Singapore",
            industry_type: "Quantum Computing",
            employee_count: 45,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];

        return {
          data: mockOrganizations,
          status: 200,
          statusText: "OK",
          headers: {},
          config: {},
          request: {},
        } as AxiosResponse<Organization[]>;
      }

      console.error("❌ API - Request URL:", url);
      if (error.response) {
        console.error(
          "❌ API - Error response:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("❌ API - No response received:", error.request);
      } else {
        console.error("❌ API - Request setup error:", error.message);
      }

      throw error;
    }
  },

  // Organizations - Authenticated endpoint for dashboard
  getOrganizations: async (): Promise<AxiosResponse<Organization[]>> => {
    const url = `${API_BASE_URL}/organizations/`;
    console.log("🏢 API - Fetching organizations from:", url);

    try {
      const authHeaders = createAuthHeaders();
      console.log("Using auth headers:", authHeaders);
      
      const response = await axios.get(url, {
        headers: authHeaders,
        timeout: 15000, // 15 second timeout
        withCredentials: false, // Handle CORS
      });

      console.log(
        "✅ API - Organizations response:",
        response.status,
        response.data
      );
      return response;
    } catch (error: any) {
      console.error("❌ API - Organizations fetch error:", error.message);
      console.error("❌ API - Request URL:", url);

      if (error.response) {
        console.error(
          "❌ API - Error response:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("❌ API - No response received:", error.request);
      } else {
        console.error("❌ API - Request setup error:", error.message);
      }
          "❌ API - Error response:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("❌ API - No response received:", error.request);
      } else {
        console.error("❌ API - Request setup error:", error.message);
      }

      throw error;
    }
  },

  getOrganization: async (id: number): Promise<AxiosResponse<Organization>> => {
    return axios.get(`${API_BASE_URL}/organization/${id}/`, {
      headers: createAuthHeaders(),
    });
  },

  createOrganization: async (
    data: CreateOrganizationData
  ): Promise<AxiosResponse<Organization>> => {
    const url = `http://192.168.1.132:8000/api/organizations/create/`;
    console.log("🏢 API - Creating organization at:", url);
    console.log("📝 API - Organization data:", data);

    try {
      const response = await axios.post(url, data, {
        headers: createAuthHeaders(),
        timeout: 15000,
        withCredentials: false,
      });

      console.log(
        "✅ API - Organization created successfully:",
        response.status,
        response.data
      );
      return response;
    } catch (error: any) {
      console.error("❌ API - Organization creation failed:", error.message);
      console.error("❌ API - Request URL:", url);
      console.error("❌ API - Request data:", data);

      if (error.response) {
        console.error(
          "❌ API - Error response:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("❌ API - No response received:", error.request);
      } else {
        console.error("❌ API - Request setup error:", error.message);
      }

      throw error;
    }
  },

  // Companies
  getOrganizationCompanies: async (
    orgId: number
  ): Promise<AxiosResponse<Company[]>> => {
    return axios.get(`${API_BASE_URL}/organization/${orgId}/company/`, {
      headers: createAuthHeaders(),
    });
  },

  getCompany: async (
    orgId: number,
    companyCode: string
  ): Promise<AxiosResponse<Company>> => {
    return axios.get(
      `${API_BASE_URL}/organization/${orgId}/company/${companyCode}/`,
      {
        headers: createAuthHeaders(),
      }
    );
  },

  createCompany: async (
    orgId: number,
    data: CreateCompanyData
  ): Promise<AxiosResponse<Company>> => {
    return axios.post(
      `${API_BASE_URL}/organization/${orgId}/add_company/`,
      data,
      {
        headers: createAuthHeaders(),
      }
    );
  },

  // Domains
  getCompanyDomains: async (
    orgId: number,
    companyCode: string
  ): Promise<AxiosResponse<Domain[]>> => {
    return axios.get(
      `${API_BASE_URL}/organization/${orgId}/company/${companyCode}/domains/`,
      {
        headers: createAuthHeaders(),
      }
    );
  },

  getDomain: async (
    orgId: number,
    companyCode: string,
    domainCode: string
  ): Promise<AxiosResponse<Domain>> => {
    return axios.get(
      `${API_BASE_URL}/organization/${orgId}/company/${companyCode}/domain/${domainCode}/`,
      {
        headers: createAuthHeaders(),
      }
    );
  },

  // Departments - Public endpoint for registration (using mock data since API doesn't exist)
  getPublicDepartments: async (): Promise<AxiosResponse<Department[]>> => {
    console.log(
      "🏢 API - Departments endpoint not available, returning mock data"
    );
    console.log(
      "💡 Note: You need to create the departments API endpoint in your Django backend"
    );

    // Return comprehensive mock departments for registration
    const mockDepartments: Department[] = [
      { id: 1, name: "Engineering", head: "Tech Lead", employeeCount: 25 },
      { id: 2, name: "Human Resources", head: "HR Manager", employeeCount: 8 },
      {
        id: 3,
        name: "Marketing",
        head: "Marketing Director",
        employeeCount: 12,
      },
      { id: 4, name: "Sales", head: "Sales Manager", employeeCount: 18 },
      { id: 5, name: "Finance", head: "Finance Manager", employeeCount: 6 },
      {
        id: 6,
        name: "Operations",
        head: "Operations Manager",
        employeeCount: 15,
      },
      {
        id: 7,
        name: "Customer Support",
        head: "Support Lead",
        employeeCount: 10,
      },
      {
        id: 8,
        name: "Product Management",
        head: "Product Manager",
        employeeCount: 7,
      },
      { id: 9, name: "Quality Assurance", head: "QA Lead", employeeCount: 9 },
      {
        id: 10,
        name: "Research & Development",
        head: "R&D Director",
        employeeCount: 14,
      },
    ];

    return {
      data: mockDepartments,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
      request: {},
    } as AxiosResponse<Department[]>;
  },

  // Roles - Public endpoint for registration (using mock data since API doesn't exist)
  getPublicRoles: async (): Promise<AxiosResponse<Role[]>> => {
    console.log("🏢 API - Roles endpoint not available, returning mock data");
    console.log(
      "💡 Note: You need to create the roles API endpoint in your Django backend"
    );

    // Return comprehensive mock roles for registration
    const mockRoles: Role[] = [
      {
        id: 1,
        name: "Admin",
        description: "System Administrator with full access",
      },
      { id: 2, name: "HR Manager", description: "Human Resources Manager" },
      {
        id: 3,
        name: "HR Specialist",
        description: "Human Resources Specialist",
      },
      { id: 4, name: "Employee", description: "Regular Employee" },
      { id: 5, name: "Team Lead", description: "Team Leader" },
      { id: 6, name: "Manager", description: "Department Manager" },
      {
        id: 7,
        name: "Senior Manager",
        description: "Senior Department Manager",
      },
      { id: 8, name: "Director", description: "Department Director" },
      {
        id: 9,
        name: "Senior Developer",
        description: "Senior Software Developer",
      },
      {
        id: 10,
        name: "Junior Developer",
        description: "Junior Software Developer",
      },
      {
        id: 11,
        name: "Product Manager",
        description: "Product Management Role",
      },
      {
        id: 12,
        name: "Sales Representative",
        description: "Sales Team Member",
      },
      {
        id: 13,
        name: "Marketing Specialist",
        description: "Marketing Team Member",
      },
      {
        id: 14,
        name: "Customer Support",
        description: "Customer Support Representative",
      },
      { id: 15, name: "Intern", description: "Internship Position" },
    ];

    return {
      data: mockRoles,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
      request: {},
    } as AxiosResponse<Role[]>;
  },



  // Update organization
  updateOrganization: async (id: string, organizationData: Partial<Organization>): Promise<AxiosResponse<Organization>> => {
    const url = `${API_BASE_URL}/organizations/${id}/`;
    console.log("🏢 API - Updating organization:", id, organizationData);

    try {
      const response = await axios.put(url, organizationData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      console.log("✅ API - Organization updated:", response.data);
      return response;
    } catch (error: any) {
      console.error("❌ API - Organization update error:", error.message);
      throw error;
    }
  },

  // Delete organization
  deleteOrganization: async (id: string): Promise<AxiosResponse<void>> => {
    const url = `${API_BASE_URL}/organizations/${id}/`;
    console.log("🏢 API - Deleting organization:", id);

    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      console.log("✅ API - Organization deleted");
      return response;
    } catch (error: any) {
      console.error("❌ API - Organization deletion error:", error.message);
      throw error;
    }
  },

  // Get organization by ID
  getOrganizationById: async (id: string): Promise<AxiosResponse<Organization>> => {
    const url = `${API_BASE_URL}/organizations/${id}/`;
    console.log("🏢 API - Fetching organization by ID:", id);

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      console.log("✅ API - Organization fetched:", response.data);
      return response;
    } catch (error: any) {
      console.error("❌ API - Organization fetch error:", error.message);
      throw error;
    }
  },

  // Get potential reporting managers (employees who can be managers)
  getPublicReportingManagers: async (): Promise<{ data: Employee[] }> => {
    console.log(
      "🔄 API - Fetching potential reporting managers (public endpoint)"
    );
    console.log(
      "💡 Note: You need to create the reporting managers API endpoint in your Django backend"
    );

    // Return mock reporting managers for registration
    const mockManagers: Employee[] = [
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        designation: "Engineering Manager",
        department: "Engineering",
        role: "Manager",
      },
      {
        id: 2,
        name: "Mike Chen",
        email: "mike.chen@company.com",
        designation: "HR Director",
        department: "Human Resources",
        role: "Director",
      },
      {
        id: 3,
        name: "Emily Davis",
        email: "emily.davis@company.com",
        designation: "Marketing Manager",
        department: "Marketing",
        role: "Manager",
      },
      {
        id: 4,
        name: "Alex Rodriguez",
        email: "alex.rodriguez@company.com",
        designation: "Sales Director",
        department: "Sales",
        role: "Director",
      },
      {
        id: 5,
        name: "Jessica Wilson",
        email: "jessica.wilson@company.com",
        designation: "Finance Manager",
        department: "Finance",
        role: "Manager",
      },
      {
        id: 6,
        name: "David Brown",
        email: "david.brown@company.com",
        designation: "Operations Manager",
        department: "Operations",
        role: "Manager",
      },
      {
        id: 7,
        name: "Lisa Anderson",
        email: "lisa.anderson@company.com",
        designation: "Product Manager",
        department: "Product Management",
        role: "Manager",
      },
      {
        id: 8,
        name: "Robert Taylor",
        email: "robert.taylor@company.com",
        designation: "QA Lead",
        department: "Quality Assurance",
        role: "Team Lead",
      },
      {
        id: 9,
        name: "Maria Garcia",
        email: "maria.garcia@company.com",
        designation: "R&D Director",
        department: "Research & Development",
        role: "Director",
      },
      {
        id: 10,
        name: "James Miller",
        email: "james.miller@company.com",
        designation: "Support Manager",
        department: "Customer Support",
        role: "Manager",
      },
    ];

    return {
      data: mockManagers,
      message: "Reporting managers fetched successfully",
      success: true,
    };
  },
};

export default organizationAPI;
