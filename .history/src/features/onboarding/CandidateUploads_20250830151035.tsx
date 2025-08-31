import React, { useEffect, useState } from "react";
import { AlertCircle, Eye, Calendar, Phone } from "lucide-react";

// Backend API Schema for CandidateDetails
interface CandidateDetails {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: "pending" | "submitted" | "assigned" | "profile_created";
  invited_at: string; // date-time, readOnly
  submitted_at: string | null; // date-time, readOnly, nullable
  form_data: object;
}

// API Configuration - Using your backend
const API_BASE_URL = "http://192.168.1.132:8000/api";

const CandidateUploads: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [selectedCandidateForDetails, setSelectedCandidateForDetails] = useState<CandidateDetails | null>(null);

  // Status color mapping
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    submitted: "bg-blue-100 text-blue-800 border-blue-200",
    assigned: "bg-purple-100 text-purple-800 border-purple-200",
    profile_created: "bg-green-100 text-green-800 border-green-200",
  };

  // Fetch candidates from backend
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      console.log("🔍 Fetching candidates from backend...");
      const response = await fetch(`${API_BASE_URL}/candidates/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Candidates fetched successfully:", data);

      // Ensure data is an array
      const candidatesArray = Array.isArray(data) ? data : data.results || [];
      setCandidates(candidatesArray);
    } catch (err: any) {
      console.error("❌ Failed to fetch candidates:", err);
      setError(err.message || "Failed to fetch candidates from backend");
      setCandidates([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchCandidates();
  }, []);

  // Handle candidate selection
  const toggleSelection = (candidateId: string) => {
    setSelectedCandidates(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectableIds = candidates
        .filter(candidate => candidate.status === "submitted")
        .map(candidate => candidate.id);
      setSelectedCandidates(selectableIds);
    } else {
      setSelectedCandidates([]);
    }
  };

  // Show candidate details
  const showCandidateDetails = (candidate: CandidateDetails) => {
    setSelectedCandidateForDetails(candidate);
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Retry fetch function
  const retryFetch = () => {
    fetchCandidates();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading candidates from backend...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-red-800 font-medium">Failed to Load Candidates</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button
                onClick={retryFetch}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Candidate Uploads</h1>
        <p className="text-gray-600 mt-1">Manage candidate onboarding and profile creation</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(statusColors).map(([status, colorClass]) => {
          const count = candidates.filter(c => c.status === status).length;
          return (
            <div key={status} className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 capitalize">
                    {status.replace('_', ' ')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
                  {status.replace('_', ' ')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Candidates List ({candidates.length})
            </h2>
            <button
              onClick={retryFetch}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {candidates.length === 0 ? (
          <div className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
              <p className="text-gray-600 mb-4">
                There are no candidates in the system. Check your backend API or try refreshing.
              </p>
              <button
                onClick={retryFetch}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={
                        selectedCandidates.length > 0 &&
                        candidates
                          .filter(c => c.status === "submitted")
                          .every(c => selectedCandidates.includes(c.id))
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => toggleSelection(candidate.id)}
                        disabled={candidate.status !== "submitted"}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
                            {(candidate.first_name?.[0] || "") + (candidate.last_name?.[0] || "")}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {candidate.first_name} {candidate.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {candidate.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.email}</div>
                      {candidate.phone_number && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {candidate.phone_number}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[candidate.status]}`}>
                        {candidate.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Invited: {formatDate(candidate.invited_at)}
                        </div>
                        {candidate.submitted_at && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Submitted: {formatDate(candidate.submitted_at)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => showCandidateDetails(candidate)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedCandidates.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                {selectedCandidates.length} candidate(s) selected
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => setSelectedCandidates([])}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors text-sm"
                >
                  Clear Selection
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                  Process Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Candidate Details Modal */}
      {selectedCandidateForDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Candidate Details
                </h3>
                <button
                  onClick={() => setSelectedCandidateForDetails(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCandidateForDetails.first_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCandidateForDetails.last_name}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCandidateForDetails.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCandidateForDetails.phone_number || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[selectedCandidateForDetails.status]}`}>
                    {selectedCandidateForDetails.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Invited At</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedCandidateForDetails.invited_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted At</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedCandidateForDetails.submitted_at)}</p>
                  </div>
                </div>

                {selectedCandidateForDetails.form_data && Object.keys(selectedCandidateForDetails.form_data).length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Form Data</label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                        {JSON.stringify(selectedCandidateForDetails.form_data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedCandidateForDetails(null)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateUploads;
      setCreatedProfiles(
        Array.isArray(created) && created.length > 0
          ? created.map((c: any) => ({
              emp_id: c.emp_id || c.id || "-",
              email: c.company_email || c.email || "-",
              temp_password: c.temp_password || "-",
              id: c.candidate_id || c.id || "-",
            }))
          : []
      );
      const updated = await getAllCandidates();
      setCandidates(Array.isArray(updated) ? updated : []);
      setSelectedCandidates([]);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        (err?.response?.data && typeof err.response.data === 'string' ? err.response.data : null) ||
        err.message ||
        "Failed to create profiles"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleSendCredentials = async (profile: any) => {
    setSending(profile.id);
    try {
      await sendCredentials(profile.id, {
        first_name: "",
        last_name: "",
        email: profile.email,
        phone_number: "",
      });
      alert(`Credentials sent to ${profile.email}`);
    } catch {
      alert("Failed to send credentials");
    } finally {
      setSending(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Candidate Uploads</h2>
      {error && (
        <div className="mb-4 text-red-600 bg-red-50 p-2 rounded" role="alert">{error}</div>
      )}
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-white" aria-label="Candidate List Table">
          <thead>
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  aria-label="Select all submitted candidates"
                  checked={
                    selectedCandidates.length > 0 &&
                    candidates
                      .filter((c) => c.status === "submitted")
                      .every((c) => selectedCandidates.includes(c.id!))
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center" aria-busy="true">
                  Loading...
                </td>
              </tr>
            ) : candidates.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center">
                  No candidates found.
                </td>
              </tr>
            ) : (
              candidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      aria-label={`Select candidate ${candidate.first_name} ${candidate.last_name}`}
                      checked={selectedCandidates.includes(candidate.id!)}
                      onChange={() => toggleSelection(candidate.id!)}
                      disabled={candidate.status !== "submitted"}
                    />
                  </td>
                  <td className="p-3">
                    {candidate.first_name} {candidate.last_name}
                  </td>
                  <td className="p-3">{candidate.email}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        statusColors[candidate.status as keyof typeof statusColors] || ""
                      }`}
                      title={`Status: ${candidate.status}`}
                    >
                      {candidate.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          className={`px-5 py-2 rounded font-semibold ${
            selectedCandidates.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={selectedCandidates.length === 0}
          onClick={openModal}
          aria-label="Open create profile modal"
          title="Create profiles for selected candidates"
        >
          {creating ? "Creating..." : `Create Profile (${selectedCandidates.length})`}
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={closeModal}
              aria-label="Close modal"
              title="Close"
            >
              <X />
            </button>
            {createdProfiles.length === 0 ? (
              <>
                <h3 className="text-lg font-bold mb-4">
                  Assign Details & Create Profiles
                </h3>
                <div className="mb-3">
                  <div className="font-semibold mb-1">Selected Candidates:</div>
                  <ul className="list-disc ml-6 text-sm">
                    {candidates
                      .filter((c) => selectedCandidates.includes(c.id!))
                      .map((c) => (
                        <li key={c.id}>
                          {c.first_name} {c.last_name} ({c.email})
                        </li>
                      ))}
                  </ul>
                </div>
                <form onSubmit={handleCreateProfiles} aria-label="Assign details form">
                  <div className="mb-3">
                    <label className="block mb-1 font-medium" htmlFor="role-select">
                      Role
                    </label>
                    <select
                      id="role-select"
                      name="role"
                      className="block w-full border rounded p-2 mt-1"
                      value={profileDetails.role}
                      onChange={handleProfileDetailChange}
                      required
                      aria-label="Role"
                    >
                      <option value="">Select role</option>
                      <option value="Developer">Developer</option>
                      <option value="Designer">Designer</option>
                      <option value="Manager">Manager</option>
                      <option value="HR">HR</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1 font-medium" htmlFor="department-select">
                      Department
                    </label>
                    <select
                      id="department-select"
                      name="department"
                      className="block w-full border rounded p-2 mt-1"
                      value={profileDetails.department}
                      onChange={handleProfileDetailChange}
                      required
                      aria-label="Department"
                    >
                      <option value="">Select department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="HR">HR</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1 font-medium" htmlFor="joining-date-input">
                      Date of Joining
                    </label>
                    <input
                      type="date"
                      id="joining-date-input"
                      name="joining_date"
                      className="block w-full border rounded p-2 mt-1"
                      value={profileDetails.joining_date}
                      onChange={handleProfileDetailChange}
                      required
                      aria-label="Date of Joining"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block mb-1 font-medium" htmlFor="reporting-manager-input">
                      Reporting Manager
                    </label>
                    <input
                      type="text"
                      id="reporting-manager-input"
                      name="reporting_manager"
                      className="block w-full border rounded p-2 mt-1"
                      value={profileDetails.reporting_manager}
                      onChange={handleProfileDetailChange}
                      required
                      aria-label="Reporting Manager"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded font-semibold mt-2 hover:bg-blue-700"
                    disabled={creating}
                    aria-label="Create profiles"
                  >
                    {creating ? "Creating..." : "Create Profiles"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-4">
                  Profiles Created & Credentials
                </h3>
                <ul className="mb-4">
                  {createdProfiles.map((profile) => (
                    <li
                      key={profile.id}
                      className="flex items-center justify-between border-b py-2"
                    >
                      <div>
                        <span className="font-semibold">{profile.emp_id}</span>{" "}
                        | {profile.email} |{" "}
                        <span className="font-mono">{profile.temp_password}</span>
                      </div>
                      <button
                        className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                        onClick={() => handleSendCredentials(profile)}
                        disabled={sending === profile.id}
                        aria-label={`Send credentials to ${profile.email}`}
                        title={`Send credentials to ${profile.email}`}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        {sending === profile.id ? "Sending..." : "Send Email"}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded font-semibold mt-2"
                  onClick={closeModal}
                  aria-label="Done"
                  title="Done"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateUploads;