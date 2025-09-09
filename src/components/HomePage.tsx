import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BarChart3,
  Calendar,
  AlertCircle,
  FileText,
  User,
  Plus,
  Eye,
  ChevronRight,
  Building2,
  DollarSign,
  Search,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  X
} from 'lucide-react';
import Sidebar from './Sidebar';
import { getSidebarQuickActions, SidebarQuickAction } from './sidebarQuickActionsUtil';
import ProfileProgressBar from './ui/ProfileProgressBar';
import HighlightsWidget from './ui/HighlightsWidget';
import QuickEmployeeDirectory from './QuickEmployeeDirectory';
import RecentAnnouncements from './RecentAnnouncements';
import ScheduleComponent from './ScheduleComponent';
import CompanyFeeds from './CompanyFeeds';
import GlobalSearchHeader from './GlobalSearchHeader';
import BackButton from './ui/BackButton';
import LeaveBalanceWidget from './LeaveBalanceWidget';
import YesterdayAttendanceWidget from './YesterdayAttendanceWidget';

interface QuickStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
}

const QuickStatsCard: React.FC<QuickStatsCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-2xl font-bold text-gray-900 dark:text-white mt-2"
          >
            {value}
          </motion.p>
        </div>
        <motion.div
          className={`p-3 rounded-lg ${color}`}
          whileHover={{ rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
};



interface QuickActionProps {
  title: string;
  icon: React.ComponentType<any>;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionProps> = ({ title, icon: Icon, onClick }) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.02,
        x: 5,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center space-x-3 w-full p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group min-h-[48px]"
    >
      <motion.div
        whileHover={{ rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex-shrink-0"
      >
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
      </motion.div>
      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors flex-1 text-left leading-tight">{title}</span>
      <motion.div
        whileHover={{ x: 3 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex-shrink-0"
      >
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </motion.div>
    </motion.button>
  );
};

// Only include sub-features with working UI (update this list as needed)
const WORKING_SUBFEATURES = [
  'Leave Application',
  'Leave Approval',
  'View Attendance',
  'Manage Holidays',
  'Employee Directory',
  'Payroll Reports & Analytics',
  'Payslip Generation & Distribution',
  'Schedule Performance Reviews',
  'Policy Documents',
  'Profile Management',
  'Manual Attendance Update',
  'Create Support Ticket',
  'Training Programs',
  'Exit Initiation & Approval',
  'Asset Request & Credential Access',
  'Benefits Enrollment',
  'Knowledge Base',
];

const allQuickActions: SidebarQuickAction[] = getSidebarQuickActions().filter(a => WORKING_SUBFEATURES.includes(a.title));


const QUICK_ACTIONS_KEY = 'customQuickActionsV2';

const HomePage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showEmployeeDirectory, setShowEmployeeDirectory] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [profileDetails, setProfileDetails] = useState<any>(null);
  const [showQuickActionsModal, setShowQuickActionsModal] = useState(false);
  // Load from localStorage, or show none by default
  const [customQuickActions, setCustomQuickActions] = useState<string[]>(() => {
    const saved = localStorage.getItem(QUICK_ACTIONS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  // Always show all available actions in modal, but preserve order and selection
  const [modalActions, setModalActions] = useState<string[]>(() => allQuickActions.map(a => a.title));
  const [modalSelected, setModalSelected] = useState<Set<string>>(() => new Set(customQuickActions));
  const navigate = useNavigate();

  // Restore toggleSidebar function
  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };


  const quickStats = [
    {
      title: 'Total Employees',
      value: '352',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Projects',
      value: '24',
      icon: BarChart3,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Leaves',
      value: '8',
      icon: Calendar,
      color: 'bg-orange-500',
    },
    {
      title: 'Open Tickets',
      value: '12',
      icon: AlertCircle,
      color: 'bg-red-500',
    },
  ];



  const quickActions = allQuickActions.filter(a => customQuickActions.includes(a.title)).sort((a, b) => customQuickActions.indexOf(a.title) - customQuickActions.indexOf(b.title));
  // Modal handlers
  const openQuickActionsModal = () => {
    // Always show all available actions, but keep the last saved order
    setModalActions(prev => {
      const allTitles = allQuickActions.map(a => a.title);
      const prevSet = new Set(prev);
      const missing = allTitles.filter(t => !prevSet.has(t));
      return [...prev.filter(t => allTitles.includes(t)), ...missing];
    });
    setModalSelected(new Set(customQuickActions));
    setShowQuickActionsModal(true);
  };
  const closeQuickActionsModal = () => setShowQuickActionsModal(false);
  const handleModalToggle = (title: string) => {
    setModalSelected(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title); else next.add(title);
      return next;
    });
  };
  const handleModalMove = (idx: number, dir: -1 | 1) => {
    setModalActions(prev => {
      const arr = [...prev];
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= arr.length) return arr;
      [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
      return arr;
    });
  };
  const handleModalSave = () => {
    const newCustom = modalActions.filter(title => modalSelected.has(title));
    setCustomQuickActions(newCustom);
    localStorage.setItem(QUICK_ACTIONS_KEY, JSON.stringify(newCustom));
    setShowQuickActionsModal(false);
  };

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("accessToken") || localStorage.getItem("authToken");
          if (!token) return;
          const res = await fetch("http://192.168.1.132:8000/api/profiles/profiles/me/", {
            headers: { "Authorization": `Token ${token}` }
          });
          if (!res.ok) return;
          const data = await res.json();
          if (data && data.passport_photo) setProfilePic(data.passport_photo);
          setProfileDetails(data);
        } catch (e) {}
      };
      fetchProfile();
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

  // Mock last punch data - in real app, this would come from API
  const lastPunchTime = "09:15 AM";

  const handleQuickAction = (path: string, title: string) => {
    if (title === 'Employee Directory') {
      setShowEmployeeDirectory(true);
    } else {
      navigate(path);
    }
  };

  // TODO: Replace with real profile completion logic or fetch from API
  const profileCompletion = 65;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container-responsive py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Header with Search */}
          {/* Header with Search */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-3 lg:p-4 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="scale-90 sm:scale-95 lg:scale-100">
              <GlobalSearchHeader onNavigate={navigate} />
            </div>
          </motion.div>

          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            whileHover={{
              scale: 1.005,
              boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)"
            }}
            className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 rounded-xl p-2 sm:p-3 lg:p-4 text-white relative overflow-hidden cursor-pointer w-full md:w-full"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }}
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
                    ? `Welcome ${
                        ((profileDetails.first_name ? profileDetails.first_name : '') +
                        (profileDetails.last_name ? ' ' + profileDetails.last_name : '')
                        ).replace(/\b\w/g, c => c.toUpperCase()).trim()
                      }`
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
                      <img
                        src={profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-blue-600 text-2xl font-bold">
                        {profileDetails && (profileDetails.first_name || profileDetails.last_name)
                          ? (((profileDetails.first_name ? profileDetails.first_name : '') +
                              (profileDetails.last_name ? ' ' + profileDetails.last_name : '')
                            ).trim()[0] || 'T').toUpperCase()
                          : 'T'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 min-h-[calc(100vh-200px)]">
        {/* Left Sidebar - Highlights, Quick Actions & Recent Announcements */}
        <div className="space-y-4 lg:space-y-6">
          {/* Highlights Widget */}
          {/* Deduplicate highlights by type: only one of each */}
          <HighlightsWidget
            highlights={(() => {
              const all = [
                { type: "birthday" as const, label: "", value: "John Doe" },
                { type: "birthday" as const, label: "", value: "John Doe" },
                { type: "anniversary" as const, label: "", value: "Jane Smith" },
                { type: "anniversary" as const, label: "", value: "Jane Smith" }
              ];
              const seen = new Set<string>();
              return all.filter(h => {
                if (seen.has(h.type)) return false;
                seen.add(h.type);
                return true;
              });
            })()}
          />
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700 relative"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4 flex items-center justify-between">
              <span>Quick Actions</span>
              <button
                aria-label="Customize Quick Actions"
                className="ml-2 p-1 rounded-full bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 transition-all shadow-sm border border-blue-100 dark:border-blue-800"
                onClick={openQuickActionsModal}
              >
                <Plus className="w-5 h-5 text-blue-600 dark:text-blue-300" />
              </button>
            </h3>
            <div className="space-y-2 lg:space-y-3">
              {quickActions.length === 0 ? (
                <div className="text-gray-400 text-sm italic">No quick actions selected.</div>
              ) : quickActions.map((action, index) => (
                <QuickActionButton
                  key={index}
                  title={action.title}
                  icon={action.icon}
                  onClick={() => handleQuickAction(action.path, action.title)}
                />
              ))}
            </div>
            {/* Modal for customizing quick actions */}
            {showQuickActionsModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300" onClick={closeQuickActionsModal} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 40 }}
                  transition={{ duration: 0.25 }}
                  className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-blue-100 dark:border-blue-800 p-6 w-[95vw] max-w-md mx-auto flex flex-col gap-4"
                  style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
                >
                  <button
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    onClick={closeQuickActionsModal}
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                  <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-2">Customize Quick Actions</h4>
                  <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                    {modalActions.map((title, idx) => {
                      const action = allQuickActions.find(a => a.title === title);
                      if (!action) return null;
                      return (
                        <motion.div
                          key={title}
                          layout
                          className={`flex items-center justify-between bg-blue-50/60 dark:bg-blue-900/40 rounded-lg px-3 py-2 gap-2 border border-blue-100 dark:border-blue-800 transition-all`}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={modalSelected.has(title)}
                              onChange={() => handleModalToggle(title)}
                              className="accent-blue-600 w-4 h-4 mr-2"
                              id={`quick-action-checkbox-${idx}`}
                              title={`Toggle ${title}`}
                            />
                            <label htmlFor={`quick-action-checkbox-${idx}`} className="sr-only">
                              Toggle {title}
                            </label>
                            <action.icon className="w-5 h-5 text-blue-600 dark:text-blue-300 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{title}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-800"
                              onClick={() => handleModalMove(idx, -1)}
                              disabled={idx === 0}
                              aria-label="Move Up"
                            >
                              <ArrowUp className={`w-4 h-4 ${idx === 0 ? 'text-gray-300' : 'text-blue-500'}`} />
                            </button>
                            <button
                              className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-800"
                              onClick={() => handleModalMove(idx, 1)}
                              disabled={idx === modalActions.length - 1}
                              aria-label="Move Down"
                            >
                              <ArrowDown className={`w-4 h-4 ${idx === modalActions.length - 1 ? 'text-gray-300' : 'text-blue-500'}`} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                      onClick={closeQuickActionsModal}
                    >Cancel</button>
                    <button
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow"
                      onClick={handleModalSave}
                    >Save</button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
          {/* Recent Announcements */}
          <RecentAnnouncements />
        </div>

        {/* Center - Company Feeds */}
        <div className="lg:col-span-2">
          <CompanyFeeds />
        </div>

        {/* Right Sidebar - Schedule and Widgets */}
        <div className="space-y-4 lg:space-y-6">
          <ScheduleComponent />
          <LeaveBalanceWidget />
          <YesterdayAttendanceWidget />
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)"
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/announcements', { state: { openCreate: true } })}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Quick Employee Directory Modal */}
      <QuickEmployeeDirectory
        isOpen={showEmployeeDirectory}
        onClose={() => setShowEmployeeDirectory(false)}
      />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
