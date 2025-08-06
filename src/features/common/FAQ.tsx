import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  HelpCircle,
  Search,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Logo from "../../components/ui/Logo";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
  lastUpdated: string;
  popular: boolean;
}

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Sample FAQ data
  const faqs: FAQ[] = [
    {
      id: "faq-001",
      question: "How do I reset my password?",
      answer:
        "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address and follow the instructions sent to your email. You'll receive a link to create a new password. Make sure to choose a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.",
      category: "Account Management",
      helpful: 245,
      notHelpful: 12,
      lastUpdated: "2024-01-15T10:30:00Z",
      popular: true,
    },
    {
      id: "faq-002",
      question: "How do I request time off?",
      answer:
        "To request time off, log into the HR portal and navigate to the 'Leave Management' section. Click 'Request Leave', select your leave type (vacation, sick, personal), choose your dates, and add any necessary comments. Your manager will be notified automatically and you'll receive an email confirmation once approved or denied.",
      category: "Leave Management",
      helpful: 189,
      notHelpful: 8,
      lastUpdated: "2024-01-12T14:20:00Z",
      popular: true,
    },
    {
      id: "faq-003",
      question: "How do I access my pay stubs?",
      answer:
        "Pay stubs are available in the Employee Self-Service portal. Log in with your credentials, go to 'Payroll' section, and click 'View Pay Stubs'. You can view, download, or print your current and historical pay stubs. If you're having trouble accessing this section, contact HR or IT support.",
      category: "Payroll",
      helpful: 156,
      notHelpful: 5,
      lastUpdated: "2024-01-10T09:15:00Z",
      popular: true,
    },
    {
      id: "faq-004",
      question: "How do I update my personal information?",
      answer:
        "To update your personal information, log into the HR portal and go to 'My Profile'. Here you can update your address, phone number, emergency contacts, and other personal details. Some changes may require manager approval. For sensitive information like banking details, you may need to contact HR directly.",
      category: "Profile Management",
      helpful: 134,
      notHelpful: 7,
      lastUpdated: "2024-01-08T16:45:00Z",
      popular: false,
    },
    {
      id: "faq-005",
      question: "How do I report a technical issue?",
      answer:
        "For technical issues, you can create a support ticket through the Help Desk portal. Click 'Create Support Ticket', describe your issue in detail, select the appropriate category, and assign a priority level. You'll receive a ticket number for tracking. For urgent issues, you can also call the IT support hotline.",
      category: "Technical Support",
      helpful: 98,
      notHelpful: 3,
      lastUpdated: "2024-01-05T11:30:00Z",
      popular: false,
    },
    {
      id: "faq-006",
      question: "How do I access company benefits information?",
      answer:
        "Benefits information is available in the HR portal under 'Benefits' section. Here you can view your current benefits, make changes during open enrollment, download benefits summaries, and find contact information for benefit providers. You can also schedule appointments with HR for benefits counseling.",
      category: "Benefits",
      helpful: 87,
      notHelpful: 4,
      lastUpdated: "2024-01-03T13:20:00Z",
      popular: false,
    },
    {
      id: "faq-007",
      question: "How do I set up direct deposit?",
      answer:
        "To set up direct deposit, log into the payroll system and go to 'Banking Information'. Enter your bank routing number and account number. You'll need to provide a voided check or bank statement for verification. Changes typically take 1-2 pay periods to take effect. Contact payroll if you need assistance.",
      category: "Payroll",
      helpful: 76,
      notHelpful: 2,
      lastUpdated: "2024-01-01T10:00:00Z",
      popular: false,
    },
    {
      id: "faq-008",
      question: "How do I access training materials?",
      answer:
        "Training materials are available in the Learning Management System (LMS). Log in with your employee credentials and browse available courses by category or search for specific topics. You can track your progress, download certificates, and view your learning history. Some courses may be mandatory and have deadlines.",
      category: "Training",
      helpful: 65,
      notHelpful: 1,
      lastUpdated: "2023-12-28T15:45:00Z",
      popular: false,
    },
  ];

  const categories = [
    "Account Management",
    "Leave Management",
    "Payroll",
    "Profile Management",
    "Technical Support",
    "Benefits",
    "Training",
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const popularFAQs = faqs.filter((faq) => faq.popular);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleHelpful = (faqId: string, helpful: boolean) => {
    // Handle helpful/not helpful feedback
    console.log(
      `FAQ ${faqId} marked as ${helpful ? "helpful" : "not helpful"}`
    );
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
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => navigate("/help-desk")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Logo width={120} height={30} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Frequently Asked Questions
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Find quick answers to common questions
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search frequently asked questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Popular FAQs */}
            {popularFAQs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Popular Questions
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularFAQs.slice(0, 4).map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => toggleFAQ(faq.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            {faq.question}
                          </h3>
                          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="w-3 h-3" />
                              <span>{faq.helpful}</span>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                              {faq.category}
                            </span>
                          </div>
                        </div>
                        <HelpCircle className="w-4 h-4 text-blue-500 flex-shrink-0 ml-2" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* All FAQs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                All Questions ({filteredFAQs.length})
              </h2>
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {faq.question}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                              {faq.category}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">
                                Updated {formatDate(faq.lastUpdated)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <ThumbsUp className="w-3 h-3" />
                                <span className="text-xs">{faq.helpful}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ThumbsDown className="w-3 h-3" />
                                <span className="text-xs">
                                  {faq.notHelpful}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          {expandedFAQ === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedFAQ === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 dark:border-gray-700"
                        >
                          <div className="px-6 py-4">
                            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                              {faq.answer}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Was this helpful?
                                </span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleHelpful(faq.id, true)}
                                    className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Yes</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleHelpful(faq.id, false)}
                                    className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  >
                                    <ThumbsDown className="w-4 h-4" />
                                    <span>No</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FAQ;
