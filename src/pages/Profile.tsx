
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileView } from "@/components/ProfileView";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  
  // If there's an ID in the URL, we're viewing someone else's profile
  // If not, we're viewing our own profile
  const isOwnProfile = !id;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          toast.error('Authentication error. Please sign in again.');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="container max-w-[1000px] py-6 px-4">
        <ProfileView profileId={id} isOwnProfile={isOwnProfile} />
      </div>
    </Layout>
  );
};

export default Profile;
