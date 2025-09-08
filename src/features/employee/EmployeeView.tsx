import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Briefcase, GraduationCap, Users, Languages, FileText, Shield, Heart } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

interface BackgroundCheck {
  id: number;
  police_verification_done: boolean;
  verification_details?: string;
}

interface Declaration {
  id: number;
  declaration_type: string;
  relation?: string;
  director_name?: string;
  date_signed?: string;
  signature?: string;
}

interface DocumentSubmission {
  id: number;
  document_type: string;
  document_number?: string;
  issue_date?: string;
  valid_upto?: string;
  remarks?: string;
}

interface HobbyInterest {
  id: number;
  hobby_name: string;
}

interface Nominee {
  id: number;
  name: string;
  relationship: string;
  date_of_birth: string;
  share_percentage: string;
  address: string;
}

interface PreviousCareerRoleDetails {
  id: number;
  description: string;
  total_persons_under?: number;
}

interface PreviousInterview {
  id: number;
  was_interviewed: boolean;
  date_or_year?: string;
  position?: string;
  company?: string;
}

interface RelativeInCompany {
  id: number;
  name: string;
  relationship: string;
  designation?: string;
  company?: string;
  phone_number?: string;
}

interface FamilyMember {
  id: number;
  name: string;
  relationship: string;
  date_of_birth: string;
  gender?: string;
  qualification: string;
  occupation: string;
  organization?: string;
}

interface LanguageKnown {
  id: number;
  language: string;
  can_read: boolean;
  can_write: boolean;
  can_speak: boolean;
}

interface EducationDetail {
  id: number;
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

interface WorkExperience {
  id: number;
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

interface EmployeeDetail {
  emp_id: string;
  background_checks: BackgroundCheck[];
  declarations: Declaration[];
  documents_submitted: DocumentSubmission[];
  hobbies: HobbyInterest[];
  nominees: Nominee[];
  previous_career_role_details?: PreviousCareerRoleDetails;
  previous_interviews: PreviousInterview[];
  relatives_in_company: RelativeInCompany[];
  family_members: FamilyMember[];
  languages_known: LanguageKnown[];
  education_details: EducationDetail[];
  work_experiences: WorkExperience[];
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender?: string;
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
  email_id: string;
  country_code: string;
  phone_number: string;
  emergency_contact_number: string;
  emergency_contact_relationship?: string;
  present_address: string;
  present_address_pin_code: string;
  permanent_address?: string;
  permanent_address_pin_code?: string;
  city: string;
  aadhar_number: string;
  pan_number: string;
  passport_number?: string;
  passport_issue_date?: string;
  passport_valid_upto?: string;
  passport_country_of_issue?: string;
  valid_visa_details?: string;
  height_cm?: string;
  weight_kg?: string;
  blood_group?: string;
  eyesight_right?: string;
  eyesight_left?: string;
  physical_disability?: string;
  identification_marks?: string;
  designation: string;
  date_of_joining: string;
  work_location: string;
  employment_type: string;
  previous_company_name?: string;
  years_of_experience?: string;
  highest_qualification: string;
  college_university_name: string;
  graduation_year?: number;
  is_reporting_manager: boolean;
  probation_period_months?: number;
  confirmation_date?: string;
  reporting_manager?: string;
  department_ref?: number;
  form_status?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  last_saved?: string;
  user?: number;
  organization?: number;
}

const EmployeeView: React.FC = () => {
  const { empId } = useParams<{ empId: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://192.168.1.132:8000/api/profiles/profiles/${empId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch employee details');
        }
        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        setError('Failed to load employee details');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (empId) {
      fetchEmployeeDetails();
    }
  }, [empId]);

  const content = (
    <div className="p-6">
      {/* Header with Back Button */}
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate('/employee/directory')}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Directory
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Employee Profile: {employee?.first_name} {employee?.last_name}
        </h1>
      </div>

      {/* Profile Photo */}
      {employee?.passport_photo && (
        <div className="mb-6 flex justify-center">
          <img
            src={employee.passport_photo}
            alt="Employee Photo"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
          />
        </div>
      )}

      {/* Basic Information */}
      <section className="mb-8">
        <div className="flex items-center mb-4">
          <User className="w-6 h-6 mr-2 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Basic Information</h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Employee ID</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.emp_id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Full Name</label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {`${employee?.first_name} ${employee?.middle_name || ''} ${employee?.last_name}`}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Gender</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.gender || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Date of Birth</label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {employee?.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Age</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.age || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Birth Place</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.birth_place || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Nationality</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.nationality || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Religion</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.religion || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Marital Status</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.marital_status}</p>
            </div>
            {employee?.marriage_date && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Marriage Date</label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {new Date(employee.marriage_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="mb-8">
        <div className="flex items-center mb-4">
          <FileText className="w-6 h-6 mr-2 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Contact Information</h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Email</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.email_id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Phone</label>
              <p className="mt-1 text-gray-900 dark:text-white">{`${employee?.country_code} ${employee?.phone_number}`}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Emergency Contact</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.emergency_contact_number}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Emergency Contact Relationship</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.emergency_contact_relationship || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Present Address</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.present_address}, {employee?.city} - {employee?.present_address_pin_code}</p>
            </div>
            {employee?.permanent_address && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Permanent Address</label>
                <p className="mt-1 text-gray-900 dark:text-white">{employee.permanent_address} - {employee?.permanent_address_pin_code}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Work Information */}
      <section className="mb-8">
        <div className="flex items-center mb-4">
          <Briefcase className="w-6 h-6 mr-2 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Work Information</h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Designation</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.designation}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Department</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.department_ref || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Employment Type</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.employment_type}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Work Location</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.work_location}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Date of Joining</label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {employee?.date_of_joining ? new Date(employee.date_of_joining).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Reporting Manager</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.reporting_manager || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Years of Experience</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.years_of_experience || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Previous Company</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.previous_company_name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Is Reporting Manager</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.is_reporting_manager ? 'Yes' : 'No'}</p>
            </div>
            {employee?.probation_period_months && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Probation Period (Months)</label>
                <p className="mt-1 text-gray-900 dark:text-white">{employee.probation_period_months}</p>
              </div>
            )}
            {employee?.confirmation_date && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Confirmation Date</label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {new Date(employee.confirmation_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Education Details */}
      <section className="mb-8">
        <div className="flex items-center mb-4">
          <GraduationCap className="w-6 h-6 mr-2 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Education Details</h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Highest Qualification</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.highest_qualification}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">College/University</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.college_university_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Graduation Year</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.graduation_year || 'N/A'}</p>
            </div>
          </div>
          
          {employee?.education_details && employee.education_details.length > 0 && (
            <div className="overflow-x-auto">
              <h4 className="text-lg font-medium mb-4">Education History</h4>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam/Degree</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University/Board</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year of Passing</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade/Percentage</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {employee.education_details.map((edu) => (
                    <tr key={edu.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{edu.exam_passed}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{edu.specialization || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{edu.institution}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{edu.university_board}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{edu.month_year_of_passing}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{edu.grade_or_percentage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Work Experience */}
      {employee?.work_experiences && employee.work_experiences.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center mb-4">
            <Briefcase className="w-6 h-6 mr-2 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Work Experience</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Drawn Salary</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {employee.work_experiences.map((exp) => (
                    <tr key={exp.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{exp.employer_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{exp.designation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{exp.duration}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {`${new Date(exp.from_date).toLocaleDateString()} - ${new Date(exp.to_date).toLocaleDateString()}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{exp.lastdrawn_salary || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Family Members */}
      {employee?.family_members && employee.family_members.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Family Members</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relationship</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {employee.family_members.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{member.relationship}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(member.date_of_birth).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{member.occupation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{member.organization || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Languages Known */}
      {employee?.languages_known && employee.languages_known.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center mb-4">
            <Languages className="w-6 h-6 mr-2 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Languages Known</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Can Read</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Can Write</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Can Speak</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {employee.languages_known.map((lang) => (
                    <tr key={lang.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{lang.language}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{lang.can_read ? 'Yes' : 'No'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{lang.can_write ? 'Yes' : 'No'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{lang.can_speak ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Identity Documents */}
      <section className="mb-8">
        <div className="flex items-center mb-4">
          <Shield className="w-6 h-6 mr-2 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Identity Documents</h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Aadhar Number</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.aadhar_number}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">PAN Number</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.pan_number}</p>
            </div>
            {employee?.passport_number && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Passport Number</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{employee.passport_number}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Passport Issue Date</label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {employee?.passport_issue_date ? new Date(employee.passport_issue_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Passport Valid Until</label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {employee?.passport_valid_upto ? new Date(employee.passport_valid_upto).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Country of Issue</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{employee?.passport_country_of_issue || 'N/A'}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Physical Details */}
      <section className="mb-8">
        <div className="flex items-center mb-4">
          <Heart className="w-6 h-6 mr-2 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Physical Details</h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Height (cm)</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.height_cm || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Weight (kg)</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.weight_kg || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Blood Group</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.blood_group || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Eyesight (Right)</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.eyesight_right || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Eyesight (Left)</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.eyesight_left || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Physical Disability</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.physical_disability || 'None'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Identification Marks</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.identification_marks || 'N/A'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hobbies & Interests */}
      {employee?.hobbies && employee.hobbies.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center mb-4">
            <Heart className="w-6 h-6 mr-2 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Hobbies & Interests</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex flex-wrap gap-2">
              {employee.hobbies.map((hobby) => (
                <span key={hobby.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {hobby.hobby_name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Status Information */}
      <section className="mb-8">
        <div className="flex items-center mb-4">
          <FileText className="w-6 h-6 mr-2 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Status Information</h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Form Status</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.form_status || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Status</label>
              <p className="mt-1 text-gray-900 dark:text-white">{employee?.status || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Last Updated</label>
              <p className="mt-1 text-gray-900 dark:text-white">
                {employee?.last_saved ? new Date(employee.last_saved).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg text-gray-700">Loading employee details...</span>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex h-screen">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error || 'Employee not found'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className="flex-1 overflow-auto">
        {content}
      </div>
    </div>
  );
};

export default EmployeeView;
