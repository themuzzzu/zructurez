
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useProfile } from "@/hooks/useProfile";
import { Loader2 } from "lucide-react";

export const PrivacySettings = () => {
  const { profile, loading, updatePrivacySettings } = useProfile();

  const handleProfileVisibilityChange = (value: string) => {
    updatePrivacySettings("profile_visibility", value);
  };

  const handleMessagePermissionsChange = (value: string) => {
    updatePrivacySettings("message_permissions", value);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Privacy Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Profile Privacy</h3>
          <div className="space-y-2">
            <Label>Who can see your profile</Label>
            <RadioGroup
              value={profile.privacy_settings?.profile_visibility || "public"}
              onValueChange={handleProfileVisibilityChange}
              className="space-y-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="profile-public" />
                <Label htmlFor="profile-public">Everyone (Public)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="followers" id="profile-followers" />
                <Label htmlFor="profile-followers">Followers Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="profile-private" />
                <Label htmlFor="profile-private">Private (Only You)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2 pt-4">
            <Label>Who can message you</Label>
            <RadioGroup
              value={profile.privacy_settings?.message_permissions || "everyone"}
              onValueChange={handleMessagePermissionsChange}
              className="space-y-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="everyone" id="messages-everyone" />
                <Label htmlFor="messages-everyone">Everyone</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="followers" id="messages-followers" />
                <Label htmlFor="messages-followers">Followers Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="messages-none" />
                <Label htmlFor="messages-none">No One</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Data Usage</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics">Allow analytics</Label>
              <Switch id="analytics" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="personalization">Personalized content</Label>
              <Switch id="personalization" defaultChecked />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
