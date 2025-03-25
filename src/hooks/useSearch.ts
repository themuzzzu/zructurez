
import { useState, useEffect, useCallback } from "react";
import { 
  getSearchSuggestions, 
  performSearch,
  recordSearchResultClick,
} from "@/services/searchService";
import type { SearchResult, SearchSuggestion, SearchFilters } from "@/types/search";
import { useDebounce } from "@/hooks/useDebounce";

interface UseSearchProps {
  initialQuery?: string;
  initialFilters?: SearchFilters;
  suggestionsEnabled?: boolean;
}

export const useSearch = ({
  initialQuery = "",
  initialFilters = { includeSponsored: true },
  suggestionsEnabled = true,
}: UseSearchProps = {}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [correctedQuery, setCorrectedQuery] = useState<string | undefined>();
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);
  
  // Fetch search suggestions based on user input
  const fetchSuggestions = useCallback(async (term: string) => {
    if (!suggestionsEnabled || !term || term.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      const data = await getSearchSuggestions(term);
      setSuggestions(data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
  }, [suggestionsEnabled]);
  
  // Load suggestions when query changes
  useEffect(() => {
    if (debouncedQuery) {
      fetchSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, fetchSuggestions]);
  
  // Perform search
  const search = useCallback(async (searchQuery: string, searchFilters?: SearchFilters) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { results: searchResults, correctedQuery: corrected } = await performSearch(
        searchQuery, 
        searchFilters || filters
      );
      
      setResults(searchResults);
      setCorrectedQuery(corrected);
    } catch (err) {
      setError("Failed to perform search. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);
  
  // Handle click on a search result
  const handleResultClick = useCallback(async (result: SearchResult) => {
    try {
      await recordSearchResultClick(
        result.id, 
        result.isSponsored || false, 
        query
      );
    } catch (err) {
      console.error("Error recording result click:", err);
    }
  }, [query]);
  
  // Apply selected suggestion
  const applySuggestion = useCallback((suggestion: SearchSuggestion) => {
    setQuery(suggestion.term);
    setShowSuggestions(false);
    search(suggestion.term, filters);
  }, [search, filters]);
  
  // Update filters
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  return {
    query,
    setQuery,
    filters,
    updateFilters,
    results,
    suggestions,
    isLoading,
    error,
    correctedQuery,
    search,
    handleResultClick,
    applySuggestion,
    showSuggestions,
    setShowSuggestions,
  };
};
