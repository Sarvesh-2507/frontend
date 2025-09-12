import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  MoreVertical,
  Plus,
  Search,
  User,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HelpDeskMainContent from "./HelpDeskMainContent";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  assignee?: string;
  requester: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

const HelpDesk: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      {/* HR sidebar here, if needed, or leave to parent */}
      <HelpDeskMainContent />
    </div>
  );
};

export default HelpDesk;
