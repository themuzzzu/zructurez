
export interface Business {
  id: string;
  name: string;
  business_name?: string;
  category: string;
  description: string;
  image_url?: string;
  location?: string;
  city?: string;
  contact?: string;
  hours?: string;
  business_hours?: BusinessHours | string;
  verified?: boolean;
  is_active?: boolean;
  appointment_price?: number;
  consultation_price?: number;
  is_open?: boolean;
  wait_time?: string;
  closure_reason?: string;
  latitude?: number;
  longitude?: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  bio?: string;
  website?: string;
  owners?: BusinessOwner[];
  staff_details?: StaffMember[];
  business_portfolio?: PortfolioItem[];
  business_products?: BusinessProduct[];
}

export interface BusinessHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

export interface BusinessOwner {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  image_url?: string;
  role?: string;
  position?: string;
  experience?: string;
  qualifications?: string;
  bio?: string;
}

export interface StaffMember {
  id?: string;
  name: string;
  role?: string;
  position?: string;
  phone?: string;
  avatar_url?: string;
  image_url?: string;
  specialties?: string[];
  experience?: string;
  bio?: string;
}

export interface PortfolioItem {
  id?: string;
  title: string;
  description?: string;
  image_url: string;
  category?: string;
  created_at?: string;
  views?: number;
}

export interface UserPost {
  id: string;
  content: string;
  image_url?: string;
  user_id: string;
  business_id: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
}

export interface BusinessProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  business_id: string;
  is_available: boolean;
  created_at: string;
  stock?: number;
}
