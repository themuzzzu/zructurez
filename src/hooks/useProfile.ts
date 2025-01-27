import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  username: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
}

export const useProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({
    id: "",
    username: "",
    name: "",
    avatar_url: "",
    bio: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('No user found');
        navigate('/auth');
        return false;
      }

      const updates = {
        username: profile.username,
        name: profile.name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        location: profile.location,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    setProfile,
    fetchProfile,
    updateProfile,
  };
};