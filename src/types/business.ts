
export interface StaffMember {
  name: string | null;
  position: string | null;
  experience: string | null;
  bio?: string | null;
  image_url?: string | null;
}

export interface BusinessOwner {
  name: string | null;
  role: string;
  position: string | null;
  experience: string | null;
  bio?: string | null;
  image_url?: string | null;
}

export interface BusinessProduct {
  id: string;
  business_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  stock: number | null;
  created_at: string;
  category?: string;
}

export interface BusinessPortfolio {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  views: number | null;
}

export interface MembershipPlan {
  name: string;
  price: number;
  features: string[];
  description?: string;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  category: string;
  description: string;
  location: string | null;
  contact: string | null;
  hours: string | null;
  image_url: string | null;
  video_url: string | null;
  verified: boolean;
  created_at: string;
  appointment_price: number | null;
  consultation_price: number | null;
  bio: string | null;
  website: string | null;
  image_scale: number;
  image_position: { x: number; y: number };
  staff_details: StaffMember[];
  owners: BusinessOwner[];
  show_in_services: boolean;
  is_open: boolean;
  wait_time: string | null;
  closure_reason: string | null;
  aadhar_number: string | null;
  pan_number: string | null;
  gst_number: string | null;
  verification_status: string | null;
  verification_submitted_at: string | null;
  verification_documents: any[];
  membership_plans: MembershipPlan[];
  business_products: BusinessProduct[];
  business_portfolio: BusinessPortfolio[];
  posts: any[];
}
