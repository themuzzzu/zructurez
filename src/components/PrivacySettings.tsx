import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const PrivacySettings = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Privacy Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Profile Privacy</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="public-profile">Public profile</Label>
              <Switch id="public-profile" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-email">Show email to others</Label>
              <Switch id="show-email" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-location">Show location</Label>
              <Switch id="show-location" defaultChecked />
            </div>
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