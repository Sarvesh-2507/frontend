import { useEffect, useState } from 'react';
import { Profile } from '../../types/profile';
import { profileApi } from '../../services/profileApi';

export function useEmployeeProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    profileApi.getMyProfile()
      .then((data) => {
        if (mounted) {
          setProfile(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Failed to load profile');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return { profile, loading, error };
}
