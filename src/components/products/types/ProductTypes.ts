
export type GridLayoutType = "grid1x1" | "grid2x2" | "grid3x3" | "grid4x4" | "list";

export interface Product {
  id: string;
  title: string;
  price: number;
  image_url?: string;
  imageUrl?: string;
  category?: string;
  description?: string;
  views?: number;
  is_discounted?: boolean;
  is_used?: boolean;
  is_branded?: boolean;
  created_at?: string;
  original_price?: number;
  discount_percentage?: number;
  brand?: string;
  brand_name?: string;
  rating?: number;
  rating_count?: number;
  highlight_tags?: string[];
}

// ProductType alias for backwards compatibility
export type ProductType = Product;
