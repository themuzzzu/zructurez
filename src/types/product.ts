
export interface Product {
  id: string;
  title?: string;
  name?: string;
  description: string;
  price: number;
  original_price?: number;
  category?: string;
  image_url?: string;
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
}
