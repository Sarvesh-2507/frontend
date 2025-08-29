import React, { useState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle, User, Users, X, Link as LinkIcon, Copy, Check } from "lucide-react";
import ModulePage from "../../components/ModulePage";
import { motion } from "framer-motion";
import { sendCandidateInvite, SendInviteData, InviteResponse } from "./services/api";

const CandidateInvites: React.FC = () => {
  const [inviteData, setInviteData] = useState<SendInviteData>({
    email: "",
    name: "",
    position: "",
    message: "",
    expiryDays: 7,
    includeOnboardingUrl: true
  });
  const [sending, setSending] = useState(false);
  const [sentInvites, setSentInvites] = useState<Array<{ 
    email: string; 
    status: string;
    inviteUrl?: string;
  }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkInvites, setBulkInvites] = useState<string>("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInviteData(prev => ({
      ...prev,
      [name]: name === "expiryDays" ? parseInt(value) : value
    }));
  };

  const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteData.email || !inviteData.name) {
      setError("Email and name are required");
      return;
    }

    if (!validateEmail(inviteData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    setSending(true);

    try {
      const response = await sendCandidateInvite(inviteData);
      
      if (response.success && response.data?.sent) {
        setSuccess(`Invitation sent successfully to ${inviteData.email}`);
        setSentInvites(prev => [...prev, { 
          email: inviteData.email, 
          status: "sent",
          inviteUrl: response.data?.inviteUrl
        }]);
        
        // Reset form
        setInviteData({
          email: "",
          name: "",
          position: "",
          message: "",
          expiryDays: 7,
          includeOnboardingUrl: true
        });
      } else {
        setError(response.error || "Failed to send invitation");
        setSentInvites(prev => [...prev, { email: inviteData.email, status: "failed" }]);
      }
    } catch (err) {
      console.error("Error sending invitation:", err);
      setError("An unexpected error occurred");
      setSentInvites(prev => [...prev, { email: inviteData.email, status: "failed" }]);
    } finally {
      setSending(false);
      // Clear success message after 5 seconds
      if (success) {
        setTimeout(() => setSuccess(null), 5000);
      }
    }
  };

  const handleSendBulkInvites = async () => {
    if (!bulkInvites.trim()) {
      setError("Please enter at least one email");
      return;
    }

    const invitesList = bulkInvites
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== "")
      .map(line => {
        const parts = line.split(',').map(part => part.trim());
        return {
          email: parts[0],
          name: parts[1] || parts[0].split('@')[0],
          position: parts[2] || inviteData.position,
          message: inviteData.message,
          expiryDays: inviteData.expiryDays,
          includeOnboardingUrl: true
        };
      });

    // Validate emails
    const invalidEmails = invitesList.filter(invite => !validateEmail(invite.email));
    if (invalidEmails.length > 0) {
      setError(`${invalidEmails.length} invalid email(s) found. Please fix before sending.`);
      return;
    }

    setError(null);
    setSending(true);
    let successCount = 0;
    let failureCount = 0;

    for (const invite of invitesList) {
      try {
        const response = await sendCandidateInvite(invite);
        
        if (response.success && response.data?.sent) {
          successCount++;
          setSentInvites(prev => [...prev, { 
            email: invite.email, 
            status: "sent",
            inviteUrl: response.data?.inviteUrl
          }]);
        } else {
          failureCount++;
          setSentInvites(prev => [...prev, { email: invite.email, status: "failed" }]);
        }
      } catch (err) {
        console.error(`Error sending invitation to ${invite.email}:`, err);
        failureCount++;
        setSentInvites(prev => [...prev, { email: invite.email, status: "failed" }]);
      }
      
      // Small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setSending(false);
    
    if (successCount > 0 && failureCount === 0) {
      setSuccess(`Successfully sent ${successCount} invitation(s)`);
      setBulkInvites("");
    } else if (successCount > 0 && failureCount > 0) {
      setSuccess(`Sent ${successCount} invitation(s), but ${failureCount} failed`);
    } else {
      setError("Failed to send any invitations");
    }
    
    // Clear success message after 5 seconds
    if (successCount > 0) {
      setTimeout(() => setSuccess(null), 5000);
    }
  };

  // Function to copy URL to clipboard
  const copyToClipboard = (url: string, email: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(email);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const removeInvite = (email: string) => {
    setSentInvites(prev => prev.filter(invite => invite.email !== email));
  };

  return (
    <ModulePage
      title="Candidate Invitations"
      description="Send email invitations to candidates with secure links"
      icon={Send}
      comingSoon={false}
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Send Candidate Invitations</h2>
            <p className="text-gray-600 mt-1">
              Invite candidates to fill out their information and upload required documents
            </p>
          </div>

          <div className="flex items-center mb-6 space-x-4">
            <button
              onClick={() => setBulkMode(false)}
              className={`px-4 py-2 rounded-md ${
                !bulkMode 
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <User className="inline-block mr-2 h-4 w-4" />
              Single Invite
            </button>
            <button
              onClick={() => setBulkMode(true)}
              className={`px-4 py-2 rounded-md ${
                bulkMode 
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Users className="inline-block mr-2 h-4 w-4" />
              Bulk Invites
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
              <button 
                className="ml-auto text-red-500 hover:text-red-700"
                onClick={() => setError(null)}
                aria-label="Dismiss error message"
                title="Dismiss error message"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Success</p>
                <p>{success}</p>
              </div>
              <button 
                className="ml-auto text-green-500 hover:text-green-700"
                onClick={() => setSuccess(null)}
                aria-label="Dismiss success message"
                title="Dismiss success message"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* URL preview for most recently sent invite */}
          {sentInvites.length > 0 && sentInvites[sentInvites.length - 1].inviteUrl && (
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 flex items-start">
              <LinkIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div className="flex-1 break-all">
                <p className="font-medium">Invitation Link Generated</p>
                <p className="text-sm font-mono mt-1">{sentInvites[sentInvites.length - 1].inviteUrl}</p>
                <div className="mt-2">
                  <button
                    onClick={() => copyToClipboard(sentInvites[sentInvites.length - 1].inviteUrl || "", sentInvites[sentInvites.length - 1].email)}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm rounded"
                    aria-label="Copy URL to clipboard"
                    title="Copy URL to clipboard"
                  >
                    {copiedUrl === sentInvites[sentInvites.length - 1].email ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>
              <button
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={() => {
                  const newSentInvites = [...sentInvites];
                  newSentInvites[newSentInvites.length - 1] = {
                    ...newSentInvites[newSentInvites.length - 1],
                    inviteUrl: undefined
                  };
                  setSentInvites(newSentInvites);
                }}
                aria-label="Dismiss URL preview"
                title="Dismiss URL preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {!bulkMode ? (
            // Single invite form
            <form onSubmit={handleSendInvite} className="space-y-6 max-w-xl">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={inviteData.email}
                    onChange={handleChange}
                    placeholder="candidate@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={inviteData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={inviteData.position}
                  onChange={handleChange}
                  placeholder="Software Engineer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={inviteData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="We're excited to have you join our team! Please complete your candidate profile by clicking the link below."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="expiryDays" className="block text-sm font-medium text-gray-700 mb-1">
                  Link Expiry
                </label>
                <select
                  id="expiryDays"
                  name="expiryDays"
                  value={inviteData.expiryDays}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Send Invitation
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            // Bulk invite form
            <div className="space-y-6 max-w-xl">
              <div>
                <label htmlFor="bulkInvites" className="block text-sm font-medium text-gray-700 mb-1">
                  Bulk Invitations
                </label>
                <div className="text-sm text-gray-500 mb-2">
                  Format: email,name,position (one per line). Name and position are optional.
                </div>
                <textarea
                  id="bulkInvites"
                  name="bulkInvites"
                  value={bulkInvites}
                  onChange={(e) => setBulkInvites(e.target.value)}
                  rows={8}
                  placeholder="john.doe@example.com,John Doe,Software Engineer
jane.smith@example.com,Jane Smith,Product Manager
candidate@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="defaultPosition" className="block text-sm font-medium text-gray-700 mb-1">
                    Default Position
                  </label>
                  <input
                    type="text"
                    id="defaultPosition"
                    name="position"
                    value={inviteData.position}
                    onChange={handleChange}
                    placeholder="Software Engineer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="bulkExpiryDays" className="block text-sm font-medium text-gray-700 mb-1">
                    Link Expiry
                  </label>
                  <select
                    id="bulkExpiryDays"
                    name="expiryDays"
                    value={inviteData.expiryDays}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={3}>3 days</option>
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                    <option value={30}>30 days</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="includeUrl"
                    name="includeOnboardingUrl"
                    checked={inviteData.includeOnboardingUrl}
                    onChange={(e) => setInviteData(prev => ({
                      ...prev,
                      includeOnboardingUrl: e.target.checked
                    }))}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="includeUrl" className="text-sm font-medium text-gray-700">
                    Include onboarding URL in email
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  When enabled, an onboarding form link will be generated and included in the invitation email
                </p>
              </div>
              
              <div>
                <label htmlFor="bulkMessage" className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Message (applies to all invites)
                </label>
                <textarea
                  id="bulkMessage"
                  name="message"
                  value={inviteData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="We're excited to have you join our team! Please complete your candidate profile by clicking the link below."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <button
                  onClick={handleSendBulkInvites}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Send Bulk Invitations
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Sent invites log */}
          {sentInvites.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Invites</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {sentInvites.slice().reverse().map((invite, index) => (
                  <motion.div
                    key={`${invite.email}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-3 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium">{invite.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {invite.status === "sent" ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Sent
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Failed
                        </span>
                      )}
                      
                      {invite.inviteUrl && (
                        <button
                          onClick={() => copyToClipboard(invite.inviteUrl || "", invite.email)}
                          className="flex items-center px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100"
                          aria-label={`Copy invitation URL for ${invite.email}`}
                          title={`Copy invitation URL for ${invite.email}`}
                        >
                          {copiedUrl === invite.email ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              Copy URL
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => removeInvite(invite.email)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                        aria-label={`Remove invitation for ${invite.email}`}
                        title={`Remove invitation for ${invite.email}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ModulePage>
  );
};

export default CandidateInvites;
