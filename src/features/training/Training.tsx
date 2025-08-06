import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Target,
  Award,
  TrendingUp,
  Calendar,
  MessageSquare,
  Plus,
  Search,
  Filter,
  Download,
  Users,
  Clock,
  Star,
  CheckCircle,
  BarChart3,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';

interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  duration: string;
  instructor: string;
  category: string;
  status: 'active' | 'completed' | 'upcoming';
  enrolledCount: number;
  maxCapacity: number;
  startDate: string;
  endDate: string;
}

interface SubModule {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  description: string;
}

const Training: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('programs');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const subModules: SubModule[] = [
    {
      id: 'programs',
      name: 'Training Programs',
      icon: BookOpen,
      path: '/training/programs',
      description: 'Manage and view training programs',
    },
    {
      id: 'skill-assessment',
      name: 'Skill Assessment',
      icon: Target,
      path: '/training/skill-assessment',
      description: 'Assess employee skills and competencies',
    },
    {
      id: 'certifications',
      name: 'Certification Tracking',
      icon: Award,
      path: '/training/certifications',
      description: 'Track employee certifications',
    },
    {
      id: 'learning-paths',
      name: 'Learning Paths',
      icon: TrendingUp,
      path: '/training/learning-paths',
      description: 'Create structured learning journeys',
    },
    {
      id: 'calendar',
      name: 'Training Calendar',
      icon: Calendar,
      path: '/training/calendar',
      description: 'Schedule and view training sessions',
    },
    {
      id: 'feedback',
      name: 'Training Feedback',
      icon: MessageSquare,
      path: '/training/feedback',
      description: 'Collect and analyze training feedback',
    },
  ];

  const mockPrograms: TrainingProgram[] = [
    {
      id: '1',
      title: 'Leadership Development Program',
      description: 'Comprehensive leadership training for managers',
      duration: '8 weeks',
      instructor: 'John Smith',
      category: 'Leadership',
      status: 'active',
      enrolledCount: 25,
      maxCapacity: 30,
      startDate: '2024-02-01',
      endDate: '2024-03-26',
    },
    {
      id: '2',
      title: 'Technical Skills Bootcamp',
      description: 'Intensive technical training program',
      duration: '12 weeks',
      instructor: 'Sarah Johnson',
      category: 'Technical',
      status: 'upcoming',
      enrolledCount: 15,
      maxCapacity: 25,
      startDate: '2024-03-01',
      endDate: '2024-05-24',
    },
    {
      id: '3',
      title: 'Communication Excellence',
      description: 'Improve workplace communication skills',
      duration: '4 weeks',
      instructor: 'Mike Davis',
      category: 'Soft Skills',
      status: 'completed',
      enrolledCount: 20,
      maxCapacity: 20,
      startDate: '2024-01-01',
      endDate: '2024-01-26',
    },
  ];

  const categories = ['all', 'Leadership', 'Technical', 'Soft Skills', 'Compliance'];

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Training data loaded successfully');
    } catch (error) {
      console.error('Error fetching training data:', error);
      toast.error('Failed to fetch training data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredPrograms = mockPrograms.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Training & Development</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage training programs, track skills, and monitor employee development
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>New Program</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Sub-module Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex space-x-1 overflow-x-auto">
              {subModules.map((module) => {
                const Icon = module.icon;
                const isActive = activeTab === module.id;
                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveTab(module.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{module.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search training programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Training Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {program.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {program.description}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(program.status)}`}>
                    {program.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{program.enrolledCount}/{program.maxCapacity} enrolled</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Star className="w-4 h-4 mr-2" />
                    <span>Instructor: {program.instructor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {program.category}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;
