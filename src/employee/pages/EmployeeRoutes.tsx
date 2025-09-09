import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeHomePage from './EmployeeHomePage';
import AttendancePage from './AttendancePage';
import LeavePage from './LeavePage';
import PayrollPage from './PayrollPage';
import ProfilePage from './ProfilePage';
import PoliciesPage from './PoliciesPage';
import NotFoundPage from './NotFoundPage';


const EmployeeRoutes: React.FC = () => (
	<Routes>
		<Route path="" element={<EmployeeHomePage />} />
		<Route path="attendance" element={<AttendancePage />} />
		<Route path="leave" element={<LeavePage />} />
		<Route path="payroll" element={<PayrollPage />} />
		<Route path="profile" element={<ProfilePage />} />
		<Route path="policies" element={<PoliciesPage />} />
		<Route path="*" element={<NotFoundPage />} />
	</Routes>
);

export default EmployeeRoutes;
