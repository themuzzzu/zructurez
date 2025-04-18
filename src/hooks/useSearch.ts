
import { useState } from "react";
import { SearchResult, SearchFilters, SearchSuggestion } from "@/types/search";
import { supabase, getMockSearchResults } from "@/lib/supabase";

interface UseSearchProps {
  initialQuery?: string;
  suggestionsEnabled?: boolean;
}

export function useSearch({ initialQuery = "", suggestionsEnabled = false }: UseSearchProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [relatedResults, setRelatedResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Array<{id: string, term: string, isSponsored?: boolean}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [correctedQuery, setCorrectedQuery] = useState<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [lastSearchTime, setLastSearchTime] = useState(0);
  const [hasError, setHasError] = useState(false);

  const search = async (searchQuery: string, filters?: Partial<SearchFilters>) => {
    // Prevent searching with empty query
    if (!searchQuery.trim()) {
      setResults([]);
      setRelatedResults([]);
      return;
    }

    // Throttle searches to prevent too many requests
    const now = Date.now();
    if (now - lastSearchTime < 300) {
      return;
    }
    setLastSearchTime(now);

    setIsLoading(true);
    setHasError(false);

    try {
      // Try to fetch from Supabase with timeout
      const searchPromise = new Promise<SearchResult[]>(async (resolve, reject) => {
        try {
          let productQuery = supabase
            .from("products")
            .select("*")
            .textSearch("title", searchQuery);

          if (filters?.categories?.length) {
            productQuery = productQuery.in("category", filters.categories);
          }

          if (filters?.priceMin !== undefined && filters?.priceMax !== undefined) {
            productQuery = productQuery
              .gte("price", filters.priceMin)
              .lte("price", filters.priceMax);
          }

          if (filters?.location) {
            productQuery = productQuery.textSearch("location", filters.location);
          }

          if (filters?.locationRadius && filters.location) {
            // This is a placeholder - in a real app you'd use postgis or similar
            console.log(`Searching within ${filters.locationRadius}km of ${filters.location}`);
          }

          switch (filters?.sortBy) {
            case "price-asc":
              productQuery = productQuery.order("price", { ascending: true });
              break;
            case "price-desc":
              productQuery = productQuery.order("price", { ascending: false });
              break;
            case "newest":
              productQuery = productQuery.order("created_at", { ascending: false });
              break;
            case "popularity":
              productQuery = productQuery.order("views", { ascending: false });
              break;
            default:
              productQuery = productQuery.order("relevance_score", { ascending: false });
          }

          const { data: searchResults, error } = await productQuery;

          if (error) throw error;
          
          resolve(searchResults || []);
        } catch (error) {
          reject(error);
        }
      });

      // Set a timeout for the Supabase query
      const timeoutPromise = new Promise<SearchResult[]>((_, reject) => {
        setTimeout(() => reject(new Error("Search timeout")), 2000);
      });

      // Race between the search and timeout
      let searchResults: SearchResult[];
      try {
        searchResults = await Promise.race([searchPromise, timeoutPromise]);
      } catch (error) {
        console.log("Search fallback: using mock data", error);
        setHasError(true);
        // Fall back to mock data on error or timeout
        searchResults = getMockSearchResults(searchQuery);
      }

      // Get related products based on category from the found products
      let related: SearchResult[] = [];
      
      if (searchResults && searchResults.length > 0) {
        const categories = [...new Set(searchResults.map(r => r.category).filter(Boolean))];
        
        if (categories.length) {
          try {
            // Try to get related products
            const { data: relatedData } = await supabase
              .from("products")
              .select("*")
              .in("category", categories)
              .not("id", "in", searchResults.map(r => r.id))
              .limit(8);
              
            if (relatedData && relatedData.length > 0) {
              related = relatedData;
            } else {
              // Generate mock related products if none found
              related = getMockSearchResults(categories[0] || "related")
                .slice(0, 4)
                .map(item => ({
                  ...item,
                  title: `Related: ${item.title}`
                }));
            }
          } catch (error) {
            console.log("Error fetching related products:", error);
            // Generate mock related products on error
            related = getMockSearchResults(categories[0] || "related")
              .slice(0, 4)
              .map(item => ({
                ...item,
                title: `Related: ${item.title}`
              }));
          }
        }
      }

      setResults(searchResults);
      setRelatedResults(related);
      
      // Check if there's a corrected query suggestion
      if (searchResults.length === 0 && searchQuery.length > 3) {
        const possibleCorrection = await checkSpelling(searchQuery);
        if (possibleCorrection && possibleCorrection !== searchQuery) {
          setCorrectedQuery(possibleCorrection);
        } else {
          setCorrectedQuery(null);
        }
      } else {
        setCorrectedQuery(null);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults(getMockSearchResults(searchQuery));
      setRelatedResults([]);
      setHasError(true);
    } finally {
      setIsLoading(false);
      setIsFirstLoad(false);
    }
  };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    // This function updates internal state for filters
    console.log("Updating filters:", newFilters);
  };

  const applySuggestion = (suggestion: {id: string, term: string}) => {
    setQuery(suggestion.term);
    search(suggestion.term);
    setShowSuggestions(false);
  };

  // Simple placeholder for spell checking
  const checkSpelling = async (query: string): Promise<string | null> => {
    // This would be replaced with a real spell checking service
    const commonMisspellings: Record<string, string> = {
      'electonics': 'electronics',
      'fasion': 'fashion',
      'cloths': 'clothes',
      'phne': 'phone',
      'labtop': 'laptop',
      'wirless': 'wireless',
      'headphnes': 'headphones',
      'blutooth': 'bluetooth',
      'camra': 'camera',
      'televison': 'television',
    };
    
    const words = query.toLowerCase().split(' ');
    let corrected = false;
    
    const correctedWords = words.map(word => {
      if (commonMisspellings[word]) {
        corrected = true;
        return commonMisspellings[word];
      }
      return word;
    });
    
    return corrected ? correctedWords.join(' ') : null;
  };

  return {
    results,
    relatedResults,
    isLoading,
    search,
    query,
    setQuery,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    applySuggestion,
    correctedQuery,
    updateFilters,
    hasError,
    isFirstLoad
  };
}
