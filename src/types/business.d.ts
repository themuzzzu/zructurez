export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  location?: string;
  contact?: string;
  hours?: string;
  image_url?: string;
  user_id: string;
  verified?: boolean;
  created_at: string;
  bio?: string;
  website?: string;
  owners?: BusinessOwner[];
  staff_details?: BusinessStaff[];
  business_portfolio?: BusinessPortfolio[];
  business_products?: BusinessProduct[];
  is_open?: boolean;
  wait_time?: string;
  closure_reason?: string;
  appointment_price?: number;
  consultation_price?: number;
}

export interface BusinessProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock?: number;
  business_id: string;
  image_url?: string;
  created_at?: string;
  category?: string;
}

export interface BusinessOwner {
  id?: string;
  name: string;
  role: string;
  position: string;
  experience: string;
  qualifications: string;
  image_url: string;
}

export interface BusinessStaff {
  id?: string;
  name: string;
  position: string;
  experience: string;
  image_url: string;
}

export interface BusinessPortfolio {
  id?: string;
  title: string;
  description: string;
  image_url: string;
}
