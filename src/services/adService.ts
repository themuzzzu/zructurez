
import { supabase } from "@/integrations/supabase/client";

// Define the ad types as an enum for type safety
export type AdType = "product" | "business" | "service" | "post";
export type AdFormat = "standard" | "banner" | "video" | "carousel" | "recommendation";

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
  carousel_images?: any[];
  format?: AdFormat;
  targeting_locations?: string[];
  targeting_interests?: string[];
  targeting_age_min?: number;
  targeting_age_max?: number;
  targeting_gender?: string;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  business_id?: string;
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

// Increment ad views
export const incrementAdView = async (adId: string): Promise<void> => {
  try {
    // We'll use a direct update instead of RPC for simplicity
    const { data, error } = await supabase
      .from('advertisements')
      .select('impressions')
      .eq('id', adId)
      .single();
    
    if (error) throw error;
    
    const newImpressions = (data?.impressions || 0) + 1;
    
    await supabase
      .from('advertisements')
      .update({ impressions: newImpressions })
      .eq('id', adId);
      
    // Also record in ad_metrics if we have that table
    try {
      await supabase
        .from('ad_metrics')
        .insert({
          ad_id: adId,
          type: 'impression',
          timestamp: new Date().toISOString()
        });
    } catch (metricError) {
      // Ignore errors with metrics
      console.log('Could not record ad metric:', metricError);
    }
    
  } catch (error) {
    console.error('Error incrementing ad view:', error);
  }
};

// Increment ad clicks
export const incrementAdClick = async (adId: string): Promise<void> => {
  try {
    // We'll use a direct update instead of RPC for simplicity
    const { data, error } = await supabase
      .from('advertisements')
      .select('clicks')
      .eq('id', adId)
      .single();
    
    if (error) throw error;
    
    const newClicks = (data?.clicks || 0) + 1;
    
    await supabase
      .from('advertisements')
      .update({ clicks: newClicks })
      .eq('id', adId);
      
    // Also record in ad_metrics if we have that table
    try {
      await supabase
        .from('ad_metrics')
        .insert({
          ad_id: adId,
          type: 'click',
          timestamp: new Date().toISOString()
        });
    } catch (metricError) {
      // Ignore errors with metrics
      console.log('Could not record ad metric:', metricError);
    }
    
  } catch (error) {
    console.error('Error incrementing ad click:', error);
  }
};
