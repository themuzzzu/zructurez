
import { toast } from "sonner";
import type { Profile } from "@/types/profile";

export const useProfileSettings = (
  profile: Profile,
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>
) => {
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

  return {
    updateThemePreference,
    updatePrivacySettings,
    updateNotificationPreferences
  };
};
