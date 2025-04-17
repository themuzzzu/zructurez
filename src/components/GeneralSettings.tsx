
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Save } from "lucide-react";
import { toast } from "sonner";
import { debounce } from "lodash";
import { useProfileSettings } from "@/hooks/profile/useProfileSettings";
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/contexts/LanguageContext";

// Available languages - with Indian languages first after English
const languages = [
  { code: "english", name: "English" },
  { code: "hindi", name: "Hindi" },
  { code: "telugu", name: "Telugu" },
  { code: "tamil", name: "Tamil" },
  { code: "kannada", name: "Kannada" },
  { code: "malayalam", name: "Malayalam" }
];

export function GeneralSettings() {
  // User settings
  const [fontSize, setFontSize] = useState(100);
  const [uiTheme, setUiTheme] = useState("blue");
  const [saving, setSaving] = useState(false);
  const [previewFont, setPreviewFont] = useState(100);
  const { profile, loading, updateProfile } = useProfile();
  const { updateDisplayPreferences } = useProfileSettings(profile, updateProfile);
  const { language, setLanguage, t } = useLanguage();

  // UI colors available
  const uiColors = [
    { id: "blue", name: "Blue", class: "bg-blue-500" },
    { id: "purple", name: "Purple", class: "bg-purple-500" },
    { id: "red", name: "Red", class: "bg-red-500" },
    { id: "green", name: "Green", class: "bg-green-500" },
    { id: "yellow", name: "Yellow", class: "bg-yellow-500" },
    { id: "pink", name: "Pink", class: "bg-pink-500" },
    { id: "orange", name: "Orange", class: "bg-orange-500" },
    { id: "teal", name: "Teal", class: "bg-teal-500" }
  ];

  // Load saved settings on component mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem("fontSize");
    const savedTheme = localStorage.getItem("uiTheme");
    
    if (savedFontSize) {
      const parsedSize = parseInt(savedFontSize);
      setFontSize(parsedSize);
      setPreviewFont(parsedSize);
      document.documentElement.style.fontSize = `${parsedSize}%`;
    }
    
    if (savedTheme) {
      // Extract color name from theme class (ui-blue -> blue)
      const colorName = savedTheme.replace('ui-', '');
      setUiTheme(colorName);
      applyTheme(colorName);
    } else {
      // If no theme is set, apply the default
      applyTheme("blue");
    }
  }, []);

  // Apply UI theme changes immediately
  const applyTheme = (colorName) => {
    const themeId = `ui-${colorName}`;
    
    document.documentElement.classList.forEach(className => {
      if (className.startsWith('ui-')) {
        document.documentElement.classList.remove(className);
      }
    });
    
    document.documentElement.classList.add(themeId);
    localStorage.setItem("uiTheme", themeId);
    
    // Set CSS variables for the theme color
    document.documentElement.style.setProperty('--theme-color', colorName);
    
    // Trigger a custom event for theme changes
    window.dispatchEvent(new CustomEvent('themeColorChanged', { 
      detail: { themeColor: colorName }
    }));
  };

  // Preview font size changes without saving
  const handleFontSizePreview = (value) => {
    const newSize = value[0];
    setPreviewFont(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  // Handle theme change with immediate preview
  const handleThemeChange = (colorName) => {
    setUiTheme(colorName);
    applyTheme(colorName);
    
    if (profile?.id) {
      updateDisplayPreferences("ui_color", colorName);
    }
  };

  // Apply language changes to the application
  const handleLanguageChange = (value) => {
    // Update the language context which handles all the translations
    setLanguage(value);
    
    // Show toast with language change notification
    const langName = languages.find(lang => lang.code === value)?.name || value;
    toast.success(`${t("languageChanged")} ${langName}`);
    
    // Update profile settings if profile is available
    if (profile?.id) {
      updateDisplayPreferences("language", value);
    }
    
    // Show temporary language indicator
    showLanguageIndicator(langName);
  };
  
  // Display a language change indicator
  const showLanguageIndicator = (langName) => {
    const indicator = document.createElement('div');
    indicator.textContent = `${t("language")}: ${langName}`;
    indicator.style.position = 'fixed';
    indicator.style.bottom = '20px';
    indicator.style.right = '20px';
    indicator.style.padding = '10px';
    indicator.style.backgroundColor = 'var(--primary)';
    indicator.style.color = 'var(--primary-foreground)';
    indicator.style.borderRadius = '4px';
    indicator.style.zIndex = '9999';
    indicator.style.opacity = '0.9';
    indicator.style.transition = 'opacity 0.5s ease-out';
    indicator.className = 'language-indicator';
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(indicator);
      }, 500);
    }, 3000);
  };

  // Save settings (debounced)
  const saveSettings = debounce(() => {
    setSaving(true);
    
    // Apply the preview font size as the actual setting
    setFontSize(previewFont);
    
    // Save to localStorage
    localStorage.setItem("fontSize", previewFont.toString());
    localStorage.setItem("uiTheme", `ui-${uiTheme}`);
    
    // Update profile settings if profile is available
    if (profile?.id) {
      updateDisplayPreferences("font_size", previewFont);
      updateDisplayPreferences("ui_color", uiTheme);
    }
    
    // Apply changes immediately
    document.documentElement.style.fontSize = `${previewFont}%`;
    applyTheme(uiTheme);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(t("settingsSaved"));
      setSaving(false);
    }, 500);
  }, 200);

  return (
    <div className="space-y-6">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="bg-muted/50">
          <CardTitle>{t("generalSettings")}</CardTitle>
          <CardDescription>
            {t("manageAccount")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          {/* Font Size */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="font-size" className="text-base font-medium">{t("fontSize")}</Label>
              <span className="text-sm font-medium bg-secondary px-2 py-1 rounded-full">{previewFont}%</span>
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
              <span>{t("small")}</span>
              <span>{t("default")}</span>
              <span>{t("large")}</span>
            </div>
          </div>
          
          {/* UI Theme Color */}
          <div className="space-y-4">
            <Label htmlFor="theme" className="text-base font-medium">{t("themeColor")}</Label>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
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
            <div className="mt-2 p-4 border rounded-md bg-card">
              <p className="text-sm font-medium mb-2">{t("preview")}</p>
              <div className={`p-4 rounded-md bg-${uiTheme}-500 bg-opacity-20 border border-${uiTheme}-200 dark:border-${uiTheme}-800`}>
                <p className="text-sm text-${uiTheme}-700 dark:text-${uiTheme}-300">{t("previewText")}</p>
              </div>
            </div>
          </div>
          
          {/* Language Selection */}
          <div className="space-y-3">
            <Label htmlFor="language" className="text-base font-medium">{t("language")}</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder={t("selectLanguage")} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="cursor-pointer">
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {language !== "english" && (
              <p className="text-xs text-muted-foreground mt-1 p-2 bg-muted rounded-md">
                {t("translationNote")}
              </p>
            )}
          </div>
          
          {/* Save Button */}
          <Button 
            className="w-full h-11 font-medium text-base flex items-center justify-center gap-2" 
            onClick={saveSettings} 
            disabled={saving}
          >
            {saving ? t("saving") : t("saveSettings")}
            <Save className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
