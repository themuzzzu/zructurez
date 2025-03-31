
export interface BusinessHours {
  [day: string]: {
    open: string;
    close: string;
  };
}

export interface BusinessOwner {
  name: string | null;
  role: string;
  position: string | null;
  experience: string | null;
  image_url: string | null;
  bio?: string; // Added bio property
}

export interface StaffMember {
  name: string | null;
  position: string | null;
  experience: string | null;
  image_url: string | null;
}

export interface MembershipPlan {
  name: string;
  price: number;
  features: string[];
  description?: string;
}

// Added BusinessProduct interface
export interface BusinessProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  stock?: number;
  business_id: string;
  created_at: string;
}

// Added UserPost interface
export interface UserPost {
  id: string;
  content: string;
  user_id: string;
  profile_id: string;
  created_at: string;
  image_url?: string;
  category?: string;
  location?: string;
  business_id?: string;
  views?: number;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  user_id: string;
  image_url: string;
  is_open: boolean;
  created_at: string;
  
  // Address fields
  address: string;
  city: string;
  state: string;
  zip: string;
  
  // Contact details
  phone: string;
  email: string;
  
  // Additional info
  sub_category: string;
  logo_url: string;
  ratings: number;
  reviews_count: number;
  is_verified: boolean;
  verified: boolean;
  is_featured: boolean;
  latitude: number;
  longitude: number;
  tags: string[];
  social_media: { facebook: string; twitter: string; instagram: string; linkedin: string };
  services: any[];
  products: any[];
  
  // Optional fields with specific structure
  location: string | null;
  contact: string | null;
  bio: string | null;
  hours: BusinessHours | string;
  appointment_price: number | null;
  consultation_price: number | null;
  staff_details: StaffMember[];
  owners: BusinessOwner[];
  image_position: { x: number; y: number };
  verification_documents: any[];
  membership_plans: MembershipPlan[];
  business_portfolio: any[];
  business_products: any[];
  posts: any[];
  owner_id: string;
  cover_url: string | null;
  updated_at: string;
  website: string | null;
  
  // Additional database fields
  aadhar_number?: string;
  pan_number?: string;
  gst_number?: string;
  verification_status?: string;
  closure_reason?: string;
  wait_time?: string;
  video_url?: string;
  image_scale?: number;
  show_in_services?: boolean;
  verification_submitted_at?: string;
}
