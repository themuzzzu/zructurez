
export interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string | null;
  category: string;
  sub_category: string;
  logo_url: string;
  cover_url: string | null;
  hours: BusinessHours;
  ratings: number;
  reviews_count: number;
  is_verified: boolean;
  is_featured: boolean;
  is_open: boolean;
  latitude: number;
  longitude: number;
  owner_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  social_media: SocialMedia;
  services: Service[];
  products: Product[];
  image_url: string;
  bio: string | null;
  location: string | null;
  contact: string | null;
  verified: boolean;
  appointment_price: number | null;
  consultation_price: number | null;
  business_products: BusinessProduct[];
  business_portfolio: BusinessPortfolioItem[];
  posts: BusinessPost[];
  staff_details: StaffMember[];
  owners: BusinessOwner[];
  image_position: ImagePosition;
  verification_documents: any[];
  membership_plans: MembershipPlan[];
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
}

export interface SocialMedia {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  business_id: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  business_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
  bio: string;
  location: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserPost {
  id: string;
  user_id: string;
  content: string;
  image_url: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  reposts_count: number;
  profile: {
    username: string;
    avatar_url: string;
  };
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  profile: {
    username: string;
    avatar_url: string;
  };
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  type?: string;
  category?: string;
  price?: number;
  isSponsored?: boolean;
}

export interface SearchSuggestion {
  id: string;
  term: string;
  isSponsored?: boolean;
}

export interface SearchFilters {
  includeSponsored: boolean;
}

// Add new interfaces that were missing

export interface BusinessProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  business_id: string;
  created_at: string;
  stock?: number;
  category?: string;
}

export interface BusinessPortfolioItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  business_id: string;
  created_at: string;
  views?: number;
}

export interface BusinessPost {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  business_id: string;
  user_id: string;
  category?: string;
}

export interface StaffMember {
  name: string | null;
  position: string | null;
  experience: string | null;
  image_url?: string | null;
  bio?: string;
}

export interface BusinessOwner {
  name: string | null;
  role: string;
  position: string | null;
  experience: string | null;
  image_url?: string | null;
  qualifications?: string;
  bio?: string;
}

export interface ImagePosition {
  x: number;
  y: number;
}

export interface MembershipPlan {
  name: string;
  price: number;
  features: string[];
  description?: string;
}
