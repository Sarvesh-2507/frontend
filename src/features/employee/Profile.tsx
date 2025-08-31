import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../context/authStore";

const Profile: React.FC = () => {
  const { user, tokens } = useAuthStore();
  const [profile, setProfile] = useState<any>(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If user is not loaded, fetch from /api/me
    if (!user && tokens?.access) {
      setLoading(true);
      fetch("/api/me", {
        headers: { Authorization: `Bearer ${tokens.access}` },
      })
        .then((res) => res.json())
        .then((data) => setProfile(data))
        .catch(() => setError("Failed to load profile"))
        .finally(() => setLoading(false));
    }
  }, [user, tokens]);

  if (loading) return <div className="p-8">Loading profile...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!profile) return <div className="p-8">No profile data found.</div>;

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="mb-2"><b>Name:</b> {profile.firstName || profile.first_name || profile.username || profile.email}</div>
      <div className="mb-2"><b>Email:</b> {profile.email}</div>
      <div className="mb-2"><b>Role:</b> {profile.role}</div>
      {/* Add more fields as needed */}
    </div>
  );
};

export default Profile;
