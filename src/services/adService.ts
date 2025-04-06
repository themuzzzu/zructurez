
import { supabase } from "@/integrations/supabase/client";

// Ad Types
export type AdType = "business" | "service" | "product" | "sponsored";
export type AdFormat = "standard" | "banner" | "carousel" | "video" | "boosted_post";
export type AdStatus = "active" | "paused" | "completed" | "rejected" | "pending";

export interface Advertisement {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: AdType;
  format: AdFormat;
  reference_id: string;
  location: string;
  budget: number;
  start_date: string;
  end_date: string;
  image_url: string | null;
  video_url: string | null;
  carousel_images: string[] | null;
  status: AdStatus;
  created_at: string;
  updated_at: string;
  impressions: number;
  clicks: number;
  ctr: number;
  targeting_locations?: string[];
  targeting_interests?: string[];
  targeting_age_min?: number;
  targeting_age_max?: number;
  targeting_gender?: string;
}

export interface AdPlacement {
  id: string;
  name: string;
  description: string;
  type: string;
  location: string;
  size: string;
  cpm_rate: number;
  cpc_rate: number;
  active: boolean;
  max_size_kb: number;
  priority: number;
}

// Fetch a user's ads
export const fetchUserAds = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user ads:', error);
    throw error;
  }
};

// Track ad views for analytics
export const incrementAdView = async (adId: string) => {
  try {
    // Update the impressions count for the ad
    const { error: adError } = await supabase.rpc('increment_ad_impressions', {
      ad_id: adId
    });

    if (adError) throw adError;
    
    // Add a record to ad_analytics
    const { error: analyticsError } = await supabase
      .from('ad_analytics')
      .insert({
        ad_id: adId,
        event_type: 'impression',
        timestamp: new Date().toISOString()
      });
    
    if (analyticsError) throw analyticsError;
    
    return true;
  } catch (error) {
    console.error('Error incrementing ad view:', error);
    throw error;
  }
};

// Track ad clicks for analytics
export const incrementAdClick = async (adId: string) => {
  try {
    // Update the clicks count for the ad
    const { error: adError } = await supabase.rpc('increment_ad_clicks', {
      ad_id: adId
    });
    
    if (adError) throw adError;
    
    // Add a record to ad_analytics
    const { error: analyticsError } = await supabase
      .from('ad_analytics')
      .insert({
        ad_id: adId,
        event_type: 'click',
        timestamp: new Date().toISOString()
      });
    
    if (analyticsError) throw analyticsError;
    
    return true;
  } catch (error) {
    console.error('Error incrementing ad click:', error);
    throw error;
  }
};

// Fetch ad placements
export const fetchAdPlacements = async () => {
  try {
    const { data, error } = await supabase
      .from('ad_placements')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching ad placements:', error);
    throw error;
  }
};
