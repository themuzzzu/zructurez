import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/profile";

export const useProfile = () => {
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

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('No user found');
        navigate('/auth');
        return false;
      }

      const updatedProfile = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id);

      if (error) throw error;
      
      setProfile(prev => ({ ...prev, ...updates }));
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('No user found');
        navigate('/auth');
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateThemePreference = async (theme: "light" | "dark" | "system") => {
    try {
      const updates: Partial<Profile> = {
        theme_preference: theme
      };
      const success = await updateProfile(updates);
      if (success) {
        toast.success(`Theme updated to ${theme} mode`);
      }
      return success;
    } catch (error) {
      console.error('Error updating theme preference:', error);
      toast.error('Failed to update theme preference');
      return false;
    }
  };

  const updatePrivacySettings = async (
    setting: "profile_visibility" | "message_permissions", 
    value: string
  ) => {
    try {
      const updates: Partial<Profile> = {
        privacy_settings: {
          ...profile.privacy_settings,
          [setting]: value
        }
      };
      const success = await updateProfile(updates);
      if (success) {
        toast.success(`Privacy setting updated`);
      }
      return success;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast.error('Failed to update privacy settings');
      return false;
    }
  };

  const updateNotificationPreferences = async (
    channel: "email" | "sms" | "push",
    enabled: boolean
  ) => {
    try {
      const updates: Partial<Profile> = {
        notification_preferences: {
          ...profile.notification_preferences,
          [channel]: enabled
        }
      };
      const success = await updateProfile(updates);
      if (success) {
        toast.success(`Notification preferences updated`);
      }
      return success;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error('Failed to update notification preferences');
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  return {
    profile,
    loading,
    isEditing,
    setIsEditing,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    setProfile,
    updateThemePreference,
    updatePrivacySettings,
    updateNotificationPreferences
  };
};
