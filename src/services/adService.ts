
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

// Define the ad types as an enum for type safety
export type AdType = "product" | "business" | "service" | "sponsored" | "post";
export type AdFormat = "standard" | "banner" | "video" | "carousel" | "recommendation" | "boosted_post";

// Define the Advertisement type to match the database schema
export interface Advertisement {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: AdType;
  reference_id: string;
  location: string;
  budget: number;
  start_date: string;
  end_date: string;
  status: "active" | "pending" | "rejected" | "expired";
  created_at: string;
  updated_at?: string;
  image_url: string | null;
  video_url?: string;
  carousel_images?: Json;
  format?: AdFormat;
  targeting_locations?: Json;
  targeting_interests?: Json;
  targeting_age_min?: number;
  targeting_age_max?: number;
  targeting_gender?: string;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  business_id?: string;
  reach?: number;
}

export interface AdPlacement {
  id: string;
  name: string;
  type: string;
  location: string;
  cpm_rate: number;
  cpc_rate: number;
  description: string;
  active: boolean;
  created_at: string;
  size?: string;
  max_size_kb?: number;
  priority?: number;
  impressions?: number;
  clicks?: number;
  revenue?: number;
}

// Fetch active ads for display
export const fetchActiveAds = async (
  type?: AdType,
  format?: AdFormat,
  limit: number = 10
): Promise<Advertisement[]> => {
  try {
    let query = supabase
      .from('advertisements')
      .select('*')
      .eq('status', 'active')
      .lt('end_date', new Date().toISOString());
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (format) {
      query = query.eq('format', format);
    }
    
    const { data, error } = await query
      .order('budget', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    // Cast the data to ensure it matches our Advertisement type
    return (data || []) as Advertisement[];
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    return [];
  }
};

// Fetch ads for a specific user
export const fetchUserAds = async (): Promise<Advertisement[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []) as Advertisement[];
  } catch (error) {
    console.error('Error fetching user advertisements:', error);
    return [];
  }
};

// Increment ad views
export const incrementAdView = async (adId: string): Promise<void> => {
  try {
    // We'll use the ad_analytics table
    const { data, error } = await supabase
      .from('ad_analytics')
      .select('impressions')
      .eq('ad_id', adId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) {
      // Insert new record if it doesn't exist
      await supabase
        .from('ad_analytics')
        .insert({
          ad_id: adId,
          impressions: 1
        });
    } else {
      // Update existing record
      await supabase
        .from('ad_analytics')
        .update({ impressions: data.impressions + 1 })
        .eq('ad_id', adId);
    }
    
    // Also update the advertisement reach counter directly
    await supabase
      .from('advertisements')
      .update({ reach: supabase.rpc('increment_ad_views', { ad_id: adId }) })
      .eq('id', adId);
    
  } catch (error) {
    console.error('Error incrementing ad view:', error);
  }
};

// Increment ad clicks
export const incrementAdClick = async (adId: string): Promise<void> => {
  try {
    // We'll use the ad_analytics table
    const { data, error } = await supabase
      .from('ad_analytics')
      .select('clicks')
      .eq('ad_id', adId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) {
      // Insert new record if it doesn't exist
      await supabase
        .from('ad_analytics')
        .insert({
          ad_id: adId,
          clicks: 1
        });
    } else {
      // Update existing record
      await supabase
        .from('ad_analytics')
        .update({ clicks: data.clicks + 1 })
        .eq('ad_id', adId);
    }
    
    // Also update the advertisement clicks counter directly
    await supabase
      .from('advertisements')
      .update({ clicks: supabase.rpc('increment_ad_clicks', { ad_id: adId }) })
      .eq('id', adId);
    
  } catch (error) {
    console.error('Error incrementing ad click:', error);
  }
};
