
// Define grid layout options
export type GridLayoutType = "grid1x1" | "grid2x2" | "grid3x3" | "grid4x4" | "list" | "single";

// Product type definition
export interface ProductType {
  id: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  image_url?: string;  // Added for compatibility with Product interface
  category?: string;
  is_discounted?: boolean;
  discount_percentage?: number;
  original_price?: number;
  brand?: string;
  brand_name?: string;  // Added for compatibility with Product interface
  rating?: number;
  rating_count?: number;
  highlight_tags?: string[];
  is_new?: boolean;
  is_bestseller?: boolean;
  stock_quantity?: number;
  variant_options?: ProductVariantOption[];
}

// Product variant option definition
export interface ProductVariantOption {
  name: string;
  options: string[];
}

// Product review type
export interface ProductReview {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  date: string;
  helpful_count?: number;
  images?: string[];
}
