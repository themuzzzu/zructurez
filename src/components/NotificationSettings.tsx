import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const NotificationSettings = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Notification Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Email Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="new-messages">New messages</Label>
              <Switch id="new-messages" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="mentions">Mentions</Label>
              <Switch id="mentions" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="updates">Product updates</Label>
              <Switch id="updates" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Push Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-messages">New messages</Label>
              <Switch id="push-messages" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-mentions">Mentions</Label>
              <Switch id="push-mentions" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-updates">Product updates</Label>
              <Switch id="push-updates" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};