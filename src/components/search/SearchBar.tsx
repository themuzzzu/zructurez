
import { useState, useRef, useEffect } from "react";
import { useSearch } from "@/hooks/useSearch";
import { Search as SearchIcon, X, Mic, Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useNavigate } from "react-router-dom";
import { VoiceSearchRecorder } from "./VoiceSearchRecorder";
import { ImageSearchUploader } from "./ImageSearchUploader";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
  autoFocus?: boolean;
  className?: string;
  showVoiceSearch?: boolean;
  showImageSearch?: boolean;
}

export function SearchBar({
  placeholder = "Search...",
  onSearch,
  showSuggestions = true,
  autoFocus = false,
  className = "",
  showVoiceSearch = false,
  showImageSearch = false,
}: SearchBarProps) {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  
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
    }
  };
  
  // Handle image search result
  const handleImageSearchResult = (description: string) => {
    setQuery(description);
    setIsImageSearchOpen(false);
    
    if (description.trim() && onSearch) {
      onSearch(description);
    }
  };
  
  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => showSuggestions && setShowSuggestions(true)}
          className="pl-10 pr-16 h-11 w-full bg-white dark:bg-zinc-800"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
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
              className="h-7 w-7"
              onClick={() => setIsVoiceSearchOpen(true)}
            >
              <Mic className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          
          {showImageSearch && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsImageSearchOpen(true)}
            >
              <Image className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      </form>
      
      {/* Suggestions dropdown */}
      {showSuggestionsState && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 shadow-lg overflow-hidden">
          <ul className="py-1">
            {suggestions.map((suggestion) => (
              <li 
                key={suggestion.id}
                className="px-4 py-2 cursor-pointer hover:bg-accent flex items-center justify-between"
                onClick={() => applySuggestion(suggestion)}
              >
                <span>{suggestion.term}</span>
                {suggestion.isSponsored && (
                  <Badge variant="outline" className="text-xs">
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
      
      {/* Image search modal */}
      {isImageSearchOpen && (
        <ImageSearchUploader
          onClose={() => setIsImageSearchOpen(false)}
          onProcessingComplete={handleImageSearchResult}
        />
      )}
    </div>
  );
}
