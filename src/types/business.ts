
// This file defines the business-related types for the application

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  image_url?: string;
  cover_url?: string;
  logo_url?: string;
  tags?: string[];
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  website?: string;
  ratings?: number;
  reviews_count?: number;
  is_verified?: boolean;
  verified?: boolean;
  is_featured?: boolean;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at?: string;
  owner_id?: string;
  business_hours?: BusinessHours;
  social_media?: SocialMedia;
  services?: BusinessService[];
  products?: BusinessProduct[];
  business_products?: BusinessProduct[];
  business_portfolio?: PortfolioItem[];
  contact?: string;
  bio?: string;
  aadhar_number?: string;
  appointment_price?: number;
  consultation_price?: number;
  closure_reason?: string;
  verified_reason?: string;
  status?: string;
  image_position?: ImagePosition;
  posts?: UserPost[];
}

export interface BusinessHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

export interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

export interface BusinessService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  business_id: string;
}

export interface BusinessProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  business_id: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  business_id: string;
}

export interface BusinessOwner {
  id?: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  contact?: string;
  business_id?: string;
}

export interface StaffMember {
  id?: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  contact?: string;
  business_id?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  business_id: string;
}

export interface UserPost {
  id: string;
  user_id: string;
  profile_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  likes_count?: number;
  comments_count?: number;
  reposts_count?: number;
  profile?: {
    id: string;
    username: string;
    avatar_url?: string;
    full_name?: string;
  };
}

export interface ImagePosition {
  x: number;
  y: number;
}
