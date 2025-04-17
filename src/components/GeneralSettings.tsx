
import React, { useState, useEffect, useCallback } from "react";
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
    { id: "blue", name: t("blue"), class: "bg-blue-500" },
    { id: "purple", name: t("purple"), class: "bg-purple-500" },
    { id: "red", name: t("red"), class: "bg-red-500" },
    { id: "green", name: t("green"), class: "bg-green-500" },
    { id: "yellow", name: t("yellow"), class: "bg-yellow-500" },
    { id: "pink", name: t("pink"), class: "bg-pink-500" },
    { id: "orange", name: t("orange"), class: "bg-orange-500" },
    { id: "teal", name: t("teal"), class: "bg-teal-500" }
  ];

  // Load saved settings on component mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem("fontSize");
    const savedTheme = localStorage.getItem("uiTheme");
    const savedLanguage = localStorage.getItem("language");
    
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
    }
  }, []);

  // Preview font size changes without saving
  const handleFontSizePreview = (value: number[]) => {
    const newSize = value[0];
    setPreviewFont(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  // Handle theme change with immediate preview and application
  const handleThemeChange = (colorName: string) => {
    setUiTheme(colorName);
    updateDisplayPreferences("ui_color", colorName);
  };

  // Apply language changes to the application
  const handleLanguageChange = (value: string) => {
    // First update the language in the context
    setLanguage(value as any);
    
    // Then update in profile settings which will apply CSS changes and dispatch events
    updateDisplayPreferences("language", value);
    
    // Show toast with language change notification
    const langName = languages.find(lang => lang.code === value)?.name || value;
    toast.success(`${t("languageChanged")} ${langName}`);
    
    // Show temporary language indicator
    showLanguageIndicator(langName);
  };
  
  // Display a language change indicator
  const showLanguageIndicator = useCallback((langName: string) => {
    // Remove any existing indicator
    const existingIndicator = document.querySelector('.language-indicator');
    if (existingIndicator) {
      document.body.removeChild(existingIndicator);
    }
    
    const indicator = document.createElement('div');
    indicator.textContent = `${t("language")}: ${langName}`;
    indicator.style.position = 'fixed';
    indicator.style.bottom = '20px';
    indicator.style.right = '20px';
    indicator.style.padding = '10px';
    indicator.style.backgroundColor = 'var(--primary, #3b82f6)';
    indicator.style.color = 'white';
    indicator.style.borderRadius = '4px';
    indicator.style.zIndex = '9999';
    indicator.style.opacity = '0.9';
    indicator.style.transition = 'opacity 0.5s ease-out';
    indicator.className = 'language-indicator';
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(indicator)) {
          document.body.removeChild(indicator);
        }
      }, 500);
    }, 3000);
  }, [t]);

  // Save settings (debounced)
  const saveSettings = debounce(() => {
    setSaving(true);
    
    // Apply the preview font size as the actual setting
    setFontSize(previewFont);
    
    // Update font size
    updateDisplayPreferences("font_size", previewFont);
    
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
              <div className={`p-4 rounded-md bg-${uiTheme}-500/20 border border-${uiTheme}-200 dark:border-${uiTheme}-800`}>
                <p className="text-sm">{t("previewText")}</p>
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
