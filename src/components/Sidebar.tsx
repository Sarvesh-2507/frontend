import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  UserCheck,
  BarChart3,
  Clock,
  Building,
  Building2,
  Globe,
  Bell,
  DollarSign,
  Shield,
  UserPlus,
  ClipboardList,
  Award,
  Key,
  Moon,
  Sun,
  Search,
  Package,
  HelpCircle,
  Target,
  TrendingUp,
  UserX,
  User,
  Plus,
  CheckCircle,
  XCircle,
  CreditCard,
  Monitor,
  Headphones,
  Upload,
  Edit,
  Calculator,
  MessageSquare,
  Star,
  Download,
  BookOpen
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import Logo from './ui/Logo';
import { useThemeStore } from '../context/themeStore';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path?: string;
  roles?: Array<'admin' | 'hr' | 'employee'>;
  badge?: string;
  children?: MenuItem[];
  hasSubmenu?: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/dashboard',
  },
  {
    id: 'organizations',
    label: 'Organizations',
    icon: Building2,
    path: '/organizations',
    hasSubmenu: true,
    children: [
      { id: 'org-overview', label: 'Overview', icon: BarChart3, path: '/organizations/overview' },
      { id: 'org-list', label: 'All Organizations', icon: Building2, path: '/organizations' },
      { id: 'companies', label: 'Companies', icon: Building, path: '/organizations/companies' },
      { id: 'domains', label: 'Domains', icon: Globe, path: '/organizations/domains' },
    ]
  },
  {
    id: 'recruitment',
    label: 'Recruitment',
    icon: Search,
    path: '/recruitment',
    hasSubmenu: true,
    roles: ['admin', 'hr'],
    children: [
      { id: 'job-requisition', label: 'Job Requisition Management', icon: FileText, path: '/recruitment/job-requisition' },
      { id: 'job-posting', label: 'Job Posting & Advertisement', icon: Plus, path: '/recruitment/job-posting' },
      { id: 'application-tracking', label: 'Application Tracking System', icon: Search, path: '/recruitment/ats' },
      { id: 'interview-management', label: 'Interview Management', icon: Calendar, path: '/recruitment/interviews' },
      { id: 'candidate-registration', label: 'Candidate Registration', icon: UserPlus, path: '/recruitment/candidates' },
      { id: 'hiring-analytics', label: 'Hiring Analytics Dashboard', icon: BarChart3, path: '/recruitment/analytics' },
      { id: 'recruitment-budget', label: 'Recruitment Budget Tracker', icon: DollarSign, path: '/recruitment/budget' },
    ]
  },
  {
    id: 'onboarding',
    label: 'Onboarding',
    icon: UserPlus,
    path: '/onboarding',
    hasSubmenu: true,
    roles: ['admin', 'hr'],
    children: [
      { id: 'offer-letter', label: 'Offer Letter Management', icon: FileText, path: '/onboarding/offer-letter' },
      { id: 'pre-boarding', label: 'Pre-boarding Documentation', icon: ClipboardList, path: '/onboarding/pre-boarding' },
      { id: 'background-verification', label: 'Background Verification', icon: Shield, path: '/onboarding/background-verification' },
      { id: 'joining-formalities', label: 'Joining Formalities', icon: CheckCircle, path: '/onboarding/joining-formalities' },
      { id: 'induction-orientation', label: 'Induction & Orientation', icon: Users, path: '/onboarding/induction' },
      { id: 'task-checklist', label: 'Task & Checklist Tracking', icon: ClipboardList, path: '/onboarding/tasks' },
      { id: 'profile-creation', label: 'Employee Profile Creation', icon: User, path: '/onboarding/profile-creation' },
      { id: 'asset-allocation', label: 'Asset Allocation', icon: Package, path: '/onboarding/asset-allocation' },
    ]
  },
  {
    id: 'employee',
    label: 'Employee',
    icon: Users,
    path: '/employee',
    hasSubmenu: true,
    children: [
      { id: 'employee-profiles', label: 'Employee Profiles', icon: Users, path: '/employee/profiles' },
      { id: 'profile-management', label: 'Profile Management', icon: User, path: '/employee/profile-management' },
      { id: 'document-management', label: 'Document Management', icon: FileText, path: '/employee/documents' },
      { id: 'access-control', label: 'Access Control', icon: Shield, path: '/employee/access-control' },
      { id: 'audit-logs', label: 'Audit Logs', icon: ClipboardList, path: '/employee/audit-logs' },
    ]
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: CheckCircle,
    path: '/attendance',
    hasSubmenu: true,
    children: [
      { id: 'daily-attendance', label: 'Daily Attendance View', icon: Calendar, path: '/attendance/daily' },
      { id: 'monthly-calendar', label: 'Monthly Attendance Calendar', icon: Calendar, path: '/attendance/monthly' },
      { id: 'attendance-summary', label: 'Attendance Summary Report', icon: BarChart3, path: '/attendance/summary' },
      { id: 'manual-update', label: 'Manual Attendance Update', icon: Edit, path: '/attendance/manual-update' },
      { id: 'import-attendance', label: 'Import Attendance', icon: Upload, path: '/attendance/import' },
      { id: 'holiday-calendar', label: 'Holiday Calendar', icon: Calendar, path: '/attendance/holidays' },
      { id: 'attendance-metrics', label: 'Attendance Metrics Dashboard', icon: BarChart3, path: '/attendance/metrics' },
    ]
  },
  {
    id: 'leave',
    label: 'Leave',
    icon: XCircle,
    path: '/leave',
    hasSubmenu: true,
    children: [
      { id: 'leave-application', label: 'Leave Application', icon: Plus, path: '/leave/application' },
      { id: 'leave-history', label: 'Leave Application History', icon: Clock, path: '/leave/history' },
      { id: 'leave-balance', label: 'Current Leave Balance', icon: BarChart3, path: '/leave/balance' },
      { id: 'leave-approval', label: 'Leave Approval', icon: CheckCircle, path: '/leave/approval' },
      { id: 'leave-requests', label: 'View Leave Requests', icon: FileText, path: '/leave/requests' },
      { id: 'leave-summary', label: 'Leave Summary Viewer', icon: BarChart3, path: '/leave/summary' },
    ]
  },
  {
    id: 'payroll',
    label: 'Payroll',
    icon: CreditCard,
    path: '/payroll',
    hasSubmenu: true,
    roles: ['admin', 'hr'],
    children: [
      { id: 'salary-structure', label: 'Employee Salary Structure Setup', icon: DollarSign, path: '/payroll/salary-structure' },
      { id: 'attendance-integration', label: 'Attendance & Time Integration', icon: Clock, path: '/payroll/attendance-integration' },
      { id: 'payroll-run', label: 'Payroll Run (Monthly/Quarterly)', icon: Calendar, path: '/payroll/run' },
      { id: 'payslip-generation', label: 'Payslip Generation & Distribution', icon: FileText, path: '/payroll/payslips' },
      { id: 'tax-management', label: 'Income Tax Management (TDS)', icon: Calculator, path: '/payroll/tax-management' },
      { id: 'bank-processing', label: 'Bank & Payment Processing', icon: CreditCard, path: '/payroll/bank-processing' },
      { id: 'statutory-compliance', label: 'Statutory Compliance', icon: Shield, path: '/payroll/compliance' },
      { id: 'payroll-reports', label: 'Payroll Reports & Analytics', icon: BarChart3, path: '/payroll/reports' },
      { id: 'audit-access', label: 'Audit & Access Control', icon: Shield, path: '/payroll/audit' },
      { id: 'self-service', label: 'Self-Service Portal', icon: User, path: '/payroll/self-service' },
    ]
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: TrendingUp,
    path: '/performance',
    hasSubmenu: true,
    roles: ['admin', 'hr'],
    children: [
      { id: 'performance-reviews', label: 'Schedule Performance Reviews', icon: Calendar, path: '/performance/reviews' },
      { id: 'evaluation-forms', label: 'Create Evaluation Forms', icon: FileText, path: '/performance/evaluation-forms' },
      { id: 'self-assessment', label: 'Submit Self-Assessment', icon: User, path: '/performance/self-assessment' },
      { id: 'performance-feedback', label: 'View Performance Feedback', icon: MessageSquare, path: '/performance/feedback' },
      { id: 'performance-grades', label: 'Approve Performance Grades', icon: Award, path: '/performance/grades' },
      { id: 'performance-insights', label: 'Overview Performance Insights', icon: BarChart3, path: '/performance/insights' },
      { id: 'final-ratings', label: 'Approve Final Ratings', icon: Star, path: '/performance/final-ratings' },
      { id: 'performance-reports', label: 'Export Performance Reports', icon: Download, path: '/performance/reports' },
      { id: 'performance-trends', label: 'View Performance Trends', icon: TrendingUp, path: '/performance/trends' },
    ]
  },
  {
    id: 'offboarding',
    label: 'Offboarding',
    icon: FileText,
    path: '/offboarding',
    hasSubmenu: true,
    roles: ['admin', 'hr'],
    children: [
      { id: 'exit-initiation', label: 'Exit Initiation & Approval', icon: UserX, path: '/offboarding/exit-initiation' },
      { id: 'exit-interview', label: 'Exit Interview & Feedback', icon: MessageSquare, path: '/offboarding/exit-interview' },
      { id: 'final-settlement', label: 'Full & Final Settlement', icon: DollarSign, path: '/offboarding/final-settlement' },
      { id: 'documentation-handover', label: 'Final Documentation & Handover', icon: FileText, path: '/offboarding/documentation' },
      { id: 'asset-return', label: 'Asset Return & Clearance', icon: Package, path: '/offboarding/asset-return' },
      { id: 'access-deactivation', label: 'Access Deactivation', icon: Shield, path: '/offboarding/access-deactivation' },
      { id: 'resignation-tracking', label: 'Apply Resignation', icon: FileText, path: '/offboarding/resignation' },
      { id: 'exit-status', label: 'Track Exit Status', icon: Clock, path: '/offboarding/exit-status' },
      { id: 'exit-letters', label: 'Download Exit Letters', icon: Download, path: '/offboarding/exit-letters' },
    ]
  },
  {
    id: 'assets',
    label: 'Assets',
    icon: Monitor,
    path: '/assets',
    hasSubmenu: true,
    roles: ['admin', 'hr'],
    children: [
      { id: 'asset-request', label: 'Asset Request & Credential Access', icon: Plus, path: '/assets/request' },
      { id: 'asset-template', label: 'Asset Template & Lifecycle Management', icon: Settings, path: '/assets/template' },
      { id: 'inventory-dispatch', label: 'Inventory & Dispatch Control', icon: Package, path: '/assets/inventory' },
      { id: 'asset-tracking', label: 'Asset Tracking', icon: Search, path: '/assets/tracking' },
      { id: 'asset-maintenance', label: 'Asset Maintenance', icon: Settings, path: '/assets/maintenance' },
    ]
  },
  {
    id: 'help-desk',
    label: 'Help Desk',
    icon: Headphones,
    path: '/help-desk',
    hasSubmenu: true,
    children: [
      { id: 'create-ticket', label: 'Create Support Ticket', icon: Plus, path: '/help-desk/create-ticket' },
      { id: 'ticket-tracking', label: 'Ticket Tracking', icon: Search, path: '/help-desk/tracking' },
      { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen, path: '/help-desk/knowledge-base' },
      { id: 'faq', label: 'Frequently Asked Questions', icon: HelpCircle, path: '/help-desk/faq' },
      { id: 'feedback-engagement', label: 'Feedback & Engagement', icon: MessageSquare, path: '/help-desk/feedback' },
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    try {
      console.log('🚪 Sidebar - Starting logout process...');
      const result = await dispatch(logoutUser());

      if (logoutUser.fulfilled.match(result)) {
        console.log('✅ Sidebar - Logout successful');
        toast.success('Logged out successfully');
        navigate('/login');
      } else {
        console.log('❌ Sidebar - Logout failed, but clearing local state');
        toast.success('Logged out successfully');
        navigate('/login');
      }
    } catch (error) {
      console.error('❌ Sidebar - Logout error:', error);
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  const isActiveRoute = (path?: string) => {
    if (!path) return false;
    return location.pathname === path ||
           (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  const hasActiveChild = (children?: MenuItem[]) => {
    if (!children) return false;
    return children.some(child => isActiveRoute(child.path));
  };

  // Debug log removed for production

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="sidebar-modern flex flex-col h-full"
      style={{ minWidth: isCollapsed ? '80px' : '280px' }} // Ensure minimum width
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3"
              >
                <Logo width={120} height={30} />
                <span className="font-bold text-xl text-gray-900 dark:text-white">
                  MH-HR
                </span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center w-full"
              >
                <Logo width={40} height={10} />
                <span className="text-xs font-bold text-gray-900 dark:text-white mt-1">MH-HR</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            type="button"
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* User Info - Clickable */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0 text-left"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  User
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Admin
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {!isCollapsed && (
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
          )}
        </motion.button>

        {!isCollapsed && showUserDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 space-y-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-2"
          >
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>View Profile</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.path);
          const isExpanded = expandedMenus.includes(item.id);
          const hasChildren = item.children && item.children.length > 0;
          const childActive = hasActiveChild(item.children);

          return (
            <div key={item.id}>
              {/* Main Menu Item */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  if (hasChildren) {
                    toggleMenu(item.id);
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive || childActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium truncate flex-1 text-left"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {hasChildren && !isCollapsed && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                )}
                {item.badge && !isCollapsed && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </motion.button>

              {/* Submenu Items */}
              <AnimatePresence>
                {hasChildren && isExpanded && !isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-8 mt-1 space-y-1"
                  >
                    {item.children?.filter(child => {
                      if (!child.roles) return true;
                      return user && child.roles.includes(user.role);
                    }).map((child) => {
                      const ChildIcon = child.icon;
                      const childIsActive = isActiveRoute(child.path);

                      return (
                        <motion.button
                          key={child.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => child.path && navigate(child.path)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                            childIsActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <ChildIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{child.label}</span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Bottom Section - Settings & Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleTheme}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {isDark ? (
            <Sun className="w-5 h-5 flex-shrink-0 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 flex-shrink-0 text-gray-600" />
          )}
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium"
              >
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Settings Dropdown */}
        <div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium flex-1 text-left"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
            {!isCollapsed && (
              <motion.div
                animate={{ rotate: showSettings ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            )}
          </motion.button>

          {/* Settings Submenu */}
          <AnimatePresence>
            {showSettings && !isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-8 mt-1"
              >
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate('/change-password')}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Key className="w-4 h-4 flex-shrink-0" />
                  <span>Change Password</span>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate('/settings')}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  <span>Account Settings</span>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate('/notifications')}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Bell className="w-4 h-4 flex-shrink-0" />
                  <span>Notifications</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
