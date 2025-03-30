
export interface ProductType {
  id: string;
  title: string;
  price: number;
  image_url?: string;
  description?: string;
  category?: string;
  is_discounted?: boolean;
  discount_percentage?: number;
  original_price?: number;
  views?: number;
  sales_count?: number;
  trending_score?: number;
  brand?: string;
}

// Define the layout type as a string literal type to be shared across components
export type GridLayoutType = "grid4x4" | "grid2x2" | "grid1x1";
