
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

  const search = async (query: string, filters?: Partial<SearchFilters>) => {
    setIsLoading(true);
    try {
      let productQuery = supabase
        .from("products")
        .select("*")
        .textSearch("title", query);

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
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setRelatedResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    results,
    relatedResults,
    isLoading,
    search
  };
}
