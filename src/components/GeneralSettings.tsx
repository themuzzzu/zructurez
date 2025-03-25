
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "@/components/ThemeProvider";
import { type Theme } from "@/components/ThemeProvider";
import { Loader2 } from "lucide-react";

export const GeneralSettings = () => {
  const { theme, setTheme } = useTheme();
  const { profile, loading, updateThemePreference } = useProfile();
  const [separateGroupsAndChats, setSeparateGroupsAndChats] = useState(() => {
    const saved = localStorage.getItem("separateGroupsAndChats");
    return saved ? JSON.parse(saved) : false;
  });

  // Sync theme with profile preference on component mount
  useEffect(() => {
    if (profile?.theme_preference) {
      setTheme(profile.theme_preference as Theme);
    }
  }, [profile?.theme_preference, setTheme]);

  const handleThemeChange = async (value: Theme) => {
    setTheme(value);
    if (updateThemePreference) {
      await updateThemePreference(value);
      toast.success(`Theme changed to ${value} mode`);
    }
  };

  const handleSeparateGroupsChange = (checked: boolean) => {
    setSeparateGroupsAndChats(checked);
    localStorage.setItem("separateGroupsAndChats", JSON.stringify(checked));
    toast.success(`Messages view ${checked ? 'separated' : 'combined'}`);
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
        <CardTitle className="text-2xl font-bold">General Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Appearance</h3>
          <RadioGroup
            value={theme}
            onValueChange={handleThemeChange}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System Default</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Messages Preferences</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="separate-groups">Separate groups and chats</Label>
            <Switch 
              id="separate-groups" 
              checked={separateGroupsAndChats}
              onCheckedChange={handleSeparateGroupsChange}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Other Preferences</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Show online status</Label>
            <Switch id="email-notifications" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing-emails">Enable sound effects</Label>
            <Switch id="marketing-emails" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
