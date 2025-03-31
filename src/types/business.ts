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
  website: string;
  category: string;
  sub_category: string;
  logo_url: string;
  cover_url: string | null; // Added this property
  hours: BusinessHours;
  ratings: number;
  reviews_count: number;
  is_verified: boolean;
  is_featured: boolean;
  is_open: boolean;
  latitude: number;
  longitude: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  social_media: SocialMedia;
  services: Service[];
  products: Product[];
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
