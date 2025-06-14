
export type GridLayoutType = "grid1x1" | "grid2x2" | "grid3x3" | "grid4x4";

export interface Product {
  id: string;
  title: string;
  price: number;
  image_url?: string;
  category?: string;
  description?: string;
  views?: number;
  is_discounted?: boolean;
  is_used?: boolean;
  is_branded?: boolean;
  created_at?: string;
}
