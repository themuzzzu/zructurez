
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface AutocompleteSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  onSearchSelect?: (search: string) => void;
}

export const AutocompleteSearch = ({
  placeholder = "Search...",
  value,
  onChange,
  className,
  onSearchSelect
}: AutocompleteSearchProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get popular searches
  const { data: popularSearches } = useQuery({
    queryKey: ['popular-searches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('title, views')
        .order('views', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Get autocomplete suggestions based on input
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['search-suggestions', value],
    queryFn: async () => {
      if (!value || value.length < 2) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('title')
        .ilike('title', `%${value}%`)
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: value.length >= 2,
  });

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (newValue.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    if (onSearchSelect) {
      onSearchSelect(suggestion);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className="pl-10 w-full"
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(value.length >= 2);
          }}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      {((showSuggestions && suggestions && suggestions.length > 0) || 
         (isFocused && !value && popularSearches && popularSearches.length > 0)) && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white dark:bg-zinc-800 shadow-lg rounded-md border border-border overflow-hidden"
        >
          <div className="p-2">
            <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              {value ? "Suggestions" : "Popular Searches"}
            </h4>
            {isLoading ? (
              <div className="text-sm py-1 px-2">Loading...</div>
            ) : value && suggestions ? (
              suggestions.map((item, index) => (
                <div
                  key={index}
                  className="text-sm py-1 px-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer rounded"
                  onClick={() => handleSuggestionClick(item.title)}
                >
                  {item.title}
                </div>
              ))
            ) : popularSearches && (
              popularSearches.map((item, index) => (
                <div
                  key={index}
                  className="text-sm py-1 px-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer rounded flex justify-between items-center"
                  onClick={() => handleSuggestionClick(item.title)}
                >
                  <span>{item.title}</span>
                  <span className="text-xs text-zinc-400">{item.views} views</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
