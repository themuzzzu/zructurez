
import { useState, useRef, useEffect, useMemo } from "react";
import { useSearch } from "@/hooks/useSearch";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
  autoFocus?: boolean;
  className?: string;
  showVoiceSearch?: boolean;
}

export function SearchBar({
  placeholder,
  onSearch,
  showSuggestions = true,
  autoFocus = false,
  className = "",
}: SearchBarProps) {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, language } = useLanguage();
  
  // Create a memoized placeholder to avoid unnecessary re-renders
  const translatedPlaceholder = useMemo(() => {
    return placeholder || `${t("search")}...`;
  }, [placeholder, t]);
  
  const {
    query,
    setQuery,
    suggestions,
    isLoading,
    applySuggestion,
    showSuggestions: showSuggestionsState,
    setShowSuggestions
  } = useSearch({
    suggestionsEnabled: showSuggestions,
  });
  
  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [autoFocus]);
  
  // Handle click outside to close suggestions
  useClickOutside(searchRef, () => {
    setShowSuggestions(false);
  });
  
  // Handle language change to update RTL styling
  useEffect(() => {
    if (!inputRef.current) return;
    
    // Adjust for RTL languages
    const isRTL = language === "urdu";
    if (isRTL) {
      inputRef.current.style.paddingRight = "2.75rem";
      inputRef.current.style.paddingLeft = "3rem";
      inputRef.current.style.textAlign = "right";
      inputRef.current.dir = "rtl";
    } else {
      inputRef.current.style.paddingLeft = "2.75rem";
      inputRef.current.style.paddingRight = "3rem";
      inputRef.current.style.textAlign = "left";
      inputRef.current.dir = "ltr";
    }
  }, [language]);
  
  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Redirect to search page with query parameter
      navigate(`/search?q=${encodeURIComponent(query)}`);
      
      // Also call onSearch if provided
      if (onSearch) {
        onSearch(query);
      }
      
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={searchRef} className={`relative search-bar-container ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <SearchIcon 
          className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400 z-10 ${
            language === "urdu" ? "right-3" : "left-3"
          }`} 
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder={translatedPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => showSuggestions && setShowSuggestions(true)}
          className={`h-12 w-full bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white ${
            language === "urdu" ? "pr-10 pl-16 text-right" : "pl-10 pr-16"
          }`}
          aria-label={t("search")}
          dir={language === "urdu" ? "rtl" : "ltr"}
        />
        
        <div className={`absolute top-1/2 transform -translate-y-1/2 flex items-center gap-1 ${
          language === "urdu" ? "left-3" : "right-3"
        }`}>
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              onClick={() => setQuery("")}
              aria-label={t("clear")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
      
      {/* Suggestions dropdown */}
      {showSuggestionsState && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 shadow-lg overflow-hidden border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <ul className="py-1">
            {suggestions.map((suggestion) => (
              <li 
                key={suggestion.id}
                className={`px-4 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center ${
                  language === "urdu" ? "flex-row-reverse" : "flex-row"
                } justify-between`}
                onClick={() => {
                  applySuggestion(suggestion);
                  navigate(`/search?q=${encodeURIComponent(suggestion.term)}`);
                }}
              >
                <span>{suggestion.term}</span>
                {suggestion.isSponsored && (
                  <Badge variant="outline" className="text-xs border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                    {t("sponsored")}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
