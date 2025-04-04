
// Ad Types
export type AdSlotType = 
  | "homepage_banner_1" 
  | "homepage_banner_2" 
  | "sponsored_product"
  | "sponsored_service" 
  | "trending_boost" 
  | "featured_business_pin"
  | "local_banner";

export interface AdSlot {
  id: string;
  name: string;
  type: AdSlotType | string;
  description?: string;
  daily_price: number;
  monthly_price: number;
  exclusive_price: number | null;
  position: string;
  max_rotation_slots: number;
  rotation_interval_seconds: number;
  is_active: boolean;
  
  // Additional fields from database
  active?: boolean;
  cpc_rate?: number;
  cpm_rate?: number;
  created_at?: string;
  location?: string;
  max_size_kb?: number;
  priority?: number;
  size?: string;
}

export interface AdCampaign {
  id: string;
  user_id: string;  // Required field
  business_id: string;
  slot_id?: string;
  title: string;
  description: string;
  image_url: string | null;
  product_id?: string | null;
  service_id?: string | null;
  reference_id?: string | null;
  start_date: string;
  end_date: string;
  pricing_type?: "daily" | "monthly" | "exclusive";
  total_price?: number;
  is_exclusive?: boolean;
  status: "pending" | "active" | "expired" | "rejected";
  impressions?: number; 
  clicks?: number;
  created_at: string;
  
  // Additional fields from database
  budget?: number;
  carousel_images?: any;
  format?: string;
  location?: string;
  reach?: number;
  targeting_age_max?: number | null;
  targeting_age_min?: number | null;
  targeting_gender?: string | null;
  targeting_interests?: any;
  targeting_locations?: any;
  type?: string;
  video_url?: string | null;
}

export interface AdSlotWithCampaigns extends AdSlot {
  campaigns: AdCampaign[];
}
