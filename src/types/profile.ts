// Profile API Types based on the API structure provided

export interface CandidateFormData {
  id?: number;
  how_did_you_know_of_this_position?: string;
  are_you_engaged_in_any_business: boolean;
  business_details?: string;
  any_bond_with_previous_employer: boolean;
  bond_details?: string;
  has_criminal_record: boolean;
  criminal_record_details?: string;
  notice_period_days?: number;
  willing_to_relocate: boolean;
  willing_to_travel: boolean;
  expected_ctc?: string;
  preferred_job_location?: string;
  significant_achievements?: string;
  suitability_for_position?: string;
}

export interface FamilyMember {
  id?: number;
  name: string;
  relationship: string;
  date_of_birth: string;
  gender?: string;
  qualification: string;
  occupation: string;
  organization?: string;
}

export interface LanguageKnown {
  id?: number;
  language: string;
  can_read: boolean;
  can_write: boolean;
  can_speak: boolean;
}

export interface EducationDetail {
  id?: number;
  exam_passed: string;
  specialization?: string;
  institution: string;
  university_board: string;
  study_mode?: string;
  duration_years?: string;
  month_year_of_passing: string;
  grade_or_percentage: string;
  distinctions?: string;
}

export interface WorkExperience {
  id?: number;
  employer_name: string;
  duration: string;
  designation: string;
  duties?: string;
  from_date: string;
  to_date: string;
  superior_name?: string;
  superior_designation?: string;
  salary_at_join?: string;
  lastdrawn_salary?: string;
  emolument_basic?: string;
  emolument_fixed?: string;
  emolument_variable?: string;
  emolument_gross?: string;
}

export interface Nominee {
  id?: number;
  name: string;
  relationship: string;
  date_of_birth: string;
  share_percentage: string;
  address: string;
}

export interface DocumentSubmission {
  id?: number;
  document_type: string;
  document_number?: string;
  issue_date?: string;
  valid_upto?: string;
  remarks?: string;
}

export interface Declaration {
  id?: number;
  declaration_type: 'not_connected' | 'relative';
  relation?: string;
  director_name?: string;
  date_signed?: string;
  signature?: string;
}

export interface HobbyInterest {
  id?: number;
  hobby_name: string;
}

export interface PreviousCareerRoleDetails {
  id?: number;
  description: string;
  total_persons_under?: number;
}

export interface PreviousInterview {
  id?: number;
  was_interviewed: boolean;
  date_or_year?: string;
  position?: string;
  company?: string;
}

export interface RelativeInCompany {
  id?: number;
  name: string;
  relationship: string;
  designation?: string;
  company?: string;
  phone_number?: string;
}

export interface BackgroundCheck {
  id?: number;
  police_verification_done: boolean;
  verification_details?: string;
}

export interface Profile {
  emp_id?: string;
  candidateformdata?: CandidateFormData;
  family_members?: FamilyMember[];
  languages_known?: LanguageKnown[];
  education_details?: EducationDetail[];
  work_experiences?: WorkExperience[];
  nominees?: Nominee[];
  documents_submitted?: DocumentSubmission[];
  declarations?: Declaration[];
  hobbies?: HobbyInterest[];
  previous_career_role_details?: PreviousCareerRoleDetails;
  previous_interviews?: PreviousInterview[];
  relatives_in_company?: RelativeInCompany[];
  background_checks?: BackgroundCheck[];
  status?: 'pending' | 'submitted' | 'approved';
  
  // Personal Information
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender?: 'M' | 'F' | 'O' | 'N';
  date_of_birth: string;
  birth_place?: string;
  age?: number;
  nationality?: string;
  religion?: string;
  native_state?: string;
  state_of_domicile?: string;
  marital_status: string;
  marriage_date?: string;
  passport_photo?: string;
  
  // Contact Information
  email_id: string;
  country_code?: string;
  phone_number: string;
  emergency_contact_number: string;
  emergency_contact_relationship?: string;
  
  // Address Information
  present_address: string;
  present_address_pin_code: string;
  permanent_address?: string;
  permanent_address_pin_code?: string;
  city: string;
  
  // Identity Information
  aadhar_number: string;
  pan_number: string;
  passport_number?: string;
  passport_issue_date?: string;
  passport_valid_upto?: string;
  passport_country_of_issue?: string;
  valid_visa_details?: string;
  
  // Physical Information
  height_cm?: string;
  weight_kg?: string;
  blood_group?: string;
  eyesight_right?: string;
  eyesight_left?: string;
  physical_disability?: string;
  identification_marks?: string;
  
  // Work Information
  designation: string;
  date_of_joining: string;
  work_location: string;
  employment_type: string;
  previous_company_name?: string;
  years_of_experience?: string;
  highest_qualification: string;
  college_university_name: string;
  graduation_year?: number;
  is_reporting_manager?: boolean;
  probation_period_months?: number;
  confirmation_date?: string;
  
  // Additional Work Information Fields
  department?: string;
  location?: string;
  division?: string;
  salary?: number;
  total_experience?: string;
  grade?: string;
  sub_department?: string;
  office_location?: string;
  job_status?: string;
  hire_date?: string;
  termination_date?: string;
  cost_center?: string;
  notice_period_days?: number;
  increment_month?: string;
  previous_company_designation?: string;
  previous_experience_years?: number;
  previous_company_salary?: number;
  graduation_college?: string;
  graduation_university?: string;
  graduation_percentage?: number;
  post_graduation_year?: number;
  post_graduation_college?: string;
  post_graduation_university?: string;
  post_graduation_percentage?: number;
  twelfth_year?: number;
  twelfth_school?: string;
  twelfth_board?: string;
  twelfth_percentage?: number;
  tenth_year?: number;
  tenth_school?: string;
  tenth_board?: string;
  tenth_percentage?: number;
  
  // System Information
  created_at?: string;
  updated_at?: string;
  user?: number;
  organization?: number;
  reporting_manager?: string;
  department_ref?: number;
}

export interface ProfileApiResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Profile[];
}
