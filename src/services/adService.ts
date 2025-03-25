
import { supabase } from "@/integrations/supabase/client";

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
