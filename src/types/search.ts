
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  price?: number;
  relevanceScore?: number;
  isSponsored?: boolean;
  type: 'product' | 'business' | 'service' | 'post';
  url: string;
}

export interface SearchSuggestion {
  id: string;
  term: string;
  frequency: number;
  category?: string;
  isSponsored?: boolean;
}

export interface SearchFilters {
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'newest';
  location?: string;
  includeSponsored: boolean;
}

export interface SearchQuery {
  query: string;
  correctedQuery?: string;
  filters?: SearchFilters;
  modelUsed: string;
}

export interface VoiceSearchData {
  id: string;
  audioUrl: string;
  transcription?: string;
  createdAt: string;
}

export interface ImageSearchData {
  id: string;
  imageUrl: string;
  description?: string;
  createdAt: string;
}

export interface SponsoredTerm {
  id: string;
  businessId: string;
  term: string;
  bidAmount: number;
  maxDailyBudget: number;
  spentToday: number;
  impressions: number;
  clicks: number;
  status: 'active' | 'paused' | 'completed';
}

export interface AISearchSettings {
  defaultModel: 'openai' | 'deepseek' | 'qwen';
  openaiModel: string;
  deepseekModel: string;
  qwenModel: string;
  includeSponsored: boolean;
  personalizationStrength: number;
  fallbackToKeyword: boolean;
}
