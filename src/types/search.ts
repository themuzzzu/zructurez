
export interface SearchFilters {
  query?: string;
  sortBy?: "relevance" | "price-asc" | "price-desc" | "newest" | "popularity";
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  includeSponsored?: boolean;
  location?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  image_url?: string; // Added for backwards compatibility
  category?: string;
  price?: number;
  type: string;
  url: string;
  isSponsored?: boolean;
  isDiscounted?: boolean;
  discount_percentage?: number;
  original_price?: number;
  relevanceScore?: number;
  highlight_tags?: string[];
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
