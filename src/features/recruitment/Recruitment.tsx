import { motion } from "framer-motion";
import {
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  DollarSign,
  Download,
  Edit,
  Eye,
  Filter,
  MapPin,
  Plus,
  Search,
  Users,
  XCircle,
  FileText,
  UserPlus,
  BarChart3,
  TrendingUp,
  Clock,
  Star,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "../../components/Sidebar";
import Logo from "../../components/ui/Logo";
import { dashboardAPI } from "../../services/api";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract";
  salary: string;
  postedDate: string;
  applications: number;
  status: "active" | "closed" | "draft";
  description?: string;
  requirements?: string[];
  benefits?: string[];
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  experience: string;
  status:
    | "applied"
    | "screening"
    | "interview"
    | "offer"
    | "hired"
    | "rejected";
  appliedDate: string;
  resume: string;
  phone?: string;
  skills?: string[];
  rating?: number;
}

interface SubModule {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  description: string;
  count?: number;
}

interface RecruitmentStats {
  totalJobs: number;
  activeJobs: number;
  totalCandidates: number;
  interviewsScheduled: number;
  offersExtended: number;
  hiredThisMonth: number;
}

const Recruitment: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubModule, setActiveSubModule] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<RecruitmentStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalCandidates: 0,
    interviewsScheduled: 0,
    offersExtended: 0,
    hiredThisMonth: 0,
  });
  const navigate = useNavigate();

  const subModules: SubModule[] = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: BarChart3,
      path: "/recruitment",
      description: "Recruitment overview and analytics",
      count: stats.totalJobs,
    },
    {
      id: "job-requisition",
      name: "Job Requisition",
      icon: FileText,
      path: "/recruitment/job-requisition",
      description: "Manage job requisitions and approval workflows",
    },
    {
      id: "job-posting",
      name: "Job Posting",
      icon: Plus,
      path: "/recruitment/job-posting",
      description: "Post jobs on multiple platforms",
    },
    {
      id: "ats",
      name: "Application Tracking",
      icon: Search,
      path: "/recruitment/ats",
      description: "Track candidate applications",
      count: stats.totalCandidates,
    },
    {
      id: "interviews",
      name: "Interview Management",
      icon: Calendar,
      path: "/recruitment/interviews",
      description: "Schedule and manage interviews",
      count: stats.interviewsScheduled,
    },
    {
      id: "candidates",
      name: "Candidate Registration",
      icon: UserPlus,
      path: "/recruitment/candidates",
      description: "Manage candidate records",
    },
    {
      id: "analytics",
      name: "Hiring Analytics",
      icon: TrendingUp,
      path: "/recruitment/analytics",
      description: "View recruitment metrics and insights",
    },
    {
      id: "budget",
      name: "Budget Tracker",
      icon: DollarSign,
      path: "/recruitment/budget",
      description: "Track recruitment expenses",
    },
  ];

  useEffect(() => {
    fetchRecruitmentData();
  }, []);

  const fetchRecruitmentData = async () => {
    try {
      setLoading(true);
      // Fetch recruitment statistics from backend
      const response = await dashboardAPI.getStats();
      if (response.data) {
        setStats({
          totalJobs: response.data.totalJobs || jobPostings.length,
          activeJobs: response.data.activeJobs || jobPostings.filter(job => job.status === 'active').length,
          totalCandidates: response.data.totalCandidates || candidates.length,
          interviewsScheduled: response.data.interviewsScheduled || candidates.filter(c => c.status === 'interview').length,
          offersExtended: response.data.offersExtended || candidates.filter(c => c.status === 'offer').length,
          hiredThisMonth: response.data.hiredThisMonth || candidates.filter(c => c.status === 'hired').length,
        });
      }
      toast.success("Recruitment data loaded successfully");
    } catch (error) {
      console.error("Error fetching recruitment data:", error);
      // Use mock data as fallback
      setStats({
        totalJobs: jobPostings.length,
        activeJobs: jobPostings.filter(job => job.status === 'active').length,
        totalCandidates: candidates.length,
        interviewsScheduled: candidates.filter(c => c.status === 'interview').length,
        offersExtended: candidates.filter(c => c.status === 'offer').length,
        hiredThisMonth: candidates.filter(c => c.status === 'hired').length,
      });
      toast.error("Using offline data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubModuleClick = (subModule: SubModule) => {
    setActiveSubModule(subModule.id);
    navigate(subModule.path);
  };

  const handleCreateJob = () => {
    navigate("/recruitment/job-posting");
  };

  const handleViewCandidate = (candidateId: string) => {
    navigate(`/recruitment/candidates/${candidateId}`);
  };

  const jobPostings: JobPosting[] = [
    {
      id: "1",
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "New York, NY",
      type: "full-time",
      salary: "$120,000 - $150,000",
      postedDate: "2024-01-15",
      applications: 45,
      status: "active",
    },
    {
      id: "2",
      title: "Marketing Manager",
      department: "Marketing",
      location: "San Francisco, CA",
      type: "full-time",
      salary: "$90,000 - $110,000",
      postedDate: "2024-01-20",
      applications: 32,
      status: "active",
    },
    {
      id: "3",
      title: "HR Specialist",
      department: "Human Resources",
      location: "Remote",
      type: "full-time",
      salary: "$65,000 - $80,000",
      postedDate: "2024-01-10",
      applications: 28,
      status: "closed",
    },
  ];

  const candidates: Candidate[] = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice.johnson@email.com",
      position: "Senior Software Engineer",
      experience: "5 years",
      status: "interview",
      appliedDate: "2024-01-25",
      resume: "alice_johnson_resume.pdf",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob.smith@email.com",
      position: "Marketing Manager",
      experience: "7 years",
      status: "screening",
      appliedDate: "2024-01-28",
      resume: "bob_smith_resume.pdf",
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol.davis@email.com",
      position: "HR Specialist",
      experience: "3 years",
      status: "offer",
      appliedDate: "2024-01-22",
      resume: "carol_davis_resume.pdf",
    },
  ];

  const recruitmentStats = [
    {
      title: "Active Jobs",
      value: "12",
      change: "+3",
      changeType: "increase" as const,
      icon: Briefcase,
      color: "bg-blue-500",
    },
    {
      title: "Total Applications",
      value: "156",
      change: "+24",
      changeType: "increase" as const,
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "In Interview",
      value: "18",
      change: "+5",
      changeType: "increase" as const,
      icon: Calendar,
      color: "bg-yellow-500",
    },
    {
      title: "Hired This Month",
      value: "8",
      change: "+2",
      changeType: "increase" as const,
      icon: CheckCircle,
      color: "bg-purple-500",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "hired":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "interview":
      case "screening":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "offer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "closed":
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "applied":
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "part-time":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "contract":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="header-modern px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                <Search className="w-8 h-8 text-blue-600" />
                <span>Recruitment</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage job postings, applications, and candidate pipeline
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateJob}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Post New Job</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Submodule Navigation */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-3">
            <div className="flex space-x-1 overflow-x-auto">
              {subModules.map((subModule) => {
                const Icon = subModule.icon;
                const isActive = activeSubModule === subModule.id;
                return (
                  <button
                    key={subModule.id}
                    onClick={() => handleSubModuleClick(subModule)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{subModule.name}</span>
                    {subModule.count !== undefined && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isActive
                          ? "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      }`}>
                        {subModule.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recruitmentStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="stat-card"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p
                          className={`text-sm ${
                            stat.changeType === "increase"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {stat.change} this month
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("jobs")}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  activeTab === "jobs"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Job Postings
              </button>
              <button
                onClick={() => setActiveTab("candidates")}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  activeTab === "candidates"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Candidates
              </button>
            </div>

            {/* Job Postings */}
            {activeTab === "jobs" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Active Job Postings
                  </h3>

                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobPostings.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {job.title}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            job.status
                          )}`}
                        >
                          {job.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Building className="w-4 h-4 mr-2" />
                          {job.department}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-2" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {job.salary}
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                              job.type
                            )}`}
                          >
                            {job.type}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {job.applications} applications
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Posted {job.postedDate}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Candidates */}
            {activeTab === "candidates" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Candidate Pipeline
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Candidate
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Position
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Experience
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Applied Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((candidate) => (
                        <tr
                          key={candidate.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {candidate.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {candidate.email}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {candidate.position}
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {candidate.experience}
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {candidate.appliedDate}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                candidate.status
                              )}`}
                            >
                              {candidate.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-green-600 hover:text-green-700 dark:text-green-400">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-700 dark:text-red-400">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Recruitment;
