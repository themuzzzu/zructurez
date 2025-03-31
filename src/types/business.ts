
export interface BusinessHours {
  open: string;
  close: string;
}

export interface StaffMember {
  name: string | null;
  position: string | null;
  experience: string | null;
  image_url?: string | null;
}

export interface BusinessOwner {
  name: string | null;
  role: string;
  position: string | null;
  experience: string | null;
  image_url?: string | null;
}

export interface MembershipPlan {
  name: string;
  price: number;
  features: string[];
  description?: string;
}

export interface BusinessProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock?: number;
  image_url?: string;
  category?: string;
  created_at?: string;
  business_id?: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  sub_category?: string;
  location: string;
  city?: string;
  state?: string;
  zip?: string;
  address?: string;
  contact?: string;
  phone?: string;
  email?: string;
  hours?: string;
  image_url?: string;
  logo_url?: string;
  cover_url?: string;
  video_url?: string;
  website?: string;
  bio?: string;
  verified?: boolean;
  is_verified?: boolean;
  is_featured?: boolean;
  is_open?: boolean;
  ratings?: number;
  reviews_count?: number;
  wait_time?: string;
  closure_reason?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  owner_id?: string;
  appointment_price?: number;
  consultation_price?: number;
  image_scale?: number;
  image_position?: { x: number; y: number };
  staff_details?: StaffMember[];
  owners?: BusinessOwner[];
  show_in_services?: boolean;
  aadhar_number?: string;
  gst_number?: string;
  pan_number?: string;
  verification_status?: string;
  verification_documents?: any[];
  verification_submitted_at?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  social_media?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  services?: any[];
  products?: any[];
  posts?: any[];
  membership_plans?: MembershipPlan[];
  // Additional fields for business portfolio and products
  business_portfolio?: any[];
  business_products?: BusinessProduct[];
}
