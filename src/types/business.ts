
export interface ImagePosition {
  x: number;
  y: number;
}

export interface BusinessOwner {
  id?: string;
  name: string;
  role: string;
  position?: string;
  experience?: string;
  qualifications?: string;
  bio?: string;
  image_url?: string | null;
  contact?: string;
  business_id?: string;
}

export interface StaffMember {
  id?: string;
  name: string | null;
  position?: string | null;
  experience?: string | null;
  role?: string;
  bio?: string;
  image_url?: string | null;
}

export interface BusinessProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  image_url?: string;
  stock?: number;
  created_at?: string;
  business_id?: string;
}

export interface BusinessHours {
  [day: string]: {
    open: string;
    close: string;
  } | string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  location?: string;
  contact?: string;
  hours?: string | BusinessHours;
  business_hours?: string | BusinessHours;
  verified?: boolean;
  image_url?: string;
  image_scale?: number;
  image_position?: ImagePosition;
  bio?: string;
  website?: string;
  appointment_price?: number;
  consultation_price?: number;
  owners?: BusinessOwner[];
  staff_details?: StaffMember[];
  business_products?: BusinessProduct[];
  wait_time?: string;
  is_open?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  cover_url?: string;
  ratings?: number;
  reviews_count?: number;
  is_featured?: boolean;
  closure_reason?: string;
  business_portfolio?: PortfolioItem[];
  posts?: UserPost[];
}

export interface PortfolioItem {
  id: string;
  business_id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  views?: number | null;
}

export interface UserPost {
  id: string;
  user_id: string;
  profile_id?: string;
  content: string;
  image_url?: string;
  created_at: string;
  category?: string;
  likes_count?: number;
  comments_count?: number;
  reposts_count?: number;
  profile?: {
    id?: string;
    username?: string;
    avatar_url?: string | null;
    full_name?: string;
    name?: string;
  };
  location?: string;
  business_id?: string;
  views?: number;
}
