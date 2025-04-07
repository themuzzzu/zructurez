
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
  reference_id: string;
  carousel_images?: string[];
  business_id?: string;
  start_date: string;
  end_date: string;
  budget: number;
  clicks: number;
  impressions?: number; // Optional since it's missing from DB table
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
  clicks?: number;      // Added for AdPlacement.tsx compatibility
  revenue?: number;     // Added for AdPlacement.tsx compatibility
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

    // Ensure all returned data conforms to the AdPlacement type
    return (data || []).map(item => ({
      ...item,
      impressions: item.impressions || 0,
      clicks: item.clicks || 0,
      revenue: item.revenue || 0
    }));
  } catch (error) {
    console.error("Error in getAdPlacements:", error);
    return [];
  }
};

// Fetch active ads function
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

    // Properly transform the data to match the Advertisement interface
    return (data || []).map(ad => ({
      ...ad,
      carousel_images: Array.isArray(ad.carousel_images) ? ad.carousel_images.map(String) : [],
      clicks: ad.clicks || 0,
      impressions: 0, // Handle missing impressions field
      reach: ad.reach || 0,
      targeting_locations: Array.isArray(ad.targeting_locations) ? ad.targeting_locations.map(String) : [],
      targeting_interests: Array.isArray(ad.targeting_interests) ? ad.targeting_interests.map(String) : []
    }));
  } catch (error) {
    console.error("Error in fetchActiveAds:", error);
    return getFallbackAds("home", "banner");
  }
};

// Add fetchUserAds function
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

    // Transform data to match Advertisement interface
    return (data || []).map(ad => ({
      ...ad,
      carousel_images: Array.isArray(ad.carousel_images) ? ad.carousel_images.map(String) : [],
      clicks: ad.clicks || 0,
      impressions: 0, // Handle missing impressions field
      reach: ad.reach || 0,
      targeting_locations: Array.isArray(ad.targeting_locations) ? ad.targeting_locations.map(String) : [],
      targeting_interests: Array.isArray(ad.targeting_interests) ? ad.targeting_interests.map(String) : []
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

    // Transform data to match Advertisement interface
    return (data || []).map(ad => ({
      ...ad,
      carousel_images: Array.isArray(ad.carousel_images) ? ad.carousel_images.map(String) : [],
      clicks: ad.clicks || 0,
      impressions: 0, // Handle missing impressions field
      reach: ad.reach || 0,
      targeting_locations: Array.isArray(ad.targeting_locations) ? ad.targeting_locations.map(String) : [],
      targeting_interests: Array.isArray(ad.targeting_interests) ? ad.targeting_interests.map(String) : []
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
    const newAd = {
      ...adData,
      id: uuidv4(),
      clicks: 0,
      status: "pending",
      reach: 0,
      // Make sure reference_id is provided (required in DB)
      reference_id: adData.reference_id || adData.business_id || uuidv4()
    };
    
    const { data, error } = await supabase.from("advertisements").insert(newAd).select();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.[0]?.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Implement incrementAdView function directly without using RPC
export const incrementAdView = async (adId: string): Promise<boolean> => {
  try {
    // Get current data first since we can't use RPC
    const { data: adData, error: fetchError } = await supabase
      .from("advertisements")
      .select("reach")
      .eq("id", adId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching ad for view increment:", fetchError);
      return false;
    }
    
    // Update with incremented values - only use reach since impressions doesn't exist
    const currentReach = adData?.reach !== undefined ? adData.reach : 0;
    
    const { error: updateError } = await supabase
      .from("advertisements")
      .update({ 
        reach: currentReach + 1 
      })
      .eq("id", adId);

    if (updateError) {
      console.error("Error updating ad view:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in incrementAdView:", error);
    return false;
  }
};

// Implement incrementAdClick function directly without using RPC
export const incrementAdClick = async (adId: string): Promise<boolean> => {
  try {
    // Get current data first since we can't use RPC
    const { data: adData, error: fetchError } = await supabase
      .from("advertisements")
      .select("clicks")
      .eq("id", adId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching ad for click increment:", fetchError);
      return false;
    }
    
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
      reference_id: "fallback-reference"
    }
  ];
};
