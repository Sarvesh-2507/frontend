import { useNavigate } from "react-router-dom";



// Expanded navigation keywords and paths based on sidebar structure
const NAVIGATION_KEYWORDS: Array<{ keywords: string[]; path: string }> = [
  // Home
  { keywords: ["home", "dashboard", "main page", "landing"], path: "/home" },
  // Recruitment
  { keywords: ["recruitment", "job requisition", "job posting", "application tracking", "ats", "interview management", "candidate registration", "hiring analytics", "recruitment budget"], path: "/recruitment" },
  { keywords: ["job requisition", "requisition management"], path: "/recruitment/job-requisition" },
  { keywords: ["job posting", "advertisement"], path: "/recruitment/job-posting" },
  { keywords: ["application tracking", "ats"], path: "/recruitment/ats" },
  { keywords: ["interview management", "interviews"], path: "/recruitment/interviews" },
  { keywords: ["candidate registration", "register candidate"], path: "/recruitment/candidates" },
  { keywords: ["hiring analytics", "analytics dashboard"], path: "/recruitment/analytics" },
  { keywords: ["recruitment budget", "budget tracker"], path: "/recruitment/budget" },
  // Employee Management
  { keywords: ["employee management", "employee profiles", "employee directory", "profile management", "document management", "access control", "audit logs", "employee reports"], path: "/employee-profile" },
  { keywords: ["employee directory"], path: "/employee/directory" },
  { keywords: ["profile management"], path: "/employee/profile-management" },
  { keywords: ["document management"], path: "/employee/documents" },
  { keywords: ["access control"], path: "/employee/access-control" },
  { keywords: ["audit logs"], path: "/employee/audit-logs" },
  { keywords: ["employee reports"], path: "/employee/reports" },
  // Onboarding
  { keywords: ["onboarding", "start onboarding"], path: "/onboarding" },
  { keywords: ["candidate invite", "invite candidate"], path: "/onboarding/candidate-invite" },
  { keywords: ["candidate uploads", "uploads"], path: "/onboarding/candidate-uploads" },
  { keywords: ["offer letter"], path: "/onboarding/offer-letter" },
  { keywords: ["pre boarding", "pre-boarding"], path: "/onboarding/pre-boarding" },
  { keywords: ["background verification"], path: "/onboarding/background-verification" },
  { keywords: ["joining formalities"], path: "/onboarding/joining-formalities" },
  { keywords: ["task checklist", "checklist tracking"], path: "/onboarding/tasks" },
  { keywords: ["asset allocation"], path: "/onboarding/asset-allocation" },
  // Attendance
  { keywords: ["attendance"], path: "/attendance" },
  { keywords: ["daily attendance"], path: "/attendance/daily" },
  { keywords: ["monthly attendance", "attendance calendar"], path: "/attendance/monthly" },
  { keywords: ["attendance summary"], path: "/attendance/summary" },
  { keywords: ["manual attendance"], path: "/attendance/manual-update" },
  { keywords: ["import attendance"], path: "/attendance/import" },
  { keywords: ["holiday calendar"], path: "/attendance/holidays" },
  { keywords: ["attendance metrics"], path: "/attendance/metrics" },
  // Leave
  { keywords: ["leave"], path: "/leave" },
  { keywords: ["leave application"], path: "/leave/application" },
  { keywords: ["leave history"], path: "/leave/history" },
  { keywords: ["leave balance", "current leave"], path: "/leave/balance" },
  { keywords: ["leave approval"], path: "/leave/approval" },
  { keywords: ["leave requests"], path: "/leave/requests" },
  { keywords: ["leave summary"], path: "/leave/summary" },
  // Payroll
  { keywords: ["payroll"], path: "/payroll" },
  { keywords: ["salary structure"], path: "/payroll/salary-structure" },
  { keywords: ["attendance integration"], path: "/payroll/attendance-integration" },
  { keywords: ["payroll run"], path: "/payroll/run" },
  { keywords: ["payslip generation", "payslips"], path: "/payroll/payslips" },
  { keywords: ["tax management", "tds"], path: "/payroll/tax-management" },
  { keywords: ["bank processing"], path: "/payroll/bank-processing" },
  { keywords: ["statutory compliance", "compliance"], path: "/payroll/compliance" },
  { keywords: ["payroll reports", "payroll analytics"], path: "/payroll/reports" },
  { keywords: ["payroll audit", "audit access"], path: "/payroll/audit" },
  { keywords: ["self service", "self-service portal"], path: "/payroll/self-service" },
  // Organization
  { keywords: ["organization", "organizations"], path: "/organizations" },
  // Help Desk
  { keywords: ["help desk", "support", "ticket"], path: "/help-desk" },
  { keywords: ["create ticket", "support ticket"], path: "/help-desk/create-ticket" },
  { keywords: ["ticket tracking"], path: "/help-desk/tracking" },
  { keywords: ["knowledge base"], path: "/help-desk/knowledge-base" },
  { keywords: ["faq", "frequently asked questions"], path: "/help-desk/faq" },
  { keywords: ["feedback engagement", "feedback"], path: "/help-desk/feedback" },
  // Policies & Documents
  { keywords: ["policies", "documents", "policies and documents"], path: "/policies" },
  { keywords: ["all documents"], path: "/policies/documents" },
  { keywords: ["acknowledgements"], path: "/policies/acknowledgements" },
  // Announcements
  { keywords: ["announcements", "announcement"], path: "/announcements" },
  // Inbox
  { keywords: ["inbox", "messages"], path: "/inbox" },
  // Settings
  { keywords: ["settings", "preferences", "account settings"], path: "/settings" },
  { keywords: ["general settings"], path: "/settings/general" },
  { keywords: ["theme settings", "theme appearance"], path: "/settings/theme" },
  { keywords: ["notification settings", "notifications"], path: "/settings/notifications" },
  { keywords: ["security settings", "security privacy"], path: "/settings/security" },
  // Auth
  { keywords: ["login", "sign in", "log in"], path: "/login" },
  { keywords: ["register", "sign up", "create account"], path: "/register" },
  { keywords: ["forgot password", "reset password"], path: "/forgot-password" },
];

function fuzzyMatch(message: string, keyword: string) {
  // Simple fuzzy: allow for 'go to', 'show', 'open', etc.
  const lower = message.toLowerCase();
  return (
    lower.includes(keyword) ||
    lower.includes("go to " + keyword) ||
    lower.includes("show " + keyword) ||
    lower.includes("open " + keyword) ||
    lower.includes("start " + keyword)
  );
}


export function useChatbotNavigation() {
  const navigate = useNavigate();

  const handleNavigation = (message: string) => {
    const lowerMsg = message.toLowerCase();
    // Try fuzzy match first
    for (const entry of NAVIGATION_KEYWORDS) {
      for (const keyword of entry.keywords) {
        if (fuzzyMatch(lowerMsg, keyword)) {
          navigate(entry.path);
          return entry.path;
        }
      }
    }
    // Fallback: try strict includes
    for (const entry of NAVIGATION_KEYWORDS) {
      for (const keyword of entry.keywords) {
        if (lowerMsg.includes(keyword)) {
          navigate(entry.path);
          return entry.path;
        }
      }
    }
    return null;
  };

  return { handleNavigation };
}
