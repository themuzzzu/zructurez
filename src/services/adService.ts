
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch active advertisements with optional filters
 * @param type Optional type filter
 * @param businessId Optional business ID filter
 * @param limit Optional limit on number of records to fetch
 * @returns Array of active advertisements
 */
export async function fetchActiveAds(type?: string, businessId?: string, limit?: number) {
  try {
    let query = supabase
      .from('advertisements')
      .select('*')
      .eq('status', 'active')
      .gte('end_date', new Date().toISOString());

    if (type) {
      query = query.eq('type', type);
    }

    if (businessId) {
      query = query.eq('business_id', businessId);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ads:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchActiveAds:', error);
    return [];
  }
}

/**
 * Increment the view count for an advertisement
 * @param adId Advertisement ID
 */
export async function incrementAdView(adId: string) {
  try {
    // Using the RPC function to increment ad views
    const { error } = await supabase.rpc('increment_ad_views', { ad_id: adId });
    
    if (error) {
      console.error('Error incrementing ad view:', error);
    }
  } catch (error) {
    console.error('Error in incrementAdView:', error);
  }
}

/**
 * Increment the click count for an advertisement
 * @param adId Advertisement ID
 */
export async function incrementAdClick(adId: string) {
  try {
    // Using the RPC function to increment ad clicks
    const { error } = await supabase.rpc('increment_ad_clicks', { ad_id: adId });
    
    if (error) {
      console.error('Error incrementing ad click:', error);
    }
  } catch (error) {
    console.error('Error in incrementAdClick:', error);
  }
}
