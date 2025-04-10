
export interface Service {
  id: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  location?: string;
  contact_info?: string;
  is_sponsored?: boolean;
  rating?: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  availability?: string[];
  business_id?: string;
}
