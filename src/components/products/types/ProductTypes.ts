
export type GridLayoutType = "grid2x2" | "grid3x3" | "grid4x4" | "list" | "grid1x1";

export interface ProductType {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  discount_percentage?: number;
  original_price?: number;
  is_discounted?: boolean;
  category?: string;
  brand_name?: string;
  brand?: string; // Adding brand property
  name?: string;  // Adding name property
  condition?: string;
  rating?: number;
  rating_count?: number;
}
