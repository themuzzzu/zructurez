export interface SearchFilters {
  query?: string;
  sortBy?: "relevance" | "price-asc" | "price-desc" | "newest" | "popularity";
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  includeSponsored?: boolean;
  location?: string;
  type?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  price?: number;
  type: string;
  url: string;
  isSponsored?: boolean;
  relevanceScore?: number;
  highlight_tags?: string[];
  isDiscounted?: boolean;
  discount_percentage?: number;
  // Include both formats for backward compatibility
  is_discounted?: boolean;
}

export interface SearchSuggestion {
  id: string;
  term: string;
  frequency: number;
  category?: string;
  isSponsored?: boolean;
}
