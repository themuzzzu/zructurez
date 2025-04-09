
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock?: number;
  category?: string;
  subcategory?: string;
  image_url?: string;
  imageUrl?: string;
  brand_name?: string;
  condition?: string;
  model?: string;
  size?: string;
  user_id?: string;
  original_price?: number;
  is_discounted?: boolean;
  is_used?: boolean;
  is_branded?: boolean;
  views?: number;
  reach?: number;
  discount_percentage?: number;
  service_product_id?: string;
  created_at?: string;
  name?: string;
  brand?: string;
  rating?: number;
  rating_count?: number;
  labels?: ProductLabel[];
}

export interface ProductCardProps {
  product: Product;
  layout?: "grid1x1" | "grid2x1" | "list";
  badge?: string;
  rank?: number;
}

export interface ProductImage {
  id: string;
  image_url: string;
  product_id: string;
  created_at: string;
  display_order?: number;
}
