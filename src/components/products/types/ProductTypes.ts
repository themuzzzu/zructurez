
export type GridLayoutType = "grid1x1" | "grid2x2" | "grid3x3" | "grid4x4" | "list" | "single";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating?: number;
  rating_count?: number;
  highlight_tags?: string[];
  is_discounted?: boolean;
  discount_percentage?: number;
}
