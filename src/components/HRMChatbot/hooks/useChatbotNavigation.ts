import { useNavigate } from "react-router-dom";

const NAVIGATION_KEYWORDS: Record<string, string> = {
  profile: "/employee/profile",
  attendance: "/employee/attendance",
  payroll: "/employee/payroll",
  dashboard: "/dashboard",
  // Add more mappings as needed
};

export function useChatbotNavigation() {
  const navigate = useNavigate();

  const handleNavigation = (message: string) => {
    for (const [keyword, path] of Object.entries(NAVIGATION_KEYWORDS)) {
      if (message.toLowerCase().includes(keyword)) {
        navigate(path);
        return path;
      }
    }
    return null;
  };

  return { handleNavigation };
}
