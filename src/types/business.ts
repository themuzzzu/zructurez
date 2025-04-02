
export type MenuType = 'menu' | 'list';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  price_unit?: string;
  image_url?: string;
  availability: 'in_stock' | 'out_of_stock';
  subcategory_id: string;
  business_id: string;
  created_at: string;
}

export interface MenuSubcategory {
  id: string;
  name: string;
  category_id: string;
  business_id: string;
  created_at: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  business_id: string;
  created_at: string;
  is_custom?: boolean;
}

export interface BusinessMenu {
  id: string;
  business_id: string;
  display_type: MenuType;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  is_draft: boolean;
}

export interface BusinessProduct {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image_url?: string;
  category?: string;
  created_at: string;
}

export interface Owner {
  name: string;
  role: string;
  position: string;
  experience: string;
  qualifications?: string;
  bio?: string;
  image_url?: string | null;
}

// Alias for Owner to handle older code references
export type BusinessOwner = Owner;

export interface StaffMember {
  name: string;
  position: string;
  experience: string;
  bio?: string;
  image_url?: string | null;
}

export interface MembershipPlan {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  price: number;
  duration: string;
  features?: string[];
  created_at: string;
}

export interface BusinessPhoto {
  id: string;
  business_id: string;
  title: string;
  image_url: string;
  created_at: string;
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

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  location?: string;
  contact?: string;
  hours?: string;
  verified?: boolean;
  image_url?: string;
  cover_url?: string;
  bio?: string;
  video_url?: string;
  website?: string;
  user_id: string;
  created_at: string;
  appointment_price?: number;
  consultation_price?: number;
  show_in_services?: boolean;
  is_open?: boolean;
  image_scale?: number;
  image_position?: { x: number; y: number };
  staff_details?: StaffMember[];
  owners?: Owner[];
  wait_time?: string;
  closure_reason?: string;
  verification_status?: 'pending' | 'approved' | 'rejected';
  verification_submitted_at?: string;
  verification_documents?: any[];
  gst_number?: string;
  pan_number?: string;
  aadhar_number?: string;
  business_portfolio?: PortfolioItem[];
  business_products?: BusinessProduct[];
  business_photos?: BusinessPhoto[];
  business_hours?: BusinessHours;
  posts?: any[];
  membership_plans?: MembershipPlan[];
}

export interface PortfolioItem {
  id: string;
  business_id: string;
  title: string;
  description?: string;
  image_url?: string;
  created_at: string;
  views?: number;
}

// Add UserPost type to address the imported but unused error
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
  views?: number;
  likes_count?: number;
  comments_count?: number;
  reposts_count?: number;
  profile?: {
    username?: string;
    avatar_url?: string;
    name?: string;
  };
  groups?: {
    name: string;
    image_url: string | null;
  };
}
