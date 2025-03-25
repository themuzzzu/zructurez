
import { supabase } from "@/integrations/supabase/client";

export type AdType = "business" | "service" | "product" | "sponsored";
export type AdFormat = "standard" | "banner" | "carousel" | "video" | "boosted_post";
export type TargetingOptions = {
  locations?: string[];
  interests?: string[];
  ageMin?: number;
  ageMax?: number;
  gender?: "male" | "female" | "all";
};

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
  targeting_locations: string[] | null;
  targeting_interests: string[] | null;
  targeting_age_min: number | null;
  targeting_age_max: number | null;
  targeting_gender: string | null;
  status: string;
  created_at: string;
  clicks: number;
  reach: number;
  business_id?: string;
}

export const fetchUserAds = async (): Promise<Advertisement[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('advertisements')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user ads:', error);
    return [];
  }

  return data as Advertisement[] || [];
};

export const fetchActiveAds = async (
  businessId?: string, 
  type: string = "sponsored", 
  limit: number = 10
) => {
  let query = supabase
    .from('advertisements')
    .select('*')
    .eq('status', 'active')
    .gte('end_date', new Date().toISOString())
    .order('created_at', { ascending: false });
    
  if (businessId) {
    query = query.eq('business_id', businessId);
  }
  
  if (type) {
    query = query.eq('type', type);
  }
  
  const { data, error } = await query.limit(limit);
  
  if (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
  
  return data;
};

export const incrementAdView = async (adId: string) => {
  try {
    const { error } = await supabase.rpc('increment_ad_views', { ad_id: adId });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error recording ad view:', err);
    return false;
  }
};

export const incrementAdClick = async (adId: string) => {
  try {
    const { error } = await supabase.rpc('increment_ad_clicks', { ad_id: adId });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error recording ad click:', err);
    return false;
  }
};

// For future use - we'll rely on existing RPC functions for now
export const recordAdImpression = async (adId: string) => {
  try {
    return await incrementAdView(adId);
  } catch (err) {
    console.error('Error recording ad impression:', err);
    return false;
  }
};

export const recordAdConversion = async (adId: string) => {
  try {
    // For now, just increment clicks as we don't have a specific conversion RPC yet
    return await incrementAdClick(adId);
  } catch (err) {
    console.error('Error recording ad conversion:', err);
    return false;
  }
};
