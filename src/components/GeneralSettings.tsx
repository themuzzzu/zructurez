
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

// Simple translations object
const translations = {
  english: {
    generalSettings: "General Settings",
    manageAccount: "Manage your account preferences and appearance",
    fontSize: "Font Size",
    small: "Small",
    default: "Default",
    large: "Large",
    uiColor: "UI Color",
    preview: "Preview",
    previewText: "This is how your selected theme will look",
    language: "Language",
    selectLanguage: "Select language",
    translationNote: "Note: Full translation support is in progress. Some content may still appear in English.",
    saveSettings: "Save Settings",
    saving: "Saving...",
  },
  hindi: {
    generalSettings: "सामान्य सेटिंग्स",
    manageAccount: "अपने खाते की प्राथमिकताओं और उपस्थिति का प्रबंधन करें",
    fontSize: "फ़ॉन्ट आकार",
    small: "छोटा",
    default: "डिफ़ॉल्ट",
    large: "बड़ा",
    uiColor: "यूआई रंग",
    preview: "पूर्वावलोकन",
    previewText: "आपका चयनित थीम ऐसी दिखेगी",
    language: "भाषा",
    selectLanguage: "भाषा चुनें",
    translationNote: "नोट: पूर्ण अनुवाद समर्थन प्रगति पर है। कुछ सामग्री अभी भी अंग्रेजी में दिखाई दे सकती है।",
    saveSettings: "सेटिंग्स सहेजें",
    saving: "सहेज रहा है...",
  },
  telugu: {
    generalSettings: "సాధారణ సెట్టింగ్‌లు",
    manageAccount: "మీ ఖాతా ప్రాధాన్యతలు మరియు రూపాన్ని నిర్వహించండి",
    fontSize: "ఫాంట్ పరిమాణం",
    small: "చిన్నది",
    default: "డిఫాల్ట్",
    large: "పెద్దది",
    uiColor: "UI రంగు",
    preview: "ప్రివ్యూ",
    previewText: "మీ ఎంచుకున్న థీమ్ ఇలా కనిపిస్తుంది",
    language: "భాష",
    selectLanguage: "భాషను ఎంచుకోండి",
    translationNote: "గమనిక: పూర్తి అనువాద మద్దతు ప్రగతిలో ఉంది. కొన్ని విషయాలు ఇంకా ఆంగ్లంలో కనిపించవచ్చు.",
    saveSettings: "సెట్టింగ్‌లను సేవ్ చేయండి",
    saving: "సేవ్ చేస్తోంది...",
  },
  tamil: {
    generalSettings: "பொது அமைப்புகள்",
    manageAccount: "உங்கள் கணக்கு விருப்பங்கள் மற்றும் தோற்றத்தை நிர்வகிக்கவும்",
    fontSize: "எழுத்துரு அளவு",
    small: "சிறியது",
    default: "இயல்புநிலை",
    large: "பெரியது",
    uiColor: "UI நிறம்",
    preview: "முன்னோட்டம்",
    previewText: "நீங்கள் தேர்ந்தெடுத்த தீம் இவ்வாறு தோன்றும்",
    language: "மொழி",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    translationNote: "குறிப்பு: முழு மொழிபெயர்ப்பு ஆதரவு செயல்பாட்டில் உள்ளது. சில உள்ளடக்கம் இன்னும் ஆங்கிலத்தில் தோன்றலாம்.",
    saveSettings: "அமைப்புகளை சேமிக்கவும்",
    saving: "சேமிக்கிறது...",
  },
  kannada: {
    generalSettings: "ಸಾಮಾನ್ಯ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    manageAccount: "ನಿಮ್ಮ ಖಾತೆ ಆದ್ಯತೆಗಳು ಮತ್ತು ಗೋಚರತೆಯನ್ನು ನಿರ್ವಹಿಸಿ",
    fontSize: "ಫಾಂಟ್ ಗಾತ್ರ",
    small: "ಚಿಕ್ಕದು",
    default: "ಡೀಫಾಲ್ಟ್",
    large: "ದೊಡ್ಡದು",
    uiColor: "UI ಬಣ್ಣ",
    preview: "ಪೂರ್ವವೀಕ್ಷಣೆ",
    previewText: "ನೀವು ಆಯ್ಕೆ ಮಾಡಿದ ಥೀಮ್ ಹೀಗೆ ಕಾಣುತ್ತದೆ",
    language: "ಭಾಷೆ",
    selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    translationNote: "ಗಮನಿಸಿ: ಪೂರ್ಣ ಅನುವಾದ ಬೆಂಬಲ ಪ್ರಗತಿಯಲ್ಲಿದೆ. ಕೆಲವು ವಿಷಯಗಳು ಇನ್ನೂ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಕಾಣಿಸಬಹುದು.",
    saveSettings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಉಳಿಸಿ",
    saving: "ಉಳಿಸಲಾಗುತ್ತಿದೆ...",
  },
  malayalam: {
    generalSettings: "പൊതു ക്രമീകരണങ്ങൾ",
    manageAccount: "നിങ്ങളുടെ അക്കൗണ്ട് മുൻഗണനകളും രൂപവും നിയന്ത്രിക്കുക",
    fontSize: "അക്ഷരവലുപ്പം",
    small: "ചെറുത്",
    default: "സ്ഥിരം",
    large: "വലുത്",
    uiColor: "UI നിറം",
    preview: "പ്രിവ്യൂ",
    previewText: "നിങ്ങൾ തിരഞ്ഞെടുത്ത തീം ഇങ്ങനെ കാണപ്പെടും",
    language: "ഭാഷ",
    selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    translationNote: "കുറിപ്പ്: പൂർണ്ണ വിവർത്തന പിന്തുണ പുരോഗതിയിലാണ്. ചില ഉള്ളടക്കങ്ങൾ ഇപ്പോഴും ഇംഗ്ലീഷിൽ ദൃശ്യമായേക്കാം.",
    saveSettings: "ക്രമീകരണങ്ങൾ സേവ് ചെയ്യുക",
    saving: "സേവ് ചെയ്യുന്നു...",
  },
  // Add more languages as needed
};

export function GeneralSettings() {
  // User settings
  const [fontSize, setFontSize] = useState(100);
  const [language, setLanguage] = useState("english");
  const [uiTheme, setUiTheme] = useState("blue");
  const [saving, setSaving] = useState(false);
  const [previewFont, setPreviewFont] = useState(100);
  const { profile, loading, updateProfile } = useProfile();
  const { updateDisplayPreferences } = useProfileSettings(profile, updateProfile);
  const [currentTranslation, setCurrentTranslation] = useState(translations.english);

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

  // Available languages - with Indian languages first after English
  const languages = [
    { code: "english", name: "English" },
    { code: "hindi", name: "Hindi" },
    { code: "telugu", name: "Telugu" },
    { code: "tamil", name: "Tamil" },
    { code: "kannada", name: "Kannada" },
    { code: "malayalam", name: "Malayalam" },
    { code: "spanish", name: "Spanish" },
    { code: "french", name: "French" },
    { code: "german", name: "German" },
    { code: "chinese", name: "Chinese" },
    { code: "japanese", name: "Japanese" }
  ];

  // Load saved settings on component mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem("fontSize");
    const savedLanguage = localStorage.getItem("language");
    const savedTheme = localStorage.getItem("uiTheme");
    
    if (savedFontSize) {
      const parsedSize = parseInt(savedFontSize);
      setFontSize(parsedSize);
      setPreviewFont(parsedSize);
      document.documentElement.style.fontSize = `${parsedSize}%`;
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
      updateCurrentTranslation(savedLanguage);
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
    
    // Set data-language attribute for CSS selectors
    document.documentElement.setAttribute('data-language', language);
  }, []);

  // Update current translation based on selected language
  const updateCurrentTranslation = (langCode) => {
    // If the language exists in our translations, use it, otherwise default to English
    setCurrentTranslation(translations[langCode] || translations.english);
  };

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
  const applyLanguage = (languageCode) => {
    // Update translation context
    updateCurrentTranslation(languageCode);
    
    // Set language on document root
    document.documentElement.lang = languageCode;
    document.documentElement.setAttribute('data-language', languageCode);
    
    // Remove previous language classes
    document.documentElement.classList.forEach(className => {
      if (className.startsWith('lang-')) {
        document.documentElement.classList.remove(className);
      }
    });
    document.documentElement.classList.add(`lang-${languageCode}`);
    
    // Save to localStorage
    localStorage.setItem("language", languageCode);
    
    // Show temporary language indicator
    const langName = languages.find(lang => lang.code === languageCode)?.name || languageCode;
    const indicator = document.createElement('div');
    indicator.textContent = `Language: ${langName}`;
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
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      indicator.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(indicator);
      }, 500);
    }, 3000);
  };

  // Handle language change
  const handleLanguageChange = (value) => {
    setLanguage(value);
    applyLanguage(value);
    
    // Show toast with language change notification
    toast.success(`Language changed to ${languages.find(lang => lang.code === value)?.name}`);
    
    // Update profile settings if profile is available
    if (profile?.id) {
      updateDisplayPreferences("language", value);
    }
  };

  // Save settings (debounced)
  const saveSettings = debounce(() => {
    setSaving(true);
    
    // Apply the preview font size as the actual setting
    setFontSize(previewFont);
    
    // Save to localStorage
    localStorage.setItem("fontSize", previewFont.toString());
    localStorage.setItem("language", language);
    localStorage.setItem("uiTheme", `ui-${uiTheme}`);
    
    // Update profile settings if profile is available
    if (profile?.id) {
      updateDisplayPreferences("font_size", previewFont);
      updateDisplayPreferences("ui_color", uiTheme);
      updateDisplayPreferences("language", language);
    }
    
    // Apply changes immediately
    document.documentElement.style.fontSize = `${previewFont}%`;
    applyTheme(uiTheme);
    applyLanguage(language);
    
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
          <CardTitle>{currentTranslation.generalSettings}</CardTitle>
          <CardDescription>
            {currentTranslation.manageAccount}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Font Size */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="font-size" className="text-base font-medium">{currentTranslation.fontSize}</Label>
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
              <span>{currentTranslation.small}</span>
              <span>{currentTranslation.default}</span>
              <span>{currentTranslation.large}</span>
            </div>
          </div>
          
          {/* UI Color Theme */}
          <div className="space-y-4">
            <Label htmlFor="theme" className="text-base font-medium">{currentTranslation.uiColor}</Label>
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
              <p className="text-sm font-medium mb-2">{currentTranslation.preview}</p>
              <div className={`p-3 rounded-md bg-${uiTheme}-500 bg-opacity-20 text-${uiTheme}-500`}>
                <p className="text-sm">{currentTranslation.previewText}</p>
              </div>
            </div>
          </div>
          
          {/* Language Selection */}
          <div className="space-y-2">
            <Label htmlFor="language" className="text-base font-medium">{currentTranslation.language}</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder={currentTranslation.selectLanguage} />
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
                {currentTranslation.translationNote}
              </p>
            )}
          </div>
          
          {/* Save Button */}
          <Button 
            className="w-full" 
            onClick={saveSettings} 
            disabled={saving}
          >
            {saving ? currentTranslation.saving : currentTranslation.saveSettings}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
