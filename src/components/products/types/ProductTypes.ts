
export type GridLayoutType = "grid2x2" | "grid3x3" | "grid4x4";

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
  is_discounted?: boolean;
  discount_percentage?: number;
  brand?: string;
  in_stock?: boolean;
  stock_count?: number;
  ratings?: number;
  reviews_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price?: number;
  image_url?: string;
  is_available?: boolean;
  stock_count?: number;
}

export interface ProductAttribute {
  id: string;
  product_id: string;
  name: string;
  value: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  image_url?: string;
  description?: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id?: string;
  user_name: string;
  rating: number;
  comment?: string;
  created_at?: string;
}

export interface ProductTag {
  id: string;
  name: string;
  slug: string;
}

export interface Seller {
  id: string;
  name: string;
  logo_url?: string;
  rating?: number;
  reviews_count?: number;
  verified?: boolean;
}

export interface ProductFilter {
  category?: string;
  subcategory?: string;
  price_min?: number;
  price_max?: number;
  brand?: string[];
  ratings?: number;
  tags?: string[];
  discount_only?: boolean;
  in_stock_only?: boolean;
  sort_by?: 'price_low' | 'price_high' | 'newest' | 'ratings' | 'popularity';
}
