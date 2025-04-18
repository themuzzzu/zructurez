import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
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
  const [fontSize, setFontSize] = useState(100);
  const [uiTheme, setUiTheme] = useState("blue");
  const [saving, setSaving] = useState(false);
  const { profile, updateProfile } = useProfile();
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
      document.documentElement.style.fontSize = `${parsedSize}%`;
    }
    
    if (savedTheme) {
      const colorName = savedTheme.replace('ui-', '');
      setUiTheme(colorName);
      applyThemeColor(colorName);
    }
  }, []);

  const applyThemeColor = (colorName: string) => {
    document.documentElement.classList.forEach(className => {
      if (className.startsWith('ui-')) {
        document.documentElement.classList.remove(className);
      }
    });
    document.documentElement.classList.add(`ui-${colorName}`);
    localStorage.setItem("uiTheme", `ui-${colorName}`);
    updateDisplayPreferences("ui_color", colorName);
  };

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
    localStorage.setItem("fontSize", newSize.toString());
    updateDisplayPreferences("font_size", newSize);
  };

  const handleThemeChange = (colorName: string) => {
    setUiTheme(colorName);
    applyThemeColor(colorName);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as any);
    localStorage.setItem("language", value);
    updateDisplayPreferences("language", value);
  };

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto px-4">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="bg-muted/50">
          <CardTitle>{t("generalSettings")}</CardTitle>
          <CardDescription>{t("manageAccount")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-4 sm:p-6">
          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="font-size" className="text-base font-medium">{t("fontSize")}</Label>
              <span className="text-sm font-medium bg-secondary px-2 py-1 rounded-full">{fontSize}%</span>
            </div>
            <Slider 
              id="font-size"
              value={[fontSize]}
              max={150} 
              min={75} 
              step={5}
              onValueChange={handleFontSizeChange}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t("small")}</span>
              <span>{t("default")}</span>
              <span>{t("large")}</span>
            </div>
          </div>
          
          {/* UI Theme Color */}
          <div className="space-y-3">
            <Label className="text-base font-medium">{t("themeColor")}</Label>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {uiColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleThemeChange(color.id)}
                  className={`h-10 sm:h-12 rounded-md ${color.class} flex items-center justify-center transition-all ${
                    uiTheme === color.id ? 'ring-2 ring-offset-2 ring-primary' : 'opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Select ${color.name} theme`}
                />
              ))}
            </div>
          </div>
          
          {/* Language Selection */}
          <div className="space-y-3">
            <Label htmlFor="language" className="text-base font-medium">{t("language")}</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectLanguage")} />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
