
export interface Service {
  id: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  image_url?: string; // Adding alternative property name
  category?: string;
  location?: string;
  contact_info?: string;
  is_sponsored?: boolean;
  rating?: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  availability?: string[] | string; // Updated to accept both string and string array
  business_id?: string;
  views?: number;
  is_open?: boolean;
}
