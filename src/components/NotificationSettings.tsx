
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/hooks/useProfile";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export const NotificationSettings = () => {
  const { profile, loading, updateNotificationPreferences } = useProfile();

  const handleNotificationToggle = (channel: "email" | "sms" | "push", checked: boolean) => {
    updateNotificationPreferences(channel, checked);
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
        <CardTitle className="text-2xl font-bold">Notification Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Notification Channels</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch 
                id="email-notifications" 
                checked={profile.notification_preferences?.email || false}
                onCheckedChange={(checked) => handleNotificationToggle("email", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <Switch 
                id="sms-notifications" 
                checked={profile.notification_preferences?.sms || false}
                onCheckedChange={(checked) => handleNotificationToggle("sms", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch 
                id="push-notifications"
                checked={profile.notification_preferences?.push || false}
                onCheckedChange={(checked) => handleNotificationToggle("push", checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Notification Types</h3>
          <div className="space-y-3">
            {profile.notification_preferences?.email && (
              <div className="space-y-3 border rounded-md p-4">
                <h4 className="font-medium">Email Notifications</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email-messages" defaultChecked />
                    <Label htmlFor="email-messages" className="text-sm">New messages</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email-mentions" defaultChecked />
                    <Label htmlFor="email-mentions" className="text-sm">Mentions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email-updates" />
                    <Label htmlFor="email-updates" className="text-sm">Product updates</Label>
                  </div>
                </div>
              </div>
            )}

            {profile.notification_preferences?.push && (
              <div className="space-y-3 border rounded-md p-4">
                <h4 className="font-medium">Push Notifications</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="push-messages" defaultChecked />
                    <Label htmlFor="push-messages" className="text-sm">New messages</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="push-mentions" defaultChecked />
                    <Label htmlFor="push-mentions" className="text-sm">Mentions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="push-updates" />
                    <Label htmlFor="push-updates" className="text-sm">Product updates</Label>
                  </div>
                </div>
              </div>
            )}

            {profile.notification_preferences?.sms && (
              <div className="space-y-3 border rounded-md p-4">
                <h4 className="font-medium">SMS Notifications</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sms-messages" defaultChecked />
                    <Label htmlFor="sms-messages" className="text-sm">New messages</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sms-security" defaultChecked />
                    <Label htmlFor="sms-security" className="text-sm">Security alerts</Label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
