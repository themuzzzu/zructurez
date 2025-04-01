
import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface AutocompleteSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  onSearchSelect?: (search: string) => void;
}

interface Suggestion {
  id?: string;
  title: string;
  type?: string;
  category?: string;
}

// Database types to match Supabase schema
interface ProductData {
  title: string;
  category?: string;
  [key: string]: any;
}

interface BusinessData {
  name: string; // The business table uses "name" not "title"
  category?: string;
  [key: string]: any;
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
      
      // Get product suggestions
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('title, category')
        .ilike('title', `%${debouncedValue}%`)
        .limit(3);
      
      if (productError) throw productError;
      
      // Get business suggestions
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('name, category') // Note: business has "name" field, not "title"
        .ilike('name', `%${debouncedValue}%`)
        .limit(2);
      
      if (businessError) throw businessError;
      
      // Combine and return all suggestions with proper typing
      const productSuggestions: Suggestion[] = (productData || []).map((item: ProductData) => ({ 
        title: item.title, 
        category: item.category,
        type: 'product' 
      }));
      
      // Fix this mapping to correctly handle the business data structure
      const businessSuggestions: Suggestion[] = (businessData || []).map((item: BusinessData) => ({ 
        title: item.name, // Use "name" from business instead of "title"
        category: item.category,
        type: 'business' 
      }));
      
      return [...productSuggestions, ...businessSuggestions];
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

  // Modified to work on single click (form submit) instead of double
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
      <motion.form 
        onSubmit={handleSubmit} 
        className="relative"
        initial={{ opacity: 0.9, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className="w-full pl-10 pr-24 h-12 rounded-full border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-500 shadow-sm focus:shadow-md transition-all duration-300"
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(value.length >= 2);
          }}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        <Button 
          type="submit" 
          size="sm" 
          className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-9 rounded-full px-4"
        >
          Search
        </Button>
      </motion.form>

      <AnimatePresence>
        {((showSuggestions && suggestions && suggestions.length > 0) || 
           (isFocused && !value && popularSearches && popularSearches.length > 0)) && (
          <motion.div 
            ref={suggestionsRef}
            className="absolute z-50 mt-1 w-full bg-white dark:bg-zinc-900 shadow-lg rounded-md border border-zinc-300 dark:border-zinc-700 overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2">
              <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                {value ? "Suggestions" : "Popular Searches"}
              </h4>
              {isLoading ? (
                <div className="text-sm py-1 px-2">Loading...</div>
              ) : value && suggestions ? (
                suggestions.map((item, index) => (
                  <motion.div
                    key={index}
                    className="text-sm py-2 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer rounded flex justify-between items-center"
                    onClick={() => handleSuggestionClick(item.title)}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center">
                      <span>{item.title}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded">
                      {item.type || item.category}
                    </span>
                  </motion.div>
                ))
              ) : popularSearches && (
                popularSearches.map((item, index) => (
                  <motion.div
                    key={index}
                    className="text-sm py-2 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer rounded flex justify-between items-center"
                    onClick={() => handleSuggestionClick(item.title)}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>{item.title}</span>
                    <span className="text-xs text-zinc-400">{item.views} views</span>
                  </motion.div>
                ))
              )}
              
              {value && (
                <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-zinc-800"
                    onClick={() => handleSuggestionClick(value)}
                  >
                    <span>Search for "{value}"</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
