
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/profile";

export const useProfileCore = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({
    id: "",
    username: null,
    avatar_url: null,
    created_at: "",
    bio: null,
    location: null,
    theme_preference: "system",
    privacy_settings: {
      profile_visibility: "public",
      message_permissions: "everyone",
    },
    notification_preferences: {
      email: true,
      sms: false,
      push: true,
    },
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  return {
    profile,
    setProfile,
    loading,
    setLoading,
    isEditing,
    setIsEditing,
    fetchProfile,
  };
};
