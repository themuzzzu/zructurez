import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Cart } from "./cart/Cart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationSelector } from "./LocationSelector";

export const ProfileView = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [disappearingMessages, setDisappearingMessages] = useState(false);
  const [profile, setProfile] = useState({
    id: "",
    username: "",
    avatar_url: "",
    bio: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) setProfile({ ...data });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          id: user.id,
          username: profile.username,
          avatar_url: profile.avatar_url,
          bio: profile.bio,
          location: profile.location,
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
      setIsEditing(false);
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
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} />
              <AvatarFallback>User</AvatarFallback>
            </Avatar>
            {isEditing && (
              <div className="w-full">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  value={profile.avatar_url || ""}
                  onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                  placeholder="Enter avatar URL"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile.username || ""}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter username"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              {isEditing ? (
                <LocationSelector
                  value={profile.location || ""}
                  onChange={(value) => setProfile({ ...profile, location: value })}
                />
              ) : (
                <Input
                  id="location"
                  value={profile.location || ""}
                  disabled
                  placeholder="No location set"
                />
              )}
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                disabled={!isEditing}
                placeholder="Tell us about yourself"
                className="h-32"
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="disappearing-messages" className="text-sm font-medium">
                Disappearing messages
              </Label>
              <Switch
                id="disappearing-messages"
                checked={disappearingMessages}
                onCheckedChange={handleDisappearingMessages}
              />
            </div>
            {disappearingMessages && (
              <p className="text-sm text-muted-foreground">
                Messages will disappear after 24 hours
              </p>
            )}

            <div className="flex justify-end gap-4">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={updateProfile} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shopping Cart</CardTitle>
        </CardHeader>
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