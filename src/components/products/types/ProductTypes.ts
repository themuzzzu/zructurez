
// Product card layout type
export type GridLayoutType = "grid4x4" | "grid2x2" | "grid1x1";

// Basic product type
export interface ProductType {
  id: string;
  name?: string;  // Made optional since some products use title instead
  title?: string; // Added title as an alternative to name
  description?: string;
  price: number;
  image_url?: string;
  discount_price?: number;
  rating?: number;
  seller?: string;
  category?: string;
  brand?: string;
  brand_name?: string; // Added to match database field
  is_featured?: boolean;
  stock_count?: number;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  is_new?: boolean;
  is_sale?: boolean;
  is_bestseller?: boolean;
  is_branded?: boolean;
  is_discounted?: boolean;
  discount_percentage?: number;
  original_price?: number;
  views?: number;
  condition?: string;
  [key: string]: any; // For other dynamic properties
}
