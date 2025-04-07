
import { supabase } from "@/integrations/supabase/client";

export type AdType = 
  | "product"
  | "service"
  | "business"
  | "event"
  | "general";

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  type: AdType;
  format: string;
  reference_id: string;
  status: string;
  user_id: string;
  location: string;
  budget: number;
  clicks: number;
  impressions: number;
  start_date: string;
  end_date: string;
  created_at: string;
  video_url: string | null;
  carousel_images: any;
  business_id?: string;
}

export type AdFormat = 
  | "banner"
  | "sidebar"
  | "popup"
  | "inline"
  | "carousel"
  | "video";

export type AdStatus = 
  | "active"
  | "pending"
  | "rejected"
  | "expired"
  | "paused";

export type AdPlacement =
  | "homepage"
  | "marketplace"
  | "services"
  | "businesses"
  | "profile"
  | "search";

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
    
    return data || [];
  } catch (error) {
    console.error("Error in fetchActiveAds:", error);
    return [];
  }
};

export const incrementAdView = async (adId: string): Promise<void> => {
  try {
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
    // Call the increment_ad_clicks function directly
    const { error } = await supabase.rpc('increment_ad_clicks', { ad_id: adId });
    
    if (error) {
      console.error("Error incrementing ad click:", error);
    }
  } catch (error) {
    console.error("Error in incrementAdClick:", error);
  }
};
