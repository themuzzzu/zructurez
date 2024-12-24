import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { type Theme } from "@/components/ThemeProvider";

export const GeneralSettings = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (value: Theme) => {
    setTheme(value);
    toast.success(`Theme changed to ${value} mode`);
  };

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
          <h3 className="text-lg font-semibold">Preferences</h3>
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