
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { ProfileDisplay } from "@/components/profile/ProfileDisplay";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Profile } from "@/types/profile";

interface ProfileViewProps {
  profileId?: string;
  isOwnProfile?: boolean;
}

export const ProfileView = ({ profileId, isOwnProfile = true }: ProfileViewProps) => {
  const navigate = useNavigate();
  const { 
    profile, 
    loading, 
    isEditing, 
    setIsEditing, 
    updateProfile, 
    uploadAvatar 
  } = useProfile();

  const handleSave = async (updatedProfile: Partial<Profile>) => {
    const success = await updateProfile(updatedProfile);
    if (success) {
      setIsEditing(false);
      toast.success("Profile updated successfully");
    }
  };

  const handleAvatarChange = async (file: File) => {
    const url = await uploadAvatar(file);
    if (url) {
      toast.success("Profile picture updated");
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      navigate('/auth');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="pt-6">
          {isEditing ? (
            <ProfileEditForm
              profile={profile}
              loading={loading}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
              onAvatarChange={handleAvatarChange}
            />
          ) : (
            <ProfileDisplay 
              profile={profile} 
              onEdit={() => isOwnProfile && setIsEditing(true)} 
              isOwnProfile={isOwnProfile}
            />
          )}
        </CardContent>
      </Card>

      <ProfileTabs profileId={profileId} />

      {isOwnProfile && (
        <Card>
          <CardContent className="pt-6">
            <Button variant="destructive" onClick={handleSignOut}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
