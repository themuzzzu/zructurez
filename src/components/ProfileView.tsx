import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Cart } from "./cart/Cart";
import { ProfileHeader } from "./profile/ProfileHeader";
import { ProfileAvatar } from "./profile/ProfileAvatar";
import { ProfileForm } from "./profile/ProfileForm";
import { MessageSettings } from "./profile/MessageSettings";
import { useProfile } from "@/hooks/useProfile";

export const ProfileView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const { profile, loading, setProfile, fetchProfile, updateProfile } = useProfile();

  const handleSave = async () => {
    const success = await updateProfile();
    if (success) {
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error signing out"
      });
    } else {
      navigate('/auth');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <ProfileHeader 
          isEditing={isEditing} 
          onEditClick={() => setIsEditing(!isEditing)} 
        />
        <CardContent className="space-y-6">
          <ProfileAvatar
            avatarUrl={profile.avatar_url}
            isEditing={isEditing}
            onAvatarChange={(url) => setProfile({ ...profile, avatar_url: url })}
          />
          <ProfileForm
            profile={profile}
            isEditing={isEditing}
            loading={loading}
            onProfileChange={(field, value) => setProfile({ ...profile, [field]: value })}
            onSave={handleSave}
          />
          <MessageSettings />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Cart />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};