
import { useState, useRef, useEffect } from "react";
import { useSearch } from "@/hooks/useSearch";
import { Search as SearchIcon, X, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useNavigate } from "react-router-dom";
import { VoiceSearchRecorder } from "./VoiceSearchRecorder";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
  autoFocus?: boolean;
  className?: string;
  showVoiceSearch?: boolean;
}

export function SearchBar({
  placeholder = "Search...",
  onSearch,
  showSuggestions = true,
  autoFocus = false,
  className = "",
  showVoiceSearch = false,
}: SearchBarProps) {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  
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
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Handle click outside to close suggestions
  useClickOutside(searchRef, () => {
    setShowSuggestions(false);
  });
  
  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
      setShowSuggestions(false);
    }
  };
  
  // Handle voice search result
  const handleVoiceSearchResult = (transcript: string) => {
    setQuery(transcript);
    setIsVoiceSearchOpen(false);
    
    if (transcript.trim() && onSearch) {
      onSearch(transcript);
    } else if (transcript.trim()) {
      navigate(`/search?q=${encodeURIComponent(transcript)}`);
    }
  };
  
  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400 z-10" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => showSuggestions && setShowSuggestions(true)}
          className="pl-10 pr-16 h-12 w-full bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              onClick={() => setQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {showVoiceSearch && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              onClick={() => setIsVoiceSearchOpen(true)}
            >
              <Mic className="h-4 w-4" />
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
                className="px-4 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between"
                onClick={() => applySuggestion(suggestion)}
              >
                <span>{suggestion.term}</span>
                {suggestion.isSponsored && (
                  <Badge variant="outline" className="text-xs border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                    Sponsored
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
      
      {/* Voice search modal */}
      {isVoiceSearchOpen && (
        <VoiceSearchRecorder 
          onClose={() => setIsVoiceSearchOpen(false)}
          onTranscriptionComplete={handleVoiceSearchResult}
        />
      )}
    </div>
  );
};
