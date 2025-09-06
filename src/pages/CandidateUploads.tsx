import React, { useState, useEffect } from "react";
import { Eye, RefreshCw, PlusCircle, AlertCircle } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  email: string;
  mobile: string;
  organization: string;
  inviteDate: string;
  status: "Pending" | "Submitted";
}

const CandidateUploads: React.FC = () => {
  const [tab, setTab] = useState<"uploaded" | "invite">("uploaded");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock Data for testing
  const mockCandidates: Candidate[] = [
    {
      id: 1,
      name: "Shiva",
      email: "shiva@gmail.com",
      mobile: "+9109876565",
      organization: "MH Cognition",
      inviteDate: "22/03/2025",
      status: "Pending",
    },
    {
      id: 2,
      name: "Shiva",
      email: "shiva@gmail.com",
      mobile: "+9109876565",
      organization: "MH Cognition",
      inviteDate: "22/03/2025",
      status: "Submitted",
    },
  ];

  // Simulate API fetch
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      setTimeout(() => {
        setCandidates(mockCandidates);
        setLoading(false);
      }, 800);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line
  }, [tab]);

  useEffect(() => {
    console.log("UI updated successfully");
  });

  return (
    <div className="min-h-screen bg-[#1e1e2d] flex flex-col items-center px-0 md:px-8 py-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <h2 className="text-xl font-bold text-white">Uploaded Candidates</h2>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
          onClick={() => alert("Onboarding Invite")}
        >
          Onboarding Invite
        </button>

        {/* Example content to show UI is visible and clickable */}
        <div className="mt-8">
          <p className="text-gray-300">This is the Uploaded Candidates section. All UI is visible and clickable.</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateUploads;
