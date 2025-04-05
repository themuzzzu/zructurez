
import { useState, useEffect, useCallback, useRef } from "react";
import { 
  getSearchSuggestions, 
  performSearch,
  recordSearchResultClick,
} from "@/services/searchService";
import type { SearchResult, SearchSuggestion, SearchFilters } from "@/types/search";
import { useDebounce, useDebouncedCallback } from "@/hooks/useDebounce";
import { globalCache } from "@/utils/cacheUtils";

interface UseSearchProps {
  initialQuery?: string;
  initialFilters?: SearchFilters;
  suggestionsEnabled?: boolean;
  cacheResults?: boolean;
  cacheTTL?: number;
}

export const useSearch = ({
  initialQuery = "",
  initialFilters = { includeSponsored: true },
  suggestionsEnabled = true,
  cacheResults = true,
  cacheTTL = 5 * 60 * 1000, // 5 minutes by default
}: UseSearchProps = {}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [correctedQuery, setCorrectedQuery] = useState<string | undefined>();
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const previousSearchRef = useRef<{ query: string, filters: SearchFilters } | null>(null);
  const debouncedQuery = useDebounce(query, 300);
  const searchRequestRef = useRef<AbortController | null>(null);
  
  // Create a cache key based on query and filters
  const getCacheKey = useCallback((searchQuery: string, searchFilters: SearchFilters) => {
    return `search:${searchQuery}:${JSON.stringify(searchFilters)}`;
  }, []);
  
  // Fetch search suggestions with caching
  const fetchSuggestions = useCallback(async (term: string) => {
    if (!suggestionsEnabled || !term || term.length < 2) {
      setSuggestions([]);
      return;
    }
    
    // Check cache for suggestions
    const cacheKey = `suggestions:${term}`;
    const cachedSuggestions = globalCache.get<SearchSuggestion[]>(cacheKey);
    
    if (cachedSuggestions) {
      setSuggestions(cachedSuggestions);
      return;
    }
    
    try {
      const data = await getSearchSuggestions(term);
      setSuggestions(data);
      
      // Cache suggestions for 10 minutes
      if (cacheResults) {
        globalCache.set(cacheKey, data, 10 * 60 * 1000);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
  }, [suggestionsEnabled, cacheResults]);
  
  // Debounced suggestion fetching
  const [debouncedFetchSuggestions, isFetchingSuggestions] = useDebouncedCallback(fetchSuggestions, 300);
  
  // Load suggestions when query changes
  useEffect(() => {
    if (debouncedQuery) {
      debouncedFetchSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, debouncedFetchSuggestions]);
  
  // Optimized search function with caching, deduplication and request cancellation
  const search = useCallback(async (searchQuery: string, searchFilters?: SearchFilters) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }
    
    const finalFilters = searchFilters || filters;
    
    // Skip if this exact search was just performed
    if (
      previousSearchRef.current && 
      previousSearchRef.current.query === searchQuery &&
      JSON.stringify(previousSearchRef.current.filters) === JSON.stringify(finalFilters)
    ) {
      return;
    }
    
    // Cancel any in-flight search request
    if (searchRequestRef.current) {
      searchRequestRef.current.abort();
    }
    
    // Create a new abort controller
    const abortController = new AbortController();
    searchRequestRef.current = abortController;
    
    // Update the previous search reference
    previousSearchRef.current = { query: searchQuery, filters: finalFilters };
    
    // Check cache first if enabled
    if (cacheResults) {
      const cacheKey = getCacheKey(searchQuery, finalFilters);
      const cachedResults = globalCache.get<{
        results: SearchResult[], 
        correctedQuery?: string
      }>(cacheKey);
      
      if (cachedResults) {
        setResults(cachedResults.results);
        setCorrectedQuery(cachedResults.correctedQuery);
        return;
      }
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fix here: Remove the third argument that was causing the error
      const { results: searchResults, correctedQuery: corrected } = await performSearch(
        searchQuery, 
        finalFilters
      );
      
      // If this request has been aborted, don't update state
      if (abortController.signal.aborted) {
        return;
      }
      
      setResults(searchResults);
      setCorrectedQuery(corrected);
      
      // Cache the results if enabled
      if (cacheResults) {
        const cacheKey = getCacheKey(searchQuery, finalFilters);
        globalCache.set(
          cacheKey, 
          { results: searchResults, correctedQuery: corrected }, 
          cacheTTL
        );
      }
    } catch (err: any) {
      // Don't set error state for aborted requests
      if (err.name !== 'AbortError') {
        setError("Failed to perform search. Please try again.");
        console.error("Search error:", err);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoading(false);
        searchRequestRef.current = null;
      }
    }
  }, [filters, cacheResults, cacheTTL, getCacheKey]);
  
  // Debounced search to avoid hammering the API
  const [debouncedSearch, isSearching] = useDebouncedCallback(search, 500);
  
  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      if (searchRequestRef.current) {
        searchRequestRef.current.abort();
      }
    };
  }, []);
  
  // Combined loading state
  const combinedIsLoading = isLoading || isSearching || isFetchingSuggestions;
  
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
  
  // Clear cache for current search
  const invalidateCache = useCallback(() => {
    if (!query) return;
    
    const cacheKey = getCacheKey(query, filters);
    globalCache.delete(cacheKey);
  }, [query, filters, getCacheKey]);
  
  return {
    query,
    setQuery,
    filters,
    updateFilters,
    results,
    suggestions,
    isLoading: combinedIsLoading,
    error,
    correctedQuery,
    search: debouncedSearch,
    handleResultClick,
    applySuggestion,
    showSuggestions,
    setShowSuggestions,
    invalidateCache,
    refreshResults: () => search(query, filters)
  };
};
