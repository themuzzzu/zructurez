
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  image_url?: string;
  stock: number;
  created_at?: string;
  updated_at?: string;
  brand_name?: string;
  model?: string;
  condition?: string;
  size?: string;
  is_branded?: boolean;
  is_used?: boolean;
  is_discounted?: boolean;
  discount_percentage?: number;
  original_price?: number;
  views?: number;
  user_id?: string;
  service_product_id?: string;
  reach?: number;
  // For ShoppingSection compatibility
  name?: string;
  business_id?: string;
}
