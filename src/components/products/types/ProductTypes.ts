
export type GridLayoutType = "grid2x2" | "grid3x3" | "grid4x4" | "list";

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
  condition?: string;
  rating?: number;
  rating_count?: number;
}
