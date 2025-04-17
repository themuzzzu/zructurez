
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
  const [previewFont, setPreviewFont] = useState(100);

  // UI colors available
  const uiColors = [
    { id: "ui-blue", name: "Blue", class: "bg-blue-500" },
    { id: "ui-purple", name: "Purple", class: "bg-purple-500" },
    { id: "ui-red", name: "Red", class: "bg-red-500" },
    { id: "ui-green", name: "Green", class: "bg-green-500" },
    { id: "ui-yellow", name: "Yellow", class: "bg-yellow-500" },
    { id: "ui-pink", name: "Pink", class: "bg-pink-500" },
    { id: "ui-orange", name: "Orange", class: "bg-orange-500" },
    { id: "ui-teal", name: "Teal", class: "bg-teal-500" }
  ];

  // Available languages
  const languages = [
    { code: "english", name: "English" },
    { code: "spanish", name: "Spanish" },
    { code: "french", name: "French" },
    { code: "german", name: "German" },
    { code: "chinese", name: "Chinese" },
    { code: "japanese", name: "Japanese" },
    { code: "telugu", name: "Telugu" },
    { code: "tamil", name: "Tamil" },
    { code: "kannada", name: "Kannada" },
    { code: "hindi", name: "Hindi" },
    { code: "malayalam", name: "Malayalam" }
  ];

  // Load saved settings on component mount
  useEffect(() => {
    // Load saved settings
    const savedFontSize = localStorage.getItem("fontSize");
    const savedLanguage = localStorage.getItem("language");
    const savedTheme = localStorage.getItem("uiTheme");
    
    if (savedFontSize) {
      const parsedSize = parseInt(savedFontSize);
      setFontSize(parsedSize);
      setPreviewFont(parsedSize);
      document.documentElement.style.fontSize = `${parsedSize}%`;
    }
    
    if (savedLanguage) setLanguage(savedLanguage);
    
    if (savedTheme) {
      setUiTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  // Apply UI theme changes immediately
  const applyTheme = (themeId: string) => {
    // Remove all theme classes
    uiColors.forEach(color => {
      document.documentElement.classList.remove(color.id);
    });
    
    // Add the selected theme class
    document.documentElement.classList.add(themeId);
    
    // Save to localStorage for persistence across page reloads
    localStorage.setItem("uiTheme", themeId);
    
    // Update CSS variables for theme color
    const selectedColor = uiColors.find(color => color.id === themeId);
    if (selectedColor) {
      const colorClass = selectedColor.class.replace('bg-', '');
      document.documentElement.style.setProperty('--theme-color', colorClass);
    }
  };

  // Preview font size changes without saving
  const handleFontSizePreview = (value: number[]) => {
    const newSize = value[0];
    setPreviewFont(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  // Handle theme change with immediate preview
  const handleThemeChange = (value: string) => {
    setUiTheme(value);
    applyTheme(value);
  };

  // Handle language change
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem("language", value);
    
    // Show toast with language change notification
    toast.success(`Language changed to ${languages.find(lang => lang.code === value)?.name}`);
    
    // In a real app, this would trigger language context updates
    // or API calls to fetch translations
  };

  // Save settings (debounced)
  const saveSettings = debounce(() => {
    setSaving(true);
    
    // Apply the preview font size as the actual setting
    setFontSize(previewFont);
    
    // Save to localStorage
    localStorage.setItem("fontSize", previewFont.toString());
    localStorage.setItem("language", language);
    localStorage.setItem("uiTheme", uiTheme);
    
    // Simulate API call
    setTimeout(() => {
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
              <span className="text-sm font-medium bg-secondary px-2 py-1 rounded">{previewFont}%</span>
            </div>
            <Slider 
              id="font-size"
              defaultValue={[previewFont]} 
              value={[previewFont]}
              max={150} 
              min={75} 
              step={5}
              onValueChange={handleFontSizePreview}
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
            <div className="grid grid-cols-4 gap-3">
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
            <div className="mt-2 p-3 border rounded-md bg-background">
              <p className="text-sm font-medium mb-2">Preview</p>
              <div className={`p-3 rounded-md ${uiColors.find(c => c.id === uiTheme)?.class.replace('bg-', 'bg-opacity-20 text-')}`}>
                <p className="text-sm">This is how your selected theme will look</p>
              </div>
            </div>
          </div>
          
          {/* Language Selection */}
          <div className="space-y-2">
            <Label htmlFor="language" className="text-base font-medium">Language</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {language !== "english" && (
              <p className="text-xs text-muted-foreground mt-1">
                Note: Full translation support is in progress. Some content may still appear in English.
              </p>
            )}
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
