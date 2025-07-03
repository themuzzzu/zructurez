
export type GridLayoutType = "grid1x1" | "grid2x2" | "grid3x3" | "grid4x4" | "list";

export interface Product {
  id: string;
  user_id: string;
  title: string;
  name?: string;
  description?: string;
  category?: string;
  image_url?: string;
  price?: number;
  rating?: number;
  views?: number;
  is_available?: boolean;
  is_discounted?: boolean;
  discount_percentage?: number;
  original_price?: number;
  created_at: string;
  updated_at: string;
  city?: string;
  business_id?: string;
}
