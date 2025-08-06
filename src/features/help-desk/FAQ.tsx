import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Star,
  Filter,
  Tag,
  Clock,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  notHelpful: number;
  views: number;
  lastUpdated: string;
  featured: boolean;
}

interface FAQCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

const FAQ: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Mock data
  const mockCategories: FAQCategory[] = [
    {
      id: 'account',
      name: 'Account & Login',
      description: 'Password, account access, and login issues',
      icon: '🔐',
      count: 12
    },
    {
      id: 'hr-policies',
      name: 'HR Policies',
      description: 'Leave, benefits, and company policies',
      icon: '👥',
      count: 18
    },
    {
      id: 'it-support',
      name: 'IT Support',
      description: 'Technical issues and software problems',
      icon: '💻',
      count: 25
    },
    {
      id: 'payroll',
      name: 'Payroll & Benefits',
      description: 'Salary, benefits, and financial queries',
      icon: '💰',
      count: 15
    },
    {
      id: 'facilities',
      name: 'Facilities',
      description: 'Office space, parking, and amenities',
      icon: '🏢',
      count: 8
    },
    {
      id: 'general',
      name: 'General',
      description: 'Other common questions',
      icon: '❓',
      count: 10
    }
  ];

  const mockFaqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login page and click "Forgot Password". Enter your email address and follow the instructions sent to your email. If you don\'t receive an email within 10 minutes, check your spam folder or contact IT support.',
      category: 'account',
      tags: ['password', 'login', 'security'],
      helpful: 45,
      notHelpful: 2,
      views: 1250,
      lastUpdated: '2024-02-20',
      featured: true
    },
    {
      id: '2',
      question: 'What is the company leave policy?',
      answer: 'Employees are entitled to 21 days of annual leave per year, plus public holidays. Sick leave is available up to 10 days per year. All leave requests must be submitted at least 7 days in advance through the HR portal, except for emergency sick leave.',
      category: 'hr-policies',
      tags: ['leave', 'vacation', 'policy'],
      helpful: 67,
      notHelpful: 3,
      views: 2100,
      lastUpdated: '2024-02-25',
      featured: true
    },
    {
      id: '3',
      question: 'How do I connect to the company VPN?',
      answer: 'Download the VPN client from the IT portal. Use your company credentials to log in. For detailed setup instructions, refer to the VPN setup guide in the Knowledge Base or contact IT support for assistance.',
      category: 'it-support',
      tags: ['vpn', 'remote-work', 'connection'],
      helpful: 38,
      notHelpful: 1,
      views: 890,
      lastUpdated: '2024-02-15',
      featured: false
    },
    {
      id: '4',
      question: 'When is payday?',
      answer: 'Salaries are paid on the last working day of each month. If the last day falls on a weekend or holiday, payment will be made on the previous working day. Pay slips are available in the employee portal 2 days before payday.',
      category: 'payroll',
      tags: ['salary', 'payday', 'payslip'],
      helpful: 23,
      notHelpful: 0,
      views: 567,
      lastUpdated: '2024-02-28',
      featured: false
    },
    {
      id: '5',
      question: 'How do I book a meeting room?',
      answer: 'Meeting rooms can be booked through the Facilities portal or the calendar system. Rooms are available from 8 AM to 6 PM on weekdays. For after-hours bookings, contact the facilities team. All bookings must include the purpose and expected number of attendees.',
      category: 'facilities',
      tags: ['meeting-room', 'booking', 'facilities'],
      helpful: 31,
      notHelpful: 2,
      views: 743,
      lastUpdated: '2024-02-10',
      featured: false
    },
    {
      id: '6',
      question: 'What should I do if I\'m locked out of my computer?',
      answer: 'If you\'re locked out due to multiple failed login attempts, wait 15 minutes and try again. If you\'ve forgotten your password, use the password reset option or contact IT support. For hardware issues, submit a support ticket through the help desk portal.',
      category: 'it-support',
      tags: ['lockout', 'computer', 'access'],
      helpful: 19,
      notHelpful: 1,
      views: 432,
      lastUpdated: '2024-02-18',
      featured: false
    },
    {
      id: '7',
      question: 'How do I update my emergency contact information?',
      answer: 'Log into the employee portal and navigate to "Personal Information". Click "Emergency Contacts" and update your information. Changes are effective immediately. It\'s important to keep this information current for safety and communication purposes.',
      category: 'hr-policies',
      tags: ['emergency-contact', 'personal-info', 'update'],
      helpful: 15,
      notHelpful: 0,
      views: 298,
      lastUpdated: '2024-02-22',
      featured: false
    },
    {
      id: '8',
      question: 'What are the office parking rules?',
      answer: 'Parking is available on a first-come, first-served basis. Visitor parking is limited to 2 hours. Employee parking permits are required and can be obtained from the facilities team. Unauthorized vehicles may be towed at owner\'s expense.',
      category: 'facilities',
      tags: ['parking', 'permits', 'rules'],
      helpful: 12,
      notHelpful: 1,
      views: 356,
      lastUpdated: '2024-02-12',
      featured: false
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterFaqs();
  }, [faqs, searchTerm, selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCategories(mockCategories);
      setFaqs(mockFaqs);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFaqs = () => {
    let filtered = faqs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // Sort by featured first, then by helpfulness
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.helpful - a.helpful;
    });

    setFilteredFaqs(filtered);
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
      // Increment view count
      setFaqs(prev => prev.map(faq => 
        faq.id === id ? { ...faq, views: faq.views + 1 } : faq
      ));
    }
    setExpandedItems(newExpanded);
  };

  const handleFeedback = (id: string, isHelpful: boolean) => {
    setFaqs(prev => prev.map(faq => {
      if (faq.id === id) {
        return {
          ...faq,
          helpful: isHelpful ? faq.helpful + 1 : faq.helpful,
          notHelpful: !isHelpful ? faq.notHelpful + 1 : faq.notHelpful
        };
      }
      return faq;
    }));
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || categoryId;
  };

  const getCategoryIcon = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.icon || '❓';
  };

  const featuredFaqs = filteredFaqs.filter(faq => faq.featured);
  const popularFaqs = [...filteredFaqs].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/help-desk')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h1>
                <p className="text-gray-600 dark:text-gray-400">Find quick answers to common questions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search frequently asked questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedCategory === 'all'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                } bg-white dark:bg-gray-800`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🔍</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">All</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{faqs.length}</div>
                </div>
              </button>
              
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  } bg-white dark:bg-gray-800`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{category.count}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Featured FAQs */}
            {featuredFaqs.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Featured Questions</h3>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {featuredFaqs.slice(0, 3).map((faq) => (
                    <div key={faq.id} className="p-6">
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="w-full text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</h4>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center space-x-1">
                              <span>{getCategoryIcon(faq.category)}</span>
                              <span>{getCategoryName(faq.category)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <ThumbsUp className="w-3 h-3" />
                              <span>{faq.helpful}</span>
                            </span>
                          </div>
                        </div>
                        {expandedItems.has(faq.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {expandedItems.has(faq.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 pl-3">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                {faq.answer}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {faq.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                                    >
                                      <Tag className="w-3 h-3 mr-1" />
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Was this helpful?</span>
                                  <button
                                    onClick={() => handleFeedback(faq.id, true)}
                                    className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleFeedback(faq.id, false)}
                                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  >
                                    <ThumbsDown className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main FAQ List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* FAQ Items */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Questions ({filteredFaqs.length})
                    </h3>
                  </div>
                  
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : filteredFaqs.length === 0 ? (
                      <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p>No questions found matching your search.</p>
                      </div>
                    ) : (
                      filteredFaqs.map((faq) => (
                        <div key={faq.id} className="p-6">
                          <button
                            onClick={() => toggleExpanded(faq.id)}
                            className="w-full text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</h4>
                                {faq.featured && (
                                  <Star className="w-4 h-4 text-yellow-500" />
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center space-x-1">
                                  <span>{getCategoryIcon(faq.category)}</span>
                                  <span>{getCategoryName(faq.category)}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{faq.helpful}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{new Date(faq.lastUpdated).toLocaleDateString()}</span>
                                </span>
                              </div>
                            </div>
                            {expandedItems.has(faq.id) ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          
                          <AnimatePresence>
                            {expandedItems.has(faq.id) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-4 pl-3">
                                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                    {faq.answer}
                                  </p>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      {faq.tags.map((tag) => (
                                        <span
                                          key={tag}
                                          className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                                        >
                                          <Tag className="w-3 h-3 mr-1" />
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-500 dark:text-gray-400">Was this helpful?</span>
                                      <button
                                        onClick={() => handleFeedback(faq.id, true)}
                                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                      >
                                        <ThumbsUp className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleFeedback(faq.id, false)}
                                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                      >
                                        <ThumbsDown className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Popular Questions */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Questions</h3>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {popularFaqs.map((faq, index) => (
                      <div
                        key={faq.id}
                        onClick={() => toggleExpanded(faq.id)}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                              {faq.question}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                              <span>{faq.views} views</span>
                              <span>•</span>
                              <span>{faq.helpful} helpful</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Need More Help */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <div className="text-center">
                    <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Need More Help?
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                      Can't find what you're looking for? Our support team is here to help.
                    </p>
                    <button
                      onClick={() => navigate('/help-desk/create-ticket')}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Support Ticket
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FAQ;
