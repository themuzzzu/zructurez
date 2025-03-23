
import { supabase } from "@/integrations/supabase/client";

export type AdType = "business" | "service" | "product";
export type AdFormat = "standard" | "banner" | "carousel" | "video" | "boosted_post";
export type TargetingOptions = {
  location?: string;
  interests?: string[];
  ageRange?: [number, number];
  gender?: string;
};

export interface AdAnalytics {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
}

export const fetchActiveAds = async (
  type?: AdType, 
  format?: AdFormat,
  limit: number = 5,
  targeting?: TargetingOptions
) => {
  try {
    let query = supabase
      .from('advertisements')
      .select('*')
      .eq('status', 'active')
      .lte('start_date', new Date().toISOString())
      .gte('end_date', new Date().toISOString())
      .order('budget', { ascending: false });
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (format) {
      query = query.eq('format', format);
    }
    
    // Apply targeting filters if provided
    if (targeting) {
      if (targeting.location) {
        query = query.ilike('targeting_locations', `%${targeting.location}%`);
      }
      
      if (targeting.interests && targeting.interests.length > 0) {
        // This assumes the interests are stored as a JSON array or string that can be searched
        targeting.interests.forEach(interest => {
          query = query.ilike('targeting_interests', `%${interest}%`);
        });
      }
      
      // More targeting options can be added here
    }
    
    const { data, error } = await query.limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
};

export const fetchUserAds = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user ads:', error);
    return [];
  }
};

export const incrementAdView = async (adId: string) => {
  try {
    const { error } = await supabase.rpc('increment_ad_views', { ad_id: adId });
    if (error) throw error;
    
    // Additionally, record impression with more details
    await recordAdImpression(adId);
  } catch (error) {
    console.error('Error incrementing ad view:', error);
  }
};

export const incrementAdClick = async (adId: string) => {
  try {
    const { error } = await supabase.rpc('increment_ad_clicks', { ad_id: adId });
    if (error) throw error;
  } catch (error) {
    console.error('Error incrementing ad click:', error);
  }
};

export const recordAdImpression = async (adId: string, location?: string) => {
  try {
    // Get user location from browser if not provided
    if (!location) {
      try {
        // This is a simplified approach - in a real app, you might use a geolocation service
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        location = data.city || data.region || data.country_name;
      } catch (locError) {
        console.error('Error getting location:', locError);
      }
    }
    
    const { error } = await supabase.rpc('record_ad_impression', { 
      ad_id: adId,
      location: location
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error recording ad impression:', error);
  }
};

export const recordAdConversion = async (adId: string, conversionType: string) => {
  try {
    const { error } = await supabase.rpc('record_ad_conversion', {
      ad_id: adId,
      conversion_type: conversionType
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error recording ad conversion:', error);
  }
};

export const fetchAdAnalytics = async (adId: string): Promise<AdAnalytics> => {
  try {
    const { data, error } = await supabase
      .from('ad_analytics')
      .select('impressions, clicks, conversions')
      .eq('ad_id', adId)
      .single();
    
    if (error) throw error;
    
    const impressions = data?.impressions || 0;
    const clicks = data?.clicks || 0;
    const conversions = data?.conversions || 0;
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    
    return {
      impressions,
      clicks,
      conversions,
      ctr
    };
  } catch (error) {
    console.error('Error fetching ad analytics:', error);
    return {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0
    };
  }
};

export const boostPost = async (postId: string, budget: number, duration: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // First, get the post details
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();
    
    if (postError) throw postError;
    
    // Create an ad based on the post
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration); // Duration in days
    
    const { data, error } = await supabase
      .from('advertisements')
      .insert({
        user_id: user.id,
        title: `Boosted Post: ${post.content.substring(0, 30)}...`,
        description: post.content,
        type: 'business', // Default type
        reference_id: postId,
        format: 'boosted_post',
        budget,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        image_url: post.image_url,
        status: 'active',
        location: post.location || '',
      });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error boosting post:', error);
    throw error;
  }
};

export const fetchProductDetailsForAd = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('price, is_discounted, discount_percentage, original_price')
      .eq('id', productId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
};
