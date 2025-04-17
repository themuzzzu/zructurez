
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

  // Improved function to apply display changes globally
  const updateDisplayPreferences = async (
    setting: "font_size" | "ui_color" | "language",
    value: number | string
  ) => {
    try {
      // Apply changes immediately
      if (setting === "font_size" && typeof value === "number") {
        applyFontSize(value);
      }
      else if (setting === "ui_color" && typeof value === "string") {
        applyThemeColor(value);
      }
      else if (setting === "language" && typeof value === "string") {
        applyLanguage(value);
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

  // Helper function to apply font size changes
  const applyFontSize = (value: number) => {
    document.documentElement.style.fontSize = `${value}%`;
    localStorage.setItem("fontSize", value.toString());
    
    // Add font-size class to body for global styling
    document.body.classList.forEach(className => {
      if (className.startsWith('font-size-')) {
        document.body.classList.remove(className);
      }
    });
    document.body.classList.add(`font-size-${value}`);

    // Dispatch a custom event for font size changes
    window.dispatchEvent(new CustomEvent('fontSizeChanged', { 
      detail: { fontSize: value }
    }));
  };

  // Helper function to apply theme color changes
  const applyThemeColor = (colorName: string) => {
    // Remove all existing theme color classes
    document.documentElement.classList.forEach(className => {
      if (className.startsWith('ui-')) {
        document.documentElement.classList.remove(className);
      }
    });
    
    // Add the new theme color class
    const themeClass = `ui-${colorName}`;
    document.documentElement.classList.add(themeClass);
    localStorage.setItem("uiTheme", themeClass);
    
    // Set CSS variables for the theme color
    document.documentElement.style.setProperty('--theme-color', colorName);
    document.documentElement.style.setProperty('--app-primary-color', colorName);
    
    // Inject dynamic CSS to override primary color
    applyPrimaryColorStyle(colorName);
    
    // Dispatch a robust event for theme color change
    window.dispatchEvent(new CustomEvent('themeColorChanged', { 
      detail: { themeColor: colorName }
    }));
  };

  // Function to apply CSS overrides for the primary color
  const applyPrimaryColorStyle = (colorName: string) => {
    // Remove any existing style tag
    const existingStyle = document.getElementById('theme-color-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Color mapping from name to hex
    const colorMap: Record<string, string> = {
      blue: '#3b82f6',
      purple: '#8b5cf6',
      red: '#ef4444',
      green: '#22c55e',
      yellow: '#eab308',
      pink: '#ec4899',
      orange: '#f97316',
      teal: '#14b8a6'
    };
    
    const colorHex = colorMap[colorName] || colorMap.blue;
    const darkerColor = darkenColor(colorHex, 10);
    const lighterColor = lightenColor(colorHex, 10);
    
    // Create style element with CSS variables
    const style = document.createElement('style');
    style.id = 'theme-color-style';
    style.innerHTML = `
      :root {
        --primary: ${colorHex};
        --primary-darker: ${darkerColor};
        --primary-lighter: ${lighterColor};
      }
      
      .bg-primary {
        background-color: ${colorHex} !important;
      }
      
      .text-primary {
        color: ${colorHex} !important;
      }
      
      .border-primary {
        border-color: ${colorHex} !important;
      }
      
      .hover\\:bg-primary:hover {
        background-color: ${colorHex} !important;
      }
      
      .hover\\:text-primary:hover {
        color: ${colorHex} !important;
      }
      
      .hover\\:border-primary:hover {
        border-color: ${colorHex} !important;
      }
      
      button.bg-primary:hover {
        background-color: ${darkerColor} !important;
      }
    `;
    
    document.head.appendChild(style);
  };
  
  // Helper function to darken a color
  const darkenColor = (hex: string, percent: number): string => {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Darken
    const factor = 1 - percent / 100;
    const newR = Math.floor(r * factor);
    const newG = Math.floor(g * factor);
    const newB = Math.floor(b * factor);
    
    // Convert back to hex
    return `#${(newR).toString(16).padStart(2, '0')}${
      (newG).toString(16).padStart(2, '0')}${
      (newB).toString(16).padStart(2, '0')}`;
  };
  
  // Helper function to lighten a color
  const lightenColor = (hex: string, percent: number): string => {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Lighten
    const factor = percent / 100;
    const newR = Math.min(255, Math.floor(r + (255 - r) * factor));
    const newG = Math.min(255, Math.floor(g + (255 - g) * factor));
    const newB = Math.min(255, Math.floor(b + (255 - b) * factor));
    
    // Convert back to hex
    return `#${(newR).toString(16).padStart(2, '0')}${
      (newG).toString(16).padStart(2, '0')}${
      (newB).toString(16).padStart(2, '0')}`;
  };

  // Helper function to apply language changes
  const applyLanguage = (langCode: string) => {
    document.documentElement.lang = langCode;
    document.documentElement.setAttribute('data-language', langCode);
    localStorage.setItem("language", langCode);
    
    // Dispatch multiple events to ensure language changes propagate
    setTimeout(() => {
      // Standard event
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: langCode }
      }));
      
      // DOM event (better for React component detection)
      document.documentElement.dispatchEvent(
        new CustomEvent("language-changed", { bubbles: true })
      );
    }, 0);
  };
  
  return {
    updateThemePreference,
    updatePrivacySettings,
    updateNotificationPreferences,
    updateDisplayPreferences
  };
};
