
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Save } from "lucide-react";
import { toast } from "sonner";
import { debounce } from "lodash";

export function GeneralSettings() {
  // User settings
  const [fontSize, setFontSize] = useState(100);
  const [language, setLanguage] = useState("english");
  const [uiTheme, setUiTheme] = useState("ui-blue");
  const [saving, setSaving] = useState(false);

  // UI colors available
  const uiColors = [
    { id: "ui-blue", name: "Blue", class: "bg-blue-500" },
    { id: "ui-purple", name: "Purple", class: "bg-purple-500" },
    { id: "ui-red", name: "Red", class: "bg-red-500" },
    { id: "ui-green", name: "Green", class: "bg-green-500" },
    { id: "ui-yellow", name: "Yellow", class: "bg-yellow-500" }
  ];

  // Load saved settings on component mount
  useEffect(() => {
    // Simulate loading saved settings
    const savedFontSize = localStorage.getItem("fontSize");
    const savedLanguage = localStorage.getItem("language");
    const savedTheme = localStorage.getItem("uiTheme");
    
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedTheme) {
      setUiTheme(savedTheme);
      document.documentElement.className = savedTheme;
    }
  }, []);

  // Apply font size changes without reload
  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  // Apply UI theme changes immediately
  const handleThemeChange = (value: string) => {
    setUiTheme(value);
    
    // Remove all theme classes
    uiColors.forEach(color => {
      document.documentElement.classList.remove(color.id);
    });
    
    // Add the selected theme class
    document.documentElement.classList.add(value);
  };

  // Save settings (debounced)
  const saveSettings = debounce(() => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("fontSize", fontSize.toString());
      localStorage.setItem("language", language);
      localStorage.setItem("uiTheme", uiTheme);
      
      toast.success("Settings saved successfully");
      setSaving(false);
    }, 500);
  }, 200);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Manage your account preferences and appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Font Size */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="font-size" className="text-base font-medium">Font Size</Label>
              <span className="text-sm font-medium bg-secondary px-2 py-1 rounded">{fontSize}%</span>
            </div>
            <Slider 
              id="font-size"
              defaultValue={[fontSize]} 
              max={150} 
              min={75} 
              step={5}
              onValueChange={handleFontSizeChange}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small</span>
              <span>Default</span>
              <span>Large</span>
            </div>
          </div>
          
          {/* UI Color Theme */}
          <div className="space-y-4">
            <Label htmlFor="theme" className="text-base font-medium">UI Color</Label>
            <div className="grid grid-cols-5 gap-3">
              {uiColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleThemeChange(color.id)}
                  className={`h-12 rounded-md ${color.class} flex items-center justify-center transition-all ${
                    uiTheme === color.id ? 'ring-2 ring-offset-2 ring-primary' : 'opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Select ${color.name} theme`}
                >
                  {uiTheme === color.id && <Check className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Customize the appearance of your interface
            </p>
          </div>
          
          {/* Language Selection */}
          <div className="space-y-2">
            <Label htmlFor="language" className="text-base font-medium">Language</Label>
            <Select defaultValue={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Save Button */}
          <Button 
            className="w-full" 
            onClick={saveSettings} 
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Settings"}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
