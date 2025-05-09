
import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { id } = useParams();
  const { user, profile: currentUserProfile } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // If viewing own profile, use the profile from context
        if (!id && user && currentUserProfile) {
          setProfile(currentUserProfile);
          setLoading(false);
          return;
        }
        
        // If viewing a specific profile, fetch it from Supabase
        const profileId = id || user?.id;
        
        if (profileId) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', profileId)
            .maybeSingle();
            
          if (error) {
            throw error;
          }
          
          setProfile(data);
        } else {
          setError('Not logged in and no profile ID specified');
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        setError(error.message || 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [id, user, currentUserProfile]);
  
  // Redirect to login if trying to view own profile while not logged in
  if (!id && !user && !loading) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <ProfileCard 
          profile={profile} 
          isOwnProfile={!id || id === user?.id} 
        />
      )}
    </div>
  );
};

export default ProfilePage;
