
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "@/components/ThemeProvider";
import { type Theme } from "@/components/ThemeProvider";
import { Loader2 } from "lucide-react";

export const GeneralSettings = () => {
  const { theme, setTheme } = useTheme();
  const { profile, loading, updateThemePreference, updateProfile } = useProfile();
  const [separateGroupsAndChats, setSeparateGroupsAndChats] = useState(() => {
    const saved = localStorage.getItem("separateGroupsAndChats");
    return saved ? JSON.parse(saved) : false;
  });
  
  // Font size state (default 100%)
  const [fontSize, setFontSize] = useState(() => {
    const savedFontSize = localStorage.getItem("appFontSize");
    return savedFontSize ? parseInt(savedFontSize) : 100;
  });
  
  // UI color state
  const [uiColor, setUiColor] = useState(() => {
    const savedColor = localStorage.getItem("appUiColor");
    return savedColor || "default";
  });

  // Sync theme with profile preference on component mount
  useEffect(() => {
    if (profile?.theme_preference) {
      setTheme(profile.theme_preference as Theme);
    }
  }, [profile?.theme_preference, setTheme]);
  
  // Apply font size to the document root when it changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem("appFontSize", fontSize.toString());
  }, [fontSize]);
  
  // Apply UI color changes
  useEffect(() => {
    // Remove existing color classes
    document.documentElement.classList.remove("ui-purple", "ui-red", "ui-yellow");
    
    // Add the selected color class if not default
    if (uiColor !== "default") {
      document.documentElement.classList.add(`ui-${uiColor}`);
    }
    
    localStorage.setItem("appUiColor", uiColor);
  }, [uiColor]);

  const handleThemeChange = async (value: Theme) => {
    setTheme(value);
    if (updateThemePreference) {
      try {
        await updateThemePreference(value);
        toast.success(`Theme changed to ${value} mode`);
      } catch (error) {
        console.error("Failed to update theme preference:", error);
        toast.error("Failed to update theme preference");
      }
    }
  };

  const handleSeparateGroupsChange = (checked: boolean) => {
    setSeparateGroupsAndChats(checked);
    localStorage.setItem("separateGroupsAndChats", JSON.stringify(checked));
    toast.success(`Messages view ${checked ? 'separated' : 'combined'}`);
  };
  
  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    
    // Save font size preference to profile
    if (updateProfile) {
      updateProfile({
        display_preferences: {
          ...profile?.display_preferences,
          font_size: newSize
        }
      });
    }
  };
  
  const handleUiColorChange = (value: string) => {
    if (!value) return;
    setUiColor(value);
    
    // Save UI color preference to profile
    if (updateProfile) {
      updateProfile({
        display_preferences: {
          ...profile?.display_preferences,
          ui_color: value
        }
      });
    }
    
    toast.success(`UI color set to ${value === "default" ? "default" : value}`);
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
          <h3 className="text-lg font-semibold">Font Size</h3>
          <div className="space-y-6">
            <div className="flex justify-between">
              <span>Small</span>
              <span>Normal</span>
              <span>Large</span>
            </div>
            <Slider
              defaultValue={[fontSize]}
              min={75}
              max={150}
              step={5}
              onValueChange={handleFontSizeChange}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Current size: {fontSize}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">UI Color</h3>
          <ToggleGroup 
            type="single" 
            value={uiColor}
            onValueChange={handleUiColorChange}
            className="justify-start"
          >
            <ToggleGroupItem value="default" className="px-3 py-2">
              Default
            </ToggleGroupItem>
            <ToggleGroupItem value="purple" className="px-3 py-2 bg-purple-500 text-white hover:text-white hover:bg-purple-600 data-[state=on]:bg-purple-700">
              Purple
            </ToggleGroupItem>
            <ToggleGroupItem value="red" className="px-3 py-2 bg-red-500 text-white hover:text-white hover:bg-red-600 data-[state=on]:bg-red-700">
              Red
            </ToggleGroupItem>
            <ToggleGroupItem value="yellow" className="px-3 py-2 bg-amber-400 text-black hover:text-black hover:bg-amber-500 data-[state=on]:bg-amber-600">
              Golden
            </ToggleGroupItem>
          </ToggleGroup>
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
