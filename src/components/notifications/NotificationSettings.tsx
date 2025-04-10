
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/hooks/useProfile";
import { Loader2, BellRing } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { toast } from "sonner";
import { useEffect } from "react";

export const NotificationSettings = () => {
  const { profile, loading, updateNotificationPreferences } = useProfile();
  const { 
    permission, 
    requestPermission, 
    isSupported, 
    loading: permissionLoading 
  } = usePushNotifications();

  useEffect(() => {
    // Initialize push notification permission value
    if (permission === 'granted' && profile?.notification_preferences) {
      if (!profile.notification_preferences.push) {
        updateNotificationPreferences('push', true);
      }
    }
  }, [permission, profile?.notification_preferences?.push]);

  const handleNotificationToggle = (channel: "email" | "sms" | "push", checked: boolean) => {
    updateNotificationPreferences(channel, checked);
  };

  const handleEnablePush = async () => {
    try {
      await requestPermission();
      updateNotificationPreferences("push", true);
      toast.success("Push notifications enabled");
    } catch (error) {
      console.error("Error enabling push:", error);
      toast.error("Failed to enable push notifications");
    }
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
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                {!isSupported && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Not supported in this browser
                  </p>
                )}
              </div>
              
              {isSupported ? (
                permission === 'granted' ? (
                  <Switch 
                    id="push-notifications"
                    checked={profile.notification_preferences?.push || false}
                    onCheckedChange={(checked) => handleNotificationToggle("push", checked)}
                  />
                ) : (
                  <Button 
                    onClick={handleEnablePush} 
                    size="sm" 
                    disabled={permissionLoading || permission === 'denied'}
                    className="flex items-center gap-2"
                  >
                    <BellRing className="h-4 w-4" />
                    {permission === 'denied' ? 'Permission Denied' : 'Enable Push'}
                  </Button>
                )
              ) : (
                <Switch id="push-notifications" disabled />
              )}
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
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email-orders" defaultChecked />
                    <Label htmlFor="email-orders" className="text-sm">Order notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email-bookings" defaultChecked />
                    <Label htmlFor="email-bookings" className="text-sm">Booking confirmations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email-promos" defaultChecked />
                    <Label htmlFor="email-promos" className="text-sm">Promotional offers</Label>
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
                  <div className="flex items-center space-x-2">
                    <Checkbox id="push-orders" defaultChecked />
                    <Label htmlFor="push-orders" className="text-sm">Order notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="push-bookings" defaultChecked />
                    <Label htmlFor="push-bookings" className="text-sm">Booking confirmations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="push-promos" defaultChecked />
                    <Label htmlFor="push-promos" className="text-sm">Promotional offers</Label>
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
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sms-orders" defaultChecked />
                    <Label htmlFor="sms-orders" className="text-sm">Order notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sms-bookings" defaultChecked />
                    <Label htmlFor="sms-bookings" className="text-sm">Booking confirmations</Label>
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
