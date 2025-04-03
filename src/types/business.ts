
export interface BusinessProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock?: number;
  image_url?: string;
  business_id: string;
  category?: string;
  created_at?: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  location?: string;
  contact?: string;
  hours?: string;
  image_url?: string | null;
  video_url?: string | null;
  bio?: string | null;
  website?: string | null;
  user_id: string;
  created_at: string;
  verified?: boolean;
  is_open?: boolean;
  owners?: any[];
  staff_details?: any[];
  business_products?: BusinessProduct[];
  business_portfolio?: any[];
}

export type MenuType = 'menu' | 'list' | 'catalog';
