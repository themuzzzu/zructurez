
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Define the types that were missing or causing errors
export type AdType = "banner" | "square" | "leaderboard" | "carousel" | "sidebar" | "popup" | "business" | "service" | "product" | "sponsored";
export type AdFormat = "standard" | "banner" | "carousel" | "video" | "boosted_post";
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
  impressions: number;
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
  type: string; // Changed from AdType to string to fix type incompatibility
  size: string;
  active: boolean;
  cpc_rate: number;
  cpm_rate: number;
  priority: number;
  max_size_kb: number;
  impressions?: number; // Added for AdPlacement.tsx compatibility
  clicks?: number;     // Added for AdPlacement.tsx compatibility
  revenue?: number;    // Added for AdPlacement.tsx compatibility
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

// Add the missing fetchActiveAds function
export const fetchActiveAds = async (
  type?: string,
  format?: string,
  limit?: number
): Promise<Advertisement[]> => {
  try {
    let query = supabase
      .from("advertisements")
      .select("*")
      .eq("status", "active")
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString());

    if (type) {
      query = query.eq("type", type);
    }
    
    if (format) {
      query = query.eq("format", format);
    }
    
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching active ads:", error);
      return getFallbackAds("home", "banner");
    }

    // Ensure all required properties are present and handle any type conversion
    return (data || []).map(ad => ({
      ...ad,
      carousel_images: Array.isArray(ad.carousel_images) ? ad.carousel_images : [],
      clicks: ad.clicks || 0,
      impressions: ad.impressions || 0,
      reach: ad.reach || 0,
      targeting_locations: Array.isArray(ad.targeting_locations) ? ad.targeting_locations : [],
      targeting_interests: Array.isArray(ad.targeting_interests) ? ad.targeting_interests : []
    }));
  } catch (error) {
    console.error("Error in fetchActiveAds:", error);
    return getFallbackAds("home", "banner");
  }
};

// Add the missing fetchUserAds function
export const fetchUserAds = async (): Promise<Advertisement[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("advertisements")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user ads:", error);
      return [];
    }

    return (data || []).map(ad => ({
      ...ad,
      carousel_images: Array.isArray(ad.carousel_images) ? ad.carousel_images : [],
      clicks: ad.clicks || 0,
      impressions: ad.impressions || 0,
      reach: ad.reach || 0,
      targeting_locations: Array.isArray(ad.targeting_locations) ? ad.targeting_locations : [],
      targeting_interests: Array.isArray(ad.targeting_interests) ? ad.targeting_interests : []
    }));
  } catch (error) {
    console.error("Error in fetchUserAds:", error);
    return [];
  }
};

export const getAdvertisementsByLocation = async (
  location: AdLocation,
  type?: string
): Promise<Advertisement[]> => {
  try {
    let query = supabase
      .from("advertisements")
      .select("*")
      .eq("location", location)
      .eq("status", "active")
      .lte("start_date", new Date().toISOString())
      .gte("end_date", new Date().toISOString());

    if (type) {
      query = query.eq("type", type);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching ads for ${location}:`, error);
      return getFallbackAds(location, "banner");
    }

    // Ensure all required properties are present and handle any type conversion
    return (data || []).map(ad => ({
      ...ad,
      carousel_images: Array.isArray(ad.carousel_images) ? ad.carousel_images : [],
      clicks: ad.clicks || 0,
      impressions: ad.impressions || 0,
      reach: ad.reach || 0,
      targeting_locations: Array.isArray(ad.targeting_locations) ? ad.targeting_locations : [],
      targeting_interests: Array.isArray(ad.targeting_interests) ? ad.targeting_interests : []
    })).sort((a, b) => b.budget - a.budget);
  } catch (error) {
    console.error(`Error in getAdvertisementsByLocation for ${location}:`, error);
    return getFallbackAds(location, "banner");
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

// Add the missing incrementAdView function
export const incrementAdView = async (adId: string): Promise<boolean> => {
  try {
    // Check if the advertisements table has the impressions column
    const { data, error } = await supabase
      .rpc('increment_ad_view', { ad_id: adId });

    // If RPC fails, fall back to manual update
    if (error) {
      console.log("Falling back to manual update for incrementAdView");
      
      // Get current data first
      const { data: adData } = await supabase
        .from("advertisements")
        .select("impressions, reach")
        .eq("id", adId)
        .single();
      
      // Check if the impressions and reach fields exist and have values
      const currentImpressions = adData?.impressions !== undefined ? adData.impressions : 0;
      const currentReach = adData?.reach !== undefined ? adData.reach : 0;
      
      // Update with incremented values
      const { error: updateError } = await supabase
        .from("advertisements")
        .update({ 
          impressions: currentImpressions + 1, 
          reach: currentReach + 1 
        })
        .eq("id", adId);

      if (updateError) {
        console.error("Error updating ad impression:", updateError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error in incrementAdView:", error);
    return false;
  }
};

// Add the missing incrementAdClick function
export const incrementAdClick = async (adId: string): Promise<boolean> => {
  try {
    // Check if the advertisements table has the clicks column
    const { data, error } = await supabase
      .rpc('increment_ad_click', { ad_id: adId });

    // If RPC fails, fall back to manual update
    if (error) {
      console.log("Falling back to manual update for incrementAdClick");
      
      // Get current data first
      const { data: adData } = await supabase
        .from("advertisements")
        .select("clicks")
        .eq("id", adId)
        .single();
      
      // Check if clicks field exists and has a value
      const currentClicks = adData?.clicks !== undefined ? adData.clicks : 0;
      
      // Update with incremented value
      const { error: updateError } = await supabase
        .from("advertisements")
        .update({ clicks: currentClicks + 1 })
        .eq("id", adId);

      if (updateError) {
        console.error("Error updating ad click:", updateError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error in incrementAdClick:", error);
    return false;
  }
};

// Get mock/fallback ads when real ads aren't available
export const getFallbackAds = (location: AdLocation, type: string): Advertisement[] => {
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

