
import React, { useEffect, useState } from 'react';
import BaseLayout from '../layout/BaseLayout';
import EmployeeSidebar from '../components/EmployeeSidebar';
import { motion } from 'framer-motion';


import ProfileProgressBar from '../../components/ui/ProfileProgressBar';
import RecentAnnouncements from '../../components/RecentAnnouncements';
import ScheduleComponent from '../../components/ScheduleComponent';
import LeaveBalanceWidget from '../../components/LeaveBalanceWidget';
import YesterdayAttendanceWidget from '../../components/YesterdayAttendanceWidget';
import HighlightsWidget from '../../components/HighlightsWidget';
import UpcomingHolidaysWidget from '../../components/UpcomingHolidaysWidget';
import EmployeeTasksWidget from '../../components/EmployeeTasksWidget';
import QuickActionsEmployee from '../../components/QuickActionsEmployee';
import CompanyFeeds from '../../components/CompanyFeeds';
import GlobalSearchHeader from '../../components/GlobalSearchHeader';
import Logo from '../../components/ui/Logo';

const EmployeeHomePage: React.FC = () => {
  // Mock profile details and completion
  const [profileDetails, setProfileDetails] = useState<any>({});
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const profileCompletion = 65; // TODO: Replace with real logic

  useEffect(() => {
    // Fetch employee profile (mocked for now)
    setProfileDetails({ first_name: 'Employee', last_name: '' });
    setProfilePic(null);
  }, []);

  // Get current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return now.toLocaleDateString('en-US', options);
  };

  // Mock last punch data
  const lastPunchTime = '09:15 AM';

  return (
    <BaseLayout>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <EmployeeSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container-responsive py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-3 lg:p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-2"
            >
              <div className="scale-90 sm:scale-95 lg:scale-100">
                <GlobalSearchHeader onNavigate={() => {}} />
              </div>
            </motion.div>
            {/* Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.005, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)' }}
              className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 rounded-xl p-2 sm:p-3 lg:p-4 text-white relative overflow-hidden cursor-pointer w-full md:w-full"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
              />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 space-y-4 sm:space-y-0 w-full">
                <div className="w-full max-w-md">
                  <ProfileProgressBar percent={profileCompletion} />
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-lg font-bold mb-1"
                  >
                    {profileDetails && (profileDetails.first_name || profileDetails.last_name)
                      ? `Welcome ${((profileDetails.first_name ? profileDetails.first_name : '') + (profileDetails.last_name ? ' ' + profileDetails.last_name : '')).replace(/\b\w/g, c => c.toUpperCase()).trim()}`
                      : 'Welcome'}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-blue-100 text-sm mb-2"
                  >
                    Hope you are having a great day.
                  </motion.p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="text-blue-100"
                    >
                      <div className="text-sm font-medium">{getCurrentDateTime()}</div>
                      <div className="text-xs mt-1">Last punch: {lastPunchTime}</div>
                    </motion.div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg overflow-hidden">
                      {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span className="text-blue-600 text-2xl font-bold">
                          {profileDetails && (profileDetails.first_name || profileDetails.last_name)
                            ? (((profileDetails.first_name ? profileDetails.first_name : '') + (profileDetails.last_name ? ' ' + profileDetails.last_name : '')).trim()[0] || 'E').toUpperCase()
                            : 'E'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content Grid: Company Feeds center, right sidebar for widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 min-h-[calc(100vh-200px)]">
              {/* Left Sidebar - Highlights, Quick Actions, Announcements */}
              <div className="space-y-4 lg:space-y-6">
                <HighlightsWidget />
                <QuickActionsEmployee />
                <RecentAnnouncements />
              </div>

              {/* Center - Company Feeds (normal width) */}
              <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                <CompanyFeeds />
              </div>

              {/* Right Sidebar - Schedules, Holidays, Tasks, Leave Balance & Attendance */}
              <div className="space-y-4 lg:space-y-6">
                <ScheduleComponent />
                <UpcomingHolidaysWidget />
                <EmployeeTasksWidget />
                <LeaveBalanceWidget />
                <YesterdayAttendanceWidget />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default EmployeeHomePage;
