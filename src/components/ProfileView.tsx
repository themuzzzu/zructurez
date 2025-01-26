import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Cart } from "./cart/Cart";
import { ProfileHeader } from "./profile/ProfileHeader";
import { ProfileAvatar } from "./profile/ProfileAvatar";
import { ProfileForm } from "./profile/ProfileForm";

export const ProfileView = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [disappearingMessages, setDisappearingMessages] = useState(false);
  const [profile, setProfile] = useState({
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
        return;
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
      setIsEditing(false);
      await fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDisappearingMessages = async (enabled: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to change message settings");
        return;
      }

      const { error } = await supabase
        .from('messages')
        .update({
          expires_at: enabled ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null
        })
        .eq('sender_id', user.id);

      if (error) throw error;

      setDisappearingMessages(enabled);
      toast.success(enabled ? "Disappearing messages enabled" : "Disappearing messages disabled");
    } catch (error) {
      console.error('Error updating disappearing messages:', error);
      toast.error("Failed to update message settings");
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
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
            disappearingMessages={disappearingMessages}
            onProfileChange={(field, value) => setProfile({ ...profile, [field]: value })}
            onDisappearingMessagesChange={handleDisappearingMessages}
            onSave={updateProfile}
          />
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