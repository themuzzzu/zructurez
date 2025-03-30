
// Product card layout type
export type GridLayoutType = "grid4x4" | "grid2x2" | "grid1x1";

// Basic product type
export interface ProductType {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  discount_price?: number;
  rating?: number;
  seller?: string;
  category?: string;
  brand?: string;
  is_featured?: boolean;
  stock_count?: number;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  is_new?: boolean;
  is_sale?: boolean;
  is_bestseller?: boolean;
  [key: string]: any; // For other dynamic properties
}
