
export type GridLayoutType = "grid4x4" | "grid3x3" | "grid2x2" | "list";

export interface ProductType {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  image_url?: string;
  stock: number;
  brand?: string;
  condition?: string;
  is_discounted?: boolean;
  is_used?: boolean;
  is_branded?: boolean;
  discount_percentage?: number;
  original_price?: number;
  created_at?: string;
  updated_at?: string;
  views?: number;
}
