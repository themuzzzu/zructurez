
export interface Service {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  imageUrl?: string; // alternative property name sometimes used
  price: number;
  user_id: string;
  category?: string;
  location?: string;
  contact_info?: string;
  is_sponsored?: boolean;
  availability?: string[] | string;
}
