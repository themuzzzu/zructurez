
import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Debounce search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 300); // 300ms debounce time
    
    return () => {
      clearTimeout(timer);
    };
  }, [value]);

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
    queryKey: ['search-suggestions', debouncedValue],
    queryFn: async () => {
      if (!debouncedValue || debouncedValue.length < 2) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('title')
        .ilike('title', `%${debouncedValue}%`)
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: debouncedValue.length >= 2,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && onSearchSelect) {
      onSearchSelect(value);
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
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className="w-full border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100 pl-3"
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(value.length >= 2);
          }}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
      </form>

      {((showSuggestions && suggestions && suggestions.length > 0) || 
         (isFocused && !value && popularSearches && popularSearches.length > 0)) && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full bg-white dark:bg-zinc-900 shadow-lg rounded-md border border-zinc-300 dark:border-zinc-700 overflow-hidden"
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
                  className="text-sm py-1 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer rounded"
                  onClick={() => handleSuggestionClick(item.title)}
                >
                  {item.title}
                </div>
              ))
            ) : popularSearches && (
              popularSearches.map((item, index) => (
                <div
                  key={index}
                  className="text-sm py-1 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer rounded flex justify-between items-center"
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
}
