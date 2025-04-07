
import { supabase } from "@/integrations/supabase/client";

export type AdType = 
  | "product"
  | "service"
  | "business"
  | "event"
  | "general"
  | "sponsored"; // Add "sponsored" type

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  type: AdType;
  format: AdFormat;
  reference_id: string;
  status: AdStatus;
  user_id: string;
  location: string;
  budget: number;
  clicks: number;
  impressions: number; // Make sure this is always required
  start_date: string;
  end_date: string;
  created_at: string;
  video_url: string | null;
  carousel_images: any;
  business_id?: string;
  reach?: number; // Add optional reach property
}

export type AdFormat = 
  | "banner"
  | "sidebar"
  | "popup"
  | "inline"
  | "carousel"
  | "video"
  | "standard"     // Add these additional formats
  | "boosted_post" // that are used in the components
  | "card"
  | "featured";

export type AdStatus = 
  | "active"
  | "pending"
  | "rejected"
  | "expired"
  | "paused"
  | "completed"; // Add "completed" status

export interface AdPlacement {
  id: string;
  name: string;
  location: string;
  type: string;
  size?: string;
  cpc_rate?: number;
  cpm_rate?: number;
  description?: string;
  active?: boolean;
  max_size_kb?: number;
  priority?: number;
}

export const fetchActiveAds = async (type?: AdType, format: string = "banner", limit: number = 3): Promise<Advertisement[]> => {
  try {
    let query = supabase
      .from("advertisements")
      .select("*")
      .eq("status", "active")
      .eq("format", format)
      .gte("end_date", new Date().toISOString());
    
    if (type) {
      query = query.eq("type", type);
    }
    
    const { data, error } = await query.limit(limit);
    
    if (error) {
      console.error("Error fetching ads:", error);
      return [];
    }
    
    // Transform and ensure all required fields are present
    const transformedData = (data || []).map(ad => ({
      ...ad,
      impressions: ad.impressions || ad.reach || 0, // Use reach as fallback for impressions
      clicks: ad.clicks || 0, // Add default for clicks too
      type: (ad.type || "general") as AdType,
      format: (ad.format || "banner") as AdFormat,
      status: (ad.status || "active") as AdStatus
    })) as Advertisement[];
    
    return transformedData;
  } catch (error) {
    console.error("Error in fetchActiveAds:", error);
    return [];
  }
};

export const incrementAdView = async (adId: string): Promise<void> => {
  try {
    // Check if adId is a valid UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(adId)) {
      console.warn("Invalid UUID format for adId:", adId);
      return;
    }

    // Call the increment_ad_views function directly
    const { error } = await supabase.rpc('increment_ad_views', { ad_id: adId });
    
    if (error) {
      console.error("Error incrementing ad view:", error);
    }
  } catch (error) {
    console.error("Error in incrementAdView:", error);
  }
};

export const incrementAdClick = async (adId: string): Promise<void> => {
  try {
    // Check if adId is a valid UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(adId)) {
      console.warn("Invalid UUID format for adId:", adId);
      return;
    }
    
    // Call the increment_ad_clicks function directly
    const { error } = await supabase.rpc('increment_ad_clicks', { ad_id: adId });
    
    if (error) {
      console.error("Error incrementing ad click:", error);
    }
  } catch (error) {
    console.error("Error in incrementAdClick:", error);
  }
};
