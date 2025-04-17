
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useRef, useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  onSubmit?: (e?: React.FormEvent) => void;
  autoFocus?: boolean;
  disabled?: boolean;
}

export const SearchInput = ({ 
  placeholder = "Search...", 
  value, 
  onChange,
  className,
  onSubmit,
  autoFocus = false,
  disabled = false
}: SearchInputProps) => {
  const { t, language, tDynamic } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [translatedPlaceholder, setTranslatedPlaceholder] = useState<string>("");
  
  // Update the placeholder when language changes
  useEffect(() => {
    // Default to translated placeholder if specific one isn't provided
    const defaultPlaceholder = placeholder === "Search..." ? t("search") + "..." : placeholder;
    setTranslatedPlaceholder(defaultPlaceholder);
    
    // For custom placeholders that aren't in the static translations
    if (placeholder !== "Search..." && language !== "english") {
      const translateCustomPlaceholder = async () => {
        const custom = await tDynamic(placeholder);
        setTranslatedPlaceholder(custom);
      };
      
      translateCustomPlaceholder();
    }
  }, [placeholder, language, t, tDynamic]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };
  
  // Set RTL properties based on language
  const isRTL = language === "urdu";
  
  // Update direction and alignment when language changes
  useEffect(() => {
    if (!inputRef.current) return;
    
    if (isRTL) {
      inputRef.current.dir = "rtl";
    } else {
      inputRef.current.dir = "ltr";
    }
  }, [language, isRTL]);

  return (
    <div className={cn("relative", className)}>
      <Search 
        className={cn(
          "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400 z-10",
          isRTL ? "right-3" : "left-3"
        )} 
      />
      <Input
        ref={inputRef}
        type="search"
        placeholder={translatedPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        disabled={disabled}
        className={cn(
          "w-full bg-transparent focus-visible:ring-2 focus-visible:ring-primary",
          "rounded-md border-muted transition-all duration-200",
          isRTL ? "pr-10 text-right" : "pl-10",
          disabled && "opacity-70 cursor-not-allowed"
        )}
        aria-label={t("search")}
        dir={isRTL ? "rtl" : "ltr"}
        data-translate-placeholder="search"
      />
    </div>
  );
};
