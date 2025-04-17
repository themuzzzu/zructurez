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

  const updateDisplayPreferences = async (
    setting: "font_size" | "ui_color" | "language",
    value: number | string
  ) => {
    try {
      // Apply changes immediately
      if (setting === "font_size" && typeof value === "number") {
        document.documentElement.style.fontSize = `${value}%`;
        localStorage.setItem("fontSize", value.toString());
      }
      else if (setting === "ui_color" && typeof value === "string") {
        // Remove all theme classes first
        document.documentElement.classList.forEach(className => {
          if (className.startsWith('ui-')) {
            document.documentElement.classList.remove(className);
          }
        });
        
        // Add new class
        document.documentElement.classList.add(`ui-${value}`);
        localStorage.setItem("uiTheme", `ui-${value}`);
      }
      else if (setting === "language" && typeof value === "string") {
        document.documentElement.lang = value;
        document.documentElement.setAttribute('data-language', value);
        localStorage.setItem("language", value);
      }
      
      // Only attempt to update profile in database if profile exists and has ID
      if (profile?.id) {
        try {
          const updates: Partial<Profile> = {
            display_preferences: {
              ...profile.display_preferences,
              [setting]: value
            }
          };
          
          const success = await updateProfile(updates);
          if (success) {
            toast.success(`Display preference updated`);
          }
          return success;
        } catch (error) {
          // If the database update fails, still keep the local changes
          console.error('Error updating display preferences in database:', error);
          // Don't show error toast since local changes were successful
          return true;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error updating display preferences:', error);
      toast.error('Failed to update display preferences');
      return false;
    }
  };
  
  return {
    updateThemePreference,
    updatePrivacySettings,
    updateNotificationPreferences,
    updateDisplayPreferences
  };
};
