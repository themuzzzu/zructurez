
import { useState, useRef, useEffect } from "react";
import { Search, Mic, Camera, X, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSearch } from "@/hooks/useSearch";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { useImageSearch } from "@/hooks/useImageSearch";
import { SearchSuggestion } from "@/types/search";
import { Badge } from "@/components/ui/badge";
import { VoiceSearchRecorder } from "./VoiceSearchRecorder";
import { ImageSearchUploader } from "./ImageSearchUploader";

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showVoiceSearch?: boolean;
  showImageSearch?: boolean;
}

export function SearchBar({
  className,
  onSearch,
  placeholder = "Search products, businesses, services...",
  autoFocus = false,
  showVoiceSearch = true,
  showImageSearch = true,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  
  const { 
    query, 
    setQuery, 
    suggestions,
    showSuggestions,
    setShowSuggestions,
    applySuggestion,
    search
  } = useSearch({
    suggestionsEnabled: true
  });
  
  const { startRecording, stopRecording } = useVoiceSearch({
    onTranscription: (text) => {
      setQuery(text);
      handleSearch(text);
      setVoiceModalOpen(false);
    }
  });
  
  const { handleImageUpload } = useImageSearch({
    onImageProcessed: (description) => {
      setQuery(description);
      handleSearch(description);
      setImageModalOpen(false);
    }
  });
  
  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };
  
  // Handle input blur
  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 150);
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    applySuggestion(suggestion);
    if (onSearch) {
      onSearch(suggestion.term);
    }
  };
  
  // Handle search submission
  const handleSearch = (searchQuery: string = query) => {
    search(searchQuery);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(searchQuery);
    }
  };
  
  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "pl-9 pr-[4.5rem] h-10",
            isFocused && "border-primary ring-1 ring-primary"
          )}
        />
        
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-[4.5rem] h-7 w-7"
            onClick={() => setQuery("")}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
        
        <div className="absolute right-1 flex space-x-1">
          {showVoiceSearch && (
            <Popover open={voiceModalOpen} onOpenChange={setVoiceModalOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Mic className="h-4 w-4" />
                  <span className="sr-only">Voice search</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <VoiceSearchRecorder
                  onStart={startRecording}
                  onStop={stopRecording}
                  onCancel={() => setVoiceModalOpen(false)}
                />
              </PopoverContent>
            </Popover>
          )}
          
          {showImageSearch && (
            <Popover open={imageModalOpen} onOpenChange={setImageModalOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Image search</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <ImageSearchUploader 
                  onUpload={handleImageUpload}
                  onCancel={() => setImageModalOpen(false)}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      
      {/* Suggestions popover */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full z-50 bg-white dark:bg-zinc-800 shadow-lg rounded-md mt-1 border border-input overflow-hidden">
          <ul className="py-1">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="px-3 py-2 hover:bg-muted cursor-pointer flex items-center justify-between"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center gap-2">
                  <Search className="h-3 w-3 text-muted-foreground" />
                  <span>{suggestion.term}</span>
                </div>
                {suggestion.isSponsored && (
                  <Badge variant="outline" className="text-xs">Sponsored</Badge>
                )}
              </li>
            ))}
            <li className="px-3 py-2 text-xs text-muted-foreground border-t flex items-center">
              <CornerDownLeft className="h-3 w-3 mr-1" /> 
              Press Enter to search
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
