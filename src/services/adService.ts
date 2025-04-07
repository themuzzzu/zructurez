
import { supabase } from "@/integrations/supabase/client";
import type { AdType, Advertisement, AdFormat, AdStatus, AdPlacement } from "@/types/advertising";

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
    // Using a simple update instead of RPC since the RPC doesn't exist
    const { error } = await supabase
      .from('advertisements')
      .update({ impressions: supabase.rpc('increment', { row_id: adId, column_name: 'impressions' }) })
      .eq('id', adId);
    
    if (error) {
      console.error("Error incrementing ad view:", error);
    }
  } catch (error) {
    console.error("Error in incrementAdView:", error);
  }
};

export const incrementAdClick = async (adId: string): Promise<void> => {
  try {
    // Using a simple update instead of RPC since the RPC doesn't exist
    const { error } = await supabase
      .from('advertisements')
      .update({ clicks: supabase.rpc('increment', { row_id: adId, column_name: 'clicks' }) })
      .eq('id', adId);
    
    if (error) {
      console.error("Error incrementing ad click:", error);
    }
  } catch (error) {
    console.error("Error in incrementAdClick:", error);
  }
};

export { type AdType, type Advertisement, type AdFormat, type AdStatus, type AdPlacement };
