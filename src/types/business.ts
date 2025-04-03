
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

export interface BusinessOwner {
  name: string | null;
  role: string;
  position?: string | null;
  experience?: string | null;
  bio?: string;
  image_url?: string | null;
  qualifications?: string;
}

export interface StaffMember {
  name: string | null;
  position?: string | null;
  experience?: string | null;
  bio?: string;
  image_url?: string | null;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  views?: number;
  business_id: string;
  created_at: string;
}

export interface BusinessHours {
  [day: string]: {
    open: string;
    close: string;
  } | string | null;
}

export interface UserPost {
  id: string;
  user_id: string;
  profile_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  category?: string;
  location?: string;
  business_id?: string;
  likes_count?: number;
  comments_count?: number;
  reposts_count?: number;
  profile?: {
    id: string;
    username: string;
    avatar_url?: string;
    name?: string;
    full_name?: string;
  };
}

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  location?: string;
  contact?: string;
  hours?: string | BusinessHours;
  image_url?: string | null;
  video_url?: string | null;
  bio?: string | null;
  website?: string | null;
  user_id: string;
  created_at: string;
  verified?: boolean;
  is_open?: boolean;
  wait_time?: string;
  closure_reason?: string;
  owners?: BusinessOwner[];
  staff_details?: StaffMember[];
  business_products?: BusinessProduct[];
  business_portfolio?: PortfolioItem[];
  business_hours?: string | BusinessHours;
  appointment_price?: number;
  consultation_price?: number;
  image_scale?: number;
  image_position?: {
    x: number;
    y: number;
  };
  verification_documents?: any[];
  membership_plans?: any[];
  show_in_services?: boolean;
}

export type MenuType = 'menu' | 'list' | 'catalog';
