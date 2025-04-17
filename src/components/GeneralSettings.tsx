
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
  { code: "hindi", name: "Hindi / हिन्दी" },
  { code: "telugu", name: "Telugu / తెలుగు" },
  { code: "tamil", name: "Tamil / தமிழ்" },
  { code: "kannada", name: "Kannada / ಕನ್ನಡ" },
  { code: "malayalam", name: "Malayalam / മലയാളം" },
  { code: "urdu", name: "Urdu / اردو" }
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
    
    if (savedFontSize) {
      const parsedSize = parseInt(savedFontSize);
      setFontSize(parsedSize);
      setPreviewFont(parsedSize);
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

  // Handle theme change with immediate global application
  const handleThemeChange = (colorName: string) => {
    setUiTheme(colorName);
    // Apply color globally
    updateDisplayPreferences("ui_color", colorName);
  };

  // Apply language changes to the application
  const handleLanguageChange = (value: string) => {
    // Update in profile settings first
    updateDisplayPreferences("language", value);
    
    // Then update the language in the context
    setLanguage(value as any);
    
    // Show toast with language change notification
    const langName = languages.find(lang => lang.code === value)?.name || value;
    toast.success(`${t("languageChanged")} ${langName}`);
  };

  // Save settings (debounced)
  const saveSettings = debounce(() => {
    setSaving(true);
    
    // Apply the preview font size as the actual setting
    setFontSize(previewFont);
    
    // Update font size
    updateDisplayPreferences("font_size", previewFont).then(() => {
      setSaving(false);
      toast.success(t("settingsSaved"));
    });
  }, 200);

  return (
    <div className="space-y-6">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="bg-muted/50">
          <CardTitle data-translate="generalSettings">{t("generalSettings")}</CardTitle>
          <CardDescription data-translate="manageAccount">
            {t("manageAccount")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          {/* Font Size */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="font-size" className="text-base font-medium" data-translate="fontSize">{t("fontSize")}</Label>
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
              <span data-translate="small">{t("small")}</span>
              <span data-translate="default">{t("default")}</span>
              <span data-translate="large">{t("large")}</span>
            </div>
          </div>
          
          {/* UI Theme Color */}
          <div className="space-y-4">
            <Label htmlFor="theme" className="text-base font-medium" data-translate="themeColor">{t("themeColor")}</Label>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
              {uiColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleThemeChange(color.id)}
                  className={`h-12 rounded-md ${color.class} flex items-center justify-center transition-all ${
                    uiTheme === color.id ? 'ring-2 ring-offset-2 ring-primary' : 'opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Select ${color.name} theme`}
                  data-translate-aria={color.id}
                >
                  {uiTheme === color.id && <Check className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
            <div className="mt-2 p-4 border rounded-md bg-card">
              <p className="text-sm font-medium mb-2" data-translate="preview">{t("preview")}</p>
              <div className={`p-4 rounded-md bg-${uiTheme}-500/20 border border-${uiTheme}-200 dark:border-${uiTheme}-800`}>
                <p className="text-sm" data-translate="previewText">{t("previewText")}</p>
              </div>
            </div>
          </div>
          
          {/* Language Selection */}
          <div className="space-y-3">
            <Label htmlFor="language" className="text-base font-medium" data-translate="language">{t("language")}</Label>
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
              <p className="text-xs text-muted-foreground mt-1 p-2 bg-muted rounded-md" data-translate="translationNote">
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
            <span data-translate={saving ? "saving" : "saveSettings"}>
              {saving ? t("saving") : t("saveSettings")}
            </span>
            <Save className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
