import React, { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t, language } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const translatedPlaceholder = placeholder === "Search..." ? t("search") + "..." : placeholder;
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };
  
  const isRTL = language === "urdu";
  
  useEffect(() => {
    if (!inputRef.current) return;
    
    const handleLanguageChange = () => {
      if (!inputRef.current) return;
      
      if (isRTL) {
        inputRef.current.dir = "rtl";
      } else {
        inputRef.current.dir = "ltr";
      }
    };
    
    handleLanguageChange();
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
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
          "rounded-md border-muted",
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
