export interface BusinessOwner {
  name: string | null;
  role: string;
  position: string | null;
  experience: string | null;
  bio?: string | null;
  qualifications?: string | null;
  image_url?: string | null;
}

export interface StaffMember {
  name: string | null;
  position: string | null;
  experience: string | null;
  bio?: string | null;
  image_url?: string | null;
}

export interface BusinessPortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  views: number | null;
}

export interface BusinessProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  stock: number | null;
}

export interface BusinessPost {
  id: string;
  content: string;
  image_url: string | null;
  category: string | null;
  created_at: string;
  profile_id: string;
  user_id: string;
  location: string | null;
  views: number | null;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  category: string;
  description: string;
  location?: string;
  contact?: string;
  hours?: string;
  image_url?: string;
  video_url?: string;
  verified?: boolean;
  created_at: string;
  appointment_price?: number;
  consultation_price?: number;
  bio?: string;
  website?: string;
  image_scale?: number;
  image_position: { x: number; y: number };
  staff_details: StaffMember[];
  owners: BusinessOwner[];
  show_in_services?: boolean;
  is_open?: boolean;
  wait_time?: string;
  closure_reason?: string;
  aadhar_number?: string;
  pan_number?: string;
  gst_number?: string;
  verification_status?: string;
  verification_submitted_at?: string;
  verification_documents: any[];
  membership_plans: any[];
  business_portfolio?: BusinessPortfolioItem[];
  business_products?: BusinessProduct[];
  posts?: BusinessPost[];
}