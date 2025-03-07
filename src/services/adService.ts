
import { supabase } from "@/integrations/supabase/client";

export type AdType = "business" | "service" | "product";

export const fetchActiveAds = async (type?: AdType, limit: number = 5) => {
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
  } catch (error) {
    console.error('Error incrementing ad view:', error);
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
