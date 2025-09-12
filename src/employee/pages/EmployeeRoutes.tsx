import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeHomePage from './EmployeeHomePage';
import AttendancePage from './AttendancePage';
import LeavePage from './LeavePage';
import PayrollPage from './PayrollPage';
import ProfilePage from './ProfilePage';
import PoliciesPage from './PoliciesPage';
import NotFoundPage from './NotFoundPage';
import EmployeeLayout from '../layout/EmployeeLayout';
import EmployeeInboxPage from './EmployeeInboxPage';
import EmployeeHelpDeskPage from './EmployeeHelpDeskPage';
import EmployeeSettingsPage from './EmployeeSettingsPage';
import EmployeeAnnouncementsPage from './EmployeeAnnouncementsPage';



const EmployeeRoutes: React.FC = () => (
	<Routes>
		<Route element={<EmployeeLayout />}>
			<Route index element={<EmployeeHomePage />} />
			<Route path="attendance" element={<AttendancePage />} />
			<Route path="leave" element={<LeavePage />} />
			<Route path="payroll" element={<PayrollPage />} />
			<Route path="profile" element={<ProfilePage />} />
			<Route path="policies" element={<PoliciesPage />} />
			<Route path="inbox" element={<EmployeeInboxPage />} />
			<Route path="help-desk" element={<EmployeeHelpDeskPage />} />
			<Route path="settings" element={<EmployeeSettingsPage />} />
			<Route path="announcements" element={<EmployeeAnnouncementsPage />} />
			<Route path="*" element={<NotFoundPage />} />
		</Route>
	</Routes>
);

export default EmployeeRoutes;
