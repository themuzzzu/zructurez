
export interface ProductType {
  id: string;
  title: string;
  price: number;
  image_url?: string;
  description?: string;
  category?: string;
  is_discounted?: boolean;
  discount_percentage?: number;
  original_price?: number;
  views?: number;
  sales_count?: number;
  trending_score?: number;
  brand?: string;
}
