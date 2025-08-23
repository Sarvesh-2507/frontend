import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Home,
  Users,
  UserPlus,
  User,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  UserMinus,
  Package,
  Building2,
  Globe,
  HelpCircle,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { FileText, FolderOpen, CheckCircle } from 'lucide-react';

// Redux
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { toggleTheme } from '../../store/slices/uiSlice';
import { logoutUser } from '../../store/slices/authSlice';

// UI Components
import Card from '../ui/Card';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import ConfirmationDialog from '../ui/ConfirmationDialog';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path?: string;
  children?: MenuItem[];
  badge?: string | number;
}

const menuItems: MenuItem[] = [

  {
    id: 'organizations',
    label: 'Organization',
    icon: Building2,
    children: [
      { id: 'org-list', label: 'All Companies', icon: Building2, path: '/organizations' },
      { id: 'domains', label: 'Domains', icon: Globe, path: '/organizations/domains' },
    ],
  },
  {
    id: 'recruitment',
    label: 'Recruitment & Hiring',
    icon: Users,
    children: [
      { id: 'job-postings', label: 'Job Postings', icon: Users, path: '/recruitment/jobs' },
      { id: 'candidate-pipeline', label: 'Candidate Pipeline', icon: User, path: '/recruitment/pipeline' },
      { id: 'interviews', label: 'Interview Scheduling', icon: Calendar, path: '/recruitment/interviews' },
      { id: 'offers', label: 'Offer Management', icon: DollarSign, path: '/recruitment/offers' },
      { id: 'recruitment-analytics', label: 'Recruitment Analytics', icon: TrendingUp, path: '/recruitment/analytics' },
    ],
  },
  {
    id: 'onboarding',
    label: 'Onboarding',
    icon: UserPlus,
    children: [
      { id: 'new-hires', label: 'New Hires', icon: UserPlus, path: '/onboarding/new-hires' },
      { id: 'documentation', label: 'Documentation', icon: Package, path: '/onboarding/documentation' },
      { id: 'training', label: 'Training', icon: TrendingUp, path: '/onboarding/training' },
    ],
  },
  {
    id: 'employee-management',
    label: 'Employee Management',
    icon: User,
    children: [
      { id: 'all-employees', label: 'All Employees', icon: Users, path: '/employees/all' },
      { id: 'employee-directory', label: 'Employee Directory', icon: User, path: '/employees/directory' },
      { id: 'employee-profiles', label: 'Employee Profiles', icon: User, path: '/employee-profile' },
      { id: 'organizational-chart', label: 'Organizational Chart', icon: TrendingUp, path: '/employees/org-chart' },
    ],
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: Clock,
    children: [
      { id: 'time-tracking', label: 'Time Tracking', icon: Clock, path: '/attendance/tracking' },
      { id: 'reports', label: 'Reports', icon: TrendingUp, path: '/attendance/reports' },
      { id: 'overtime', label: 'Overtime', icon: Clock, path: '/attendance/overtime' },
    ],
  },
  {
    id: 'leave',
    label: 'Leave',
    icon: Calendar,
    children: [
      { id: 'leave-requests', label: 'Leave Requests', icon: Calendar, path: '/leave/requests', badge: '3' },
      { id: 'leave-balance', label: 'Leave Balance', icon: Calendar, path: '/leave/balance' },
      { id: 'holidays', label: 'Holidays', icon: Calendar, path: '/leave/holidays' },
    ],
  },
  {
    id: 'payroll',
    label: 'Payroll',
    icon: DollarSign,
    children: [
      { id: 'salary-management', label: 'Salary Management', icon: DollarSign, path: '/payroll/salary' },
      { id: 'payslips', label: 'Payslips', icon: DollarSign, path: '/payroll/payslips' },
      { id: 'tax-management', label: 'Tax Management', icon: DollarSign, path: '/payroll/tax' },
    ],
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: TrendingUp,
    children: [
      { id: 'reviews', label: 'Reviews', icon: TrendingUp, path: '/performance/reviews' },
      { id: 'goals', label: 'Goals', icon: TrendingUp, path: '/performance/goals' },
      { id: 'feedback', label: 'Feedback', icon: TrendingUp, path: '/performance/feedback' },
    ],
  },
  {
    id: 'offboarding',
    label: 'Offboarding',
    icon: UserMinus,
    children: [
      { id: 'exit-interviews', label: 'Exit Interviews', icon: UserMinus, path: '/offboarding/interviews' },
      { id: 'clearance', label: 'Clearance', icon: UserMinus, path: '/offboarding/clearance' },
      { id: 'final-settlement', label: 'Final Settlement', icon: DollarSign, path: '/offboarding/settlement' },
    ],
  },
  {
    id: 'assets',
    label: 'Assets',
    icon: Package,
    children: [
      { id: 'asset-management', label: 'Asset Management', icon: Package, path: '/assets/management' },
      { id: 'allocation', label: 'Allocation', icon: Package, path: '/assets/allocation' },
      { id: 'maintenance', label: 'Maintenance', icon: Package, path: '/assets/maintenance' },
    ],
  },
  {
    id: 'policies-docs',
    label: 'Policies & Documents',
    icon: FileText,
    children: [
      { id: 'policies', label: 'Policies', icon: FileText, path: '/policies' },
      { id: 'documents', label: 'Documents', icon: FolderOpen, path: '/policies/documents' },
      { id: 'acknowledgements', label: 'Acknowledgements', icon: CheckCircle, path: '/policies/acknowledgements' },
    ],
  },
  {
    id: 'hr-analytics',
    label: 'HR Analytics & Reports',
    icon: TrendingUp,
    children: [
      { id: 'workforce-analytics', label: 'Workforce Analytics', icon: TrendingUp, path: '/analytics/workforce' },
      { id: 'turnover-analysis', label: 'Turnover Analysis', icon: TrendingUp, path: '/analytics/turnover' },
      { id: 'performance-metrics', label: 'Performance Metrics', icon: TrendingUp, path: '/analytics/performance' },
      { id: 'compliance-reports', label: 'Compliance Reports', icon: TrendingUp, path: '/analytics/compliance' },
    ],
  },
  {
    id: 'help-desk',
    label: 'HR Help Desk',
    icon: HelpCircle,
    children: [
      { id: 'employee-queries', label: 'Employee Queries', icon: HelpCircle, path: '/help-desk/queries' },
      { id: 'policy-assistance', label: 'Policy Assistance', icon: HelpCircle, path: '/help-desk/policies' },
      { id: 'document-requests', label: 'Document Requests', icon: HelpCircle, path: '/help-desk/documents' },
      { id: 'grievance-handling', label: 'Grievance Handling', icon: HelpCircle, path: '/help-desk/grievances' },
    ],
  },
];

const SidebarModern: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { sidebarCollapsed, theme } = useAppSelector((state: { ui: { sidebarCollapsed: boolean; theme: string } }) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [expandedItems, setExpandedItems] = React.useState<string[]>(['dashboard']);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      console.log('🚪 SidebarModern - Starting logout process');
      await dispatch(logoutUser()).unwrap();
      console.log('✅ SidebarModern - Logout successful, redirecting to login');
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('❌ SidebarModern - Logout error:', error);
      // Even if logout fails, redirect to login
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.path);

    return (
      <div key={item.id} className="mb-1">
        {item.path ? (
          <Link
            to={item.path}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
              active
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-soft-xl'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400'
            } ${level > 0 ? 'ml-4' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`} />
              {!sidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </div>
            {!sidebarCollapsed && item.badge && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => toggleExpanded(item.id)}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400 ${
              level > 0 ? 'ml-4' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              {!sidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </div>
            {!sidebarCollapsed && hasChildren && (
              <div className="flex items-center space-x-2">
                {item.badge && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {item.badge}
                  </span>
                )}
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            )}
          </button>
        )}

        {/* Submenu */}
        <AnimatePresence>
          {hasChildren && isExpanded && !sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1 ml-4 space-y-1"
            >
              {item.children?.map(child => renderMenuItem(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-80'
        }`}
        initial={false}
        animate={{ x: sidebarCollapsed ? 0 : 0 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            {!sidebarCollapsed ? (
              <div className="flex items-center space-x-3">
                <Logo width={100} height={25} />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">MH-HR</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Human Resource Management</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <Logo width={40} height={10} />
                <span className="text-xs font-bold text-gray-900 dark:text-white mt-1">MH-HR</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {sidebarCollapsed ? (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* User Profile */}
          {!sidebarCollapsed && user && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <Card variant="soft" padding="sm" className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {user.name?.charAt(0) || user.username?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {user.name || user.username}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.department || 'Admin'}
                  </p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map(item => renderMenuItem(item))}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            {!sidebarCollapsed && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  icon={theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  onClick={handleThemeToggle}
                  className="justify-start"
                >
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </Button>

                <Link to="/settings">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    icon={<Settings className="w-4 h-4" />}
                    className="justify-start"
                  >
                    Settings
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  icon={<LogOut className="w-4 h-4" />}
                  onClick={handleLogoutClick}
                  className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Logout
                </Button>
              </>
            )}

            {sidebarCollapsed && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleThemeToggle}
                  className="w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400 mx-auto" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400 mx-auto" />
                  )}
                </button>

                <Link
                  to="/settings"
                  className="block w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400 mx-auto" />
                </Link>

                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="w-full p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Logout"
                >
                  <LogOut className="w-5 h-5 text-red-600 mx-auto" />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        type="warning"
      />
    </>
  );
};

export default SidebarModern;
