
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
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone?: string;
  avatar_url?: string;
  specialties?: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  category?: string;
  created_at: string;
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
}
