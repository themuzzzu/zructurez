
export type GridLayoutType = "grid1x1" | "grid2x2" | "grid3x3" | "grid4x4" | "list" | "single";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string; // Make this required
  category: string;
  rating?: number;
  rating_count?: number;
  highlight_tags?: string[];
  is_discounted?: boolean;
  discount_percentage?: number;
  original_price?: number;
  brand_name?: string;
  brand?: string;
  name?: string; // Some components use name instead of title
  imageUrl?: string; // Allow both image_url and imageUrl but prefer image_url
  views?: number;
  wishlist_count?: number;
}

// Add ProductType as an alias for Product to fix the imports
export type ProductType = Product;
