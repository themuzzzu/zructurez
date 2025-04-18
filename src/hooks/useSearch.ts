
import { useState } from "react";
import { SearchResult, SearchFilters } from "@/types/search";
import { supabase } from "@/lib/supabase";

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

  const search = async (searchQuery: string, filters?: Partial<SearchFilters>) => {
    setIsLoading(true);
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

      // Get related products based on category
      if (searchResults && searchResults.length > 0) {
        const categories = [...new Set(searchResults.map(r => r.category))];
        const { data: related } = await supabase
          .from("products")
          .select("*")
          .in("category", categories)
          .not("id", "in", searchResults.map(r => r.id))
          .limit(8);

        setRelatedResults(related || []);
      }

      setResults(searchResults || []);
      
      // Check if there's a corrected query (simplified spell check logic)
      if (searchResults && searchResults.length === 0 && searchQuery.length > 3) {
        // This is just a placeholder for spell checking. In a real app,
        // you would use a more sophisticated algorithm.
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
      setResults([]);
      setRelatedResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    // This function would typically update internal state for filters
    console.log("Updating filters:", newFilters);
    // In a real implementation, you might want to manage filter state here
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
    updateFilters
  };
}
