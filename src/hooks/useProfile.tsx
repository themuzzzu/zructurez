
import { useProfileCore } from "./profile/useProfileCore";
import { useProfileUpdater } from "./profile/useProfileUpdater";
import { useAvatarUploader } from "./profile/useAvatarUploader";
import { useProfileSettings } from "./profile/useProfileSettings";

export const useProfile = () => {
  const { 
    profile, 
    setProfile, 
    loading, 
    setLoading, 
    isEditing, 
    setIsEditing, 
    fetchProfile 
  } = useProfileCore();

  const { updateProfile } = useProfileUpdater(profile, setProfile, setLoading);
  const { uploadAvatar } = useAvatarUploader(setProfile, setLoading);
  const { 
    updateThemePreference, 
    updatePrivacySettings, 
    updateNotificationPreferences 
  } = useProfileSettings(profile, updateProfile);

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
