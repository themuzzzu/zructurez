
export interface Product {
  id: string;
  title?: string;
  name?: string;
  description: string;
  price: number;
  original_price?: number;
  category?: string;
  image_url?: string;
  imageUrl?: string;
  is_discounted?: boolean;
  is_used?: boolean;
  is_branded?: boolean;
  brand_name?: string;
  brand?: string;
  condition?: string;
  stock?: number;
  views?: number;
  created_at?: string;
  user_id?: string;
  discount_percentage?: number;
  rating?: number;
  rating_count?: number;
  labels?: ProductLabel[];
  model?: string;
  size?: string;
}

export interface ProductLabel {
  id?: string;
  name: string;
  attributes: Array<{
    name: string;
    value: string;
  } | string>;
  product_id?: string;
}

export interface SavedLabel {
  id: string;
  name: string;
  attributes: string[];
  user_id: string;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order?: number;
  created_at?: string;
}
