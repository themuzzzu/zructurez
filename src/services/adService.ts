
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export type AdType = "banner" | "square" | "leaderboard" | "carousel" | "sidebar" | "popup";
export type AdLocation = "home" | "marketplace" | "businesses" | "services" | "events" | "profile";

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  status: string;
  type: string;
  location: string;
  reference_id?: string;
  carousel_images?: string[];
  business_id?: string;
  start_date: string;
  end_date: string;
  budget: number;
  clicks: number;
  impressions?: number;
  format: string;
  video_url?: string;
  user_id: string;
  created_at: string;
  targeting_locations?: string[];
  targeting_interests?: string[];
  targeting_age_min?: number;
  targeting_age_max?: number;
  targeting_gender?: string;
  reach?: number;
}

export type AdPlacement = {
  id: string;
  name: string;
  description: string;
  location: string;
  type: AdType;
  size: string;
  active: boolean;
  cpc_rate: number;
  cpm_rate: number;
  priority: number;
  max_size_kb: number;
};

export const getAdPlacements = async (): Promise<AdPlacement[]> => {
  try {
    const { data, error } = await supabase
      .from("ad_placements")
      .select("*")
      .eq("active", true);

    if (error) {
      console.error("Error fetching ad placements:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAdPlacements:", error);
    return [];
  }
};

export const getAdvertisementsByLocation = async (
  location: AdLocation,
  type?: AdType
): Promise<Advertisement[]> => {
  try {
    let query = supabase
      .from("advertisements")
      .select("*")
      .eq("location", location)
      .eq("status", "approved")
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString());

    if (type) {
      query = query.eq("type", type);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching ads for ${location}:`, error);
      return [];
    }

    // Sort by priority and/or budget
    return (data || []).sort((a, b) => b.budget - a.budget);
  } catch (error) {
    console.error(`Error in getAdvertisementsByLocation for ${location}:`, error);
    return [];
  }
};

export const createAdvertisement = async (
  adData: Omit<Advertisement, "id" | "created_at" | "clicks" | "impressions" | "status" | "reach">
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const { data, error } = await supabase.from("advertisements").insert({
      ...adData,
      id: uuidv4(),
      clicks: 0,
      impressions: 0,
      status: "pending",
      reach: 0,
    }).select();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.[0]?.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const recordAdImpression = async (
  adId: string
): Promise<boolean> => {
  try {
    // Get current impressions first
    const { data: adData, error: fetchError } = await supabase
      .from("advertisements")
      .select("impressions")
      .eq("id", adId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching ad for impression:", fetchError);
      return false;
    }
    
    // If impressions field doesn't exist, provide default value
    const currentImpressions = adData?.impressions || 0;
    
    // Update with incremented value
    const { error: updateError } = await supabase
      .from("advertisements")
      .update({ impressions: currentImpressions + 1, reach: currentImpressions + 1 })
      .eq("id", adId);

    if (updateError) {
      console.error("Error updating ad impression:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in recordAdImpression:", error);
    return false;
  }
};

export const recordAdClick = async (adId: string): Promise<boolean> => {
  try {
    // Get current clicks first
    const { data: adData, error: fetchError } = await supabase
      .from("advertisements")
      .select("clicks")
      .eq("id", adId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching ad for click:", fetchError);
      return false;
    }
    
    // Update with incremented value
    const currentClicks = adData?.clicks || 0;
    
    const { error: updateError } = await supabase
      .from("advertisements")
      .update({ clicks: currentClicks + 1 })
      .eq("id", adId);

    if (updateError) {
      console.error("Error updating ad click:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in recordAdClick:", error);
    return false;
  }
};

// Get mock/fallback ads when real ads aren't available
export const getFallbackAds = (location: AdLocation, type: AdType): Advertisement[] => {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + 30);
  
  return [
    {
      id: `fallback-${location}-1`,
      title: `${location.charAt(0).toUpperCase() + location.slice(1)} Advertisement`,
      description: "This is a fallback advertisement",
      image_url: `https://picsum.photos/seed/${location}/600/300`,
      status: "approved",
      type: type,
      location: location,
      start_date: now.toISOString(),
      end_date: future.toISOString(),
      budget: 100,
      clicks: 0,
      impressions: 0,
      format: "standard",
      user_id: "system",
      created_at: now.toISOString(),
      reference_id: undefined
    }
  ];
};
