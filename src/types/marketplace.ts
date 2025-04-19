
import { Product } from "@/types/product";
import { Business } from "@/types/business";
import { Service } from "@/types/service";

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  image_url: string;
  business_id: string;
  type: "product" | "business" | "service";
  reference_id: string;
  budget: number;
  format: "banner" | "sidebar" | "featured";
  status: "active" | "pending" | "rejected" | "completed";
  location: string;
  start_date: string;
  end_date: string;
  clicks: number;
  impressions: number;
  user_id: string;
  created_at: string;
  link?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  emoji?: string;
  image?: string;
  subcategories?: string[];
}

export interface MarketplaceState {
  searchQuery: string;
  selectedCategory: string;
  selectedSubcategory: string;
  showDiscounted: boolean;
  showUsed: boolean;
  showBranded: boolean;
  sortOption: string;
  priceRange: string;
  gridLayout: "grid2x2" | "grid3x3" | "grid4x4" | "list";
}

export interface SearchFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  discountedOnly?: boolean;
  usedOnly?: boolean;
  brandedOnly?: boolean;
  sortBy?: "newest" | "price_asc" | "price_desc" | "popularity" | "rating";
}

export interface MarketplaceSection {
  id: string;
  title: string;
  type: "products" | "services" | "businesses" | "carousel" | "categories" | "custom";
  items: (Product | Business | Service | Advertisement)[];
  layout?: "grid" | "carousel" | "list";
  filters?: SearchFilters;
  position: number;
}
