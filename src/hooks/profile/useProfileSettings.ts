
import { toast } from "sonner";
import type { Profile } from "@/types/profile";
import { useLanguage } from "@/contexts/LanguageContext";

export const useProfileSettings = (
  profile: Profile,
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>
) => {
  const { t } = useLanguage();
  
  const updateThemePreference = async (theme: "light" | "dark" | "system") => {
    try {
      const updates: Partial<Profile> = {
        theme_preference: theme
      };
      const success = await updateProfile(updates);
      if (success) {
        toast.success(t("themeUpdated") + " " + theme + " " + t("mode"));
      }
      return success;
    } catch (error) {
      console.error('Error updating theme preference:', error);
      toast.error(t("error"));
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
        toast.success(t("settingsSaved"));
      }
      return success;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast.error(t("error"));
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
        toast.success(t("settingsSaved"));
      }
      return success;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error(t("error"));
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
        
        // Add font-size class to body for global styling
        document.body.classList.forEach(className => {
          if (className.startsWith('font-size-')) {
            document.body.classList.remove(className);
          }
        });
        document.body.classList.add(`font-size-${value}`);
      }
      else if (setting === "ui_color" && typeof value === "string") {
        // Remove all existing theme classes from HTML element
        document.documentElement.classList.forEach(className => {
          if (className.startsWith('ui-')) {
            document.documentElement.classList.remove(className);
          }
        });
        
        // Add the new theme class to HTML element
        const themeClass = `ui-${value}`;
        document.documentElement.classList.add(themeClass);
        localStorage.setItem("uiTheme", themeClass);
        
        // Add color variables to :root
        document.documentElement.style.setProperty('--theme-color', value);
        
        // Dispatch custom event for theme change
        window.dispatchEvent(new CustomEvent('themeColorChanged', { 
          detail: { themeColor: value }
        }));
      }
      else if (setting === "language" && typeof value === "string") {
        document.documentElement.lang = value;
        document.documentElement.setAttribute('data-language', value);
        localStorage.setItem("language", value);
        
        // Dispatch a custom event for components to listen for language changes
        window.dispatchEvent(new CustomEvent('languageChanged', {
          detail: { language: value }
        }));
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
            toast.success(t("settingsSaved"));
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
      toast.error(t("error"));
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
