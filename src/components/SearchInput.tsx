
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useRef } from "react";

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
  
  // Default to translated placeholder if specific one isn't provided
  const translatedPlaceholder = placeholder === "Search..." ? t("search") + "..." : placeholder;
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };
  
  // Update position of search icon for RTL languages
  useEffect(() => {
    if (!inputRef.current) return;
    
    const isRTL = language === "urdu";
    const input = inputRef.current;
    const parentDiv = input.parentElement;
    
    if (parentDiv) {
      const searchIcon = parentDiv.querySelector('svg');
      if (searchIcon && searchIcon.parentElement) {
        if (isRTL) {
          searchIcon.parentElement.classList.remove('left-3');
          searchIcon.parentElement.classList.add('right-3');
        } else {
          searchIcon.parentElement.classList.add('left-3');
          searchIcon.parentElement.classList.remove('right-3');
        }
      }
    }
  }, [language]);

  return (
    <div className={cn("relative", className)}>
      <Search 
        className={cn(
          "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400 z-10",
          language === "urdu" ? "right-3" : "left-3"
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
          language === "urdu" ? "pr-10 text-right" : "pl-10",
          disabled && "opacity-70 cursor-not-allowed"
        )}
        aria-label={t("search")}
        dir={language === "urdu" ? "rtl" : "ltr"}
      />
    </div>
  );
};
