export interface Organization {
  id: number;
  company_name: string;
  name?: string; // Alternative name field
  description?: string;
  location?: string;
  industry_type?: string;
  employee_count?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  company_code: string;
  name: string;
  description?: string;
  organization: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Domain {
  id: number;
  domain_code: string;
  name: string;
  description?: string;
  company: string;
  organization: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CreateOrganizationData {
  company_name: string;
  name?: string;
  description?: string;
  location?: string;
  industry_type?: string;
  employee_count?: number;
}

export interface CreateCompanyData {
  company_code: string;
  name: string;
  description?: string;
}

export interface CreateDomainData {
  domain_code: string;
  name: string;
  description?: string;
}
