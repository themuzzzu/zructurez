
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "@/components/ThemeProvider";
import { type Theme } from "@/components/ThemeProvider";
import { Loader2, Check, Info } from "lucide-react";
import { debounce } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  
  // Internal UI state to prevent unnecessary reloads
  const [displayedFontSize, setDisplayedFontSize] = useState(fontSize);
  
  // UI color state
  const [uiColor, setUiColor] = useState(() => {
    const savedColor = localStorage.getItem("appUiColor");
    return savedColor || "default";
  });

  // Preview color state
  const [previewColor, setPreviewColor] = useState(uiColor);
  const [showColorPreview, setShowColorPreview] = useState(false);
  
  // Create a ref to track if this is initial mount
  const initialMount = useRef(true);

  // Sync theme with profile preference on component mount
  useEffect(() => {
    if (profile?.theme_preference) {
      setTheme(profile.theme_preference as Theme);
    }
  }, [profile?.theme_preference, setTheme]);

  // Debounced function to update font size
  const debouncedFontSizeUpdate = useRef(
    debounce((size: number) => {
      document.documentElement.style.fontSize = `${size}%`;
      localStorage.setItem("appFontSize", size.toString());
      setFontSize(size);
      
      // Save font size preference to profile without causing a reload
      if (updateProfile) {
        updateProfile({
          display_preferences: {
            ...profile?.display_preferences,
            font_size: size
          }
        });
      }
    }, 400)
  ).current;
  
  // Apply font size immediately on initial load, but use debounce for changes
  useEffect(() => {
    if (initialMount.current) {
      document.documentElement.style.fontSize = `${fontSize}%`;
      initialMount.current = false;
    }
  }, [fontSize]);
  
  // Apply UI color changes
  useEffect(() => {
    // Remove existing color classes
    document.documentElement.classList.remove("ui-purple", "ui-red", "ui-yellow", "ui-green", "ui-blue");
    
    // Add the selected color class if not default
    if (uiColor !== "default") {
      document.documentElement.classList.add(`ui-${uiColor}`);
    }
    
    localStorage.setItem("appUiColor", uiColor);
    
    // If the profile exists, update display preferences
    if (profile && updateProfile) {
      updateProfile({
        display_preferences: {
          ...profile.display_preferences,
          ui_color: uiColor
        }
      });
    }
  }, [uiColor, profile, updateProfile]);

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
    setDisplayedFontSize(newSize);
    debouncedFontSizeUpdate(newSize);
  };
  
  const handleUiColorChange = (value: string) => {
    if (!value) return;
    
    // Set preview color
    setPreviewColor(value);
    setShowColorPreview(true);
  };
  
  const applyPreviewColor = () => {
    setUiColor(previewColor);
    setShowColorPreview(false);
    toast.success(
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4" />
        <span>UI color set to {previewColor === "default" ? "default" : previewColor}</span>
      </div>
    );
  };
  
  const cancelPreviewColor = () => {
    setPreviewColor(uiColor);
    setShowColorPreview(false);
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Font Size</h3>
            <span className="text-sm bg-muted px-2 py-1 rounded">
              {displayedFontSize}%
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Small</span>
              <span>Normal</span>
              <span>Large</span>
            </div>
            <Slider
              value={[displayedFontSize]}
              min={75}
              max={150}
              step={5}
              onValueChange={handleFontSizeChange}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">UI Color</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Changes the accent color of the application</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="space-y-4">
            <ToggleGroup 
              type="single" 
              value={showColorPreview ? previewColor : uiColor}
              onValueChange={handleUiColorChange}
              className="justify-start flex-wrap gap-2"
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
              <ToggleGroupItem value="green" className="px-3 py-2 bg-green-500 text-white hover:text-white hover:bg-green-600 data-[state=on]:bg-green-700">
                Green
              </ToggleGroupItem>
              <ToggleGroupItem value="blue" className="px-3 py-2 bg-blue-500 text-white hover:text-white hover:bg-blue-600 data-[state=on]:bg-blue-700">
                Blue
              </ToggleGroupItem>
            </ToggleGroup>
            
            {/* Preview area - only shown when selecting a new color */}
            {showColorPreview && (
              <div className="mt-4 p-4 rounded-lg border border-border animate-fade-in">
                <h4 className="font-medium mb-2">Color Preview</h4>
                <div className={`p-4 rounded-lg ${
                  previewColor === "default" ? "bg-primary" : 
                  previewColor === "purple" ? "bg-purple-500" :
                  previewColor === "red" ? "bg-red-500" :
                  previewColor === "yellow" ? "bg-amber-400" :
                  previewColor === "green" ? "bg-green-500" :
                  "bg-blue-500"
                } text-white`}>
                  <p>This is how buttons and accents will look</p>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button 
                    onClick={applyPreviewColor}
                    className="flex-1"
                  >
                    Apply this color
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={cancelPreviewColor}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
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
            <Label htmlFor="online-status">Show online status</Label>
            <Switch id="online-status" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-effects">Enable sound effects</Label>
            <Switch id="sound-effects" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
