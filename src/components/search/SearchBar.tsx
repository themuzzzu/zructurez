
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
import { SearchSuggestion } from "@/types/search";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
  autoFocus?: boolean;
  className?: string;
  showVoiceSearch?: boolean;
}

// Define a type that matches our component's expectations
interface TranslatedSuggestion {
  id: string;
  term: string;
  isSponsored: boolean;
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
  const { t, tDynamic, language } = useLanguage();
  const [translatedPlaceholder, setTranslatedPlaceholder] = useState<string>("");
  
  // Load the search state
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
  
  // Update the placeholder when language changes
  useEffect(() => {
    // Default placeholder text
    const defaultText = `${t("search")}...`;
    setTranslatedPlaceholder(placeholder || defaultText);
    
    // For custom placeholders that aren't in the static translations
    if (placeholder && placeholder !== "Search..." && language !== "english") {
      const translateCustomPlaceholder = async () => {
        try {
          const custom = await tDynamic(placeholder);
          setTranslatedPlaceholder(custom);
        } catch (error) {
          console.error("Error translating placeholder:", error);
          setTranslatedPlaceholder(placeholder); 
        }
      };
      
      translateCustomPlaceholder();
    }
  }, [placeholder, language, t, tDynamic]);
  
  // Set RTL properties based on language
  const isRTL = language === "urdu";
  
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
  
  // Update direction and alignment when language changes
  useEffect(() => {
    if (!inputRef.current) return;
    
    if (isRTL) {
      inputRef.current.dir = "rtl";
      inputRef.current.style.textAlign = "right";
    } else {
      inputRef.current.dir = "ltr";
      inputRef.current.style.textAlign = "left";
    }
  }, [language, isRTL]);
  
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

  // Translate suggestion items asynchronously - FIX: Changed type to work with optional isSponsored
  const [translatedSuggestions, setTranslatedSuggestions] = useState<TranslatedSuggestion[]>([]);
  
  // Update translations for suggestions when they change
  useEffect(() => {
    if (!suggestions.length || language === 'english') {
      // FIX: Convert suggestions to match our required TranslatedSuggestion type
      const formattedSuggestions: TranslatedSuggestion[] = suggestions.map(suggestion => ({
        ...suggestion,
        isSponsored: suggestion.isSponsored || false // Provide default value for optional property
      }));
      setTranslatedSuggestions(formattedSuggestions);
      return;
    }
    
    // Only translate if not in English
    const translateSuggestions = async () => {
      // FIX: Map each suggestion and ensure isSponsored is always defined
      const translated = await Promise.all(
        suggestions.map(async (suggestion) => ({
          id: suggestion.id,
          term: await tDynamic(suggestion.term),
          isSponsored: suggestion.isSponsored || false // Provide default value for optional property
        }))
      );
      setTranslatedSuggestions(translated);
    };
    
    translateSuggestions();
  }, [suggestions, language, tDynamic]);

  return (
    <div ref={searchRef} className={`relative search-bar-container ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <SearchIcon 
          className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400 z-10 ${
            isRTL ? "right-3" : "left-3"
          }`} 
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder={translatedPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => showSuggestions && setShowSuggestions(true)}
          className={`h-12 w-full bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white transition-all duration-200 ${
            isRTL ? "pr-10 pl-16 text-right" : "pl-10 pr-16"
          }`}
          aria-label={t("search")}
          dir={isRTL ? "rtl" : "ltr"}
          data-translate-placeholder="search"
        />
        
        <div className={`absolute top-1/2 transform -translate-y-1/2 flex items-center gap-1 ${
          isRTL ? "left-3" : "right-3"
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
      {showSuggestionsState && translatedSuggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 shadow-lg overflow-hidden border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <ul className="py-1">
            {translatedSuggestions.map((suggestion) => (
              <li 
                key={suggestion.id}
                className={`px-4 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center ${
                  isRTL ? "flex-row-reverse" : "flex-row"
                } justify-between`}
                onClick={() => {
                  // Use the original suggestion for search but display translated term
                  const originalSuggestion = suggestions.find(s => s.id === suggestion.id);
                  if (originalSuggestion) {
                    applySuggestion(originalSuggestion);
                    navigate(`/search?q=${encodeURIComponent(originalSuggestion.term)}`);
                  }
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
