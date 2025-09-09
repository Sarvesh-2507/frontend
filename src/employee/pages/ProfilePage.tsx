
import React from 'react';
import { useEmployeeProfile } from '../components/useEmployeeProfile';

const InfoRow = ({ label, value }: { label: string; value?: string | number }) => (
	<div className="flex gap-2 text-sm mb-1">
		<span className="font-medium text-gray-700 dark:text-gray-200 min-w-[120px]">{label}:</span>
		<span className="text-gray-900 dark:text-white">{value || '-'}</span>
	</div>
);

const ProfilePage: React.FC = () => {
	const { profile, loading, error } = useEmployeeProfile();

	if (loading) return <div className="p-6">Loading profile...</div>;
	if (error) return <div className="p-6 text-red-600">{error}</div>;
	if (!profile) return <div className="p-6">No profile data found.</div>;

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Employee Profile</h1>
			<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-8">
				{/* Left: Avatar and Basic Info */}
				<div className="flex flex-col items-center md:w-1/3 w-full mb-6 md:mb-0">
					<div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold mb-3">
						{profile.first_name[0]}{profile.last_name ? profile.last_name[0] : ''}
					</div>
					<div className="text-xl font-semibold text-blue-700 dark:text-blue-200 mb-1">{profile.first_name} {profile.last_name}</div>
					<div className="text-sm text-gray-500 dark:text-gray-300 mb-1">{profile.designation}</div>
					<div className="text-sm text-gray-500 dark:text-gray-300 mb-1">{profile.work_location}</div>
					<div className="text-sm text-gray-500 dark:text-gray-300">Emp ID: {profile.emp_id}</div>
				</div>

				{/* Right: Details */}
				<div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Personal Information */}
					<div>
						<h2 className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-200">Personal Information</h2>
						<InfoRow label="Date of Birth" value={profile.date_of_birth} />
						<InfoRow label="Gender" value={profile.gender} />
						<InfoRow label="Marital Status" value={profile.marital_status} />
						<InfoRow label="Nationality" value={profile.nationality} />
						<InfoRow label="Blood Group" value={profile.blood_group} />
						<InfoRow label="Aadhar Number" value={profile.aadhar_number} />
						<InfoRow label="PAN Number" value={profile.pan_number} />
					</div>

					{/* Contact Information */}
					<div>
						<h2 className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-200">Contact Information</h2>
						<InfoRow label="Email" value={profile.email_id} />
						<InfoRow label="Phone" value={profile.phone_number} />
						<InfoRow label="Emergency Contact" value={profile.emergency_contact_number} />
						<InfoRow label="Present Address" value={profile.present_address} />
						<InfoRow label="City" value={profile.city} />
						<InfoRow label="State" value={profile.native_state || profile.state_of_domicile} />
					</div>

					{/* Work Information */}
					<div>
						<h2 className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-200">Work Information</h2>
						<InfoRow label="Department" value={profile.department_ref?.toString()} />
						<InfoRow label="Designation" value={profile.designation} />
						<InfoRow label="Employment Type" value={profile.employment_type} />
						<InfoRow label="Date of Joining" value={profile.date_of_joining} />
						<InfoRow label="Reporting Manager" value={profile.reporting_manager} />
						<InfoRow label="Organization" value={profile.organization?.toString()} />
					</div>

					{/* Education/Other */}
					<div>
						<h2 className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-200">Education & Other</h2>
						<InfoRow label="Highest Qualification" value={profile.highest_qualification} />
						<InfoRow label="College/University" value={profile.college_university_name} />
						<InfoRow label="Graduation Year" value={profile.graduation_year?.toString()} />
						<InfoRow label="Years of Experience" value={profile.years_of_experience} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
