
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
  category?: string;
  price?: number;
  type: string;
  url: string;
  isSponsored?: boolean;
  relevanceScore?: number;
}

export interface SearchSuggestion {
  id: string;
  term: string;
  frequency: number;
  category?: string;
  isSponsored?: boolean;
}
