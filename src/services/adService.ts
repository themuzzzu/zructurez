
import { supabase } from '@/integrations/supabase/client';

interface Ad {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  url?: string;
  company?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  views?: number;
  clicks?: number;
}

// Fetch active ads based on category or location
export const fetchActiveAds = async (
  category?: string, 
  location?: string,
  limit: number = 5
): Promise<Ad[]> => {
  try {
    const today = new Date().toISOString();
    
    let query = supabase
      .from('advertisements')
      .select('*')
      .eq('status', 'active')
      .lte('start_date', today)
      .gte('end_date', today)
      .limit(limit);
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (location) {
      query = query.eq('location', location);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching ads:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching ads:', error);
    return [];
  }
};

// Record ad view
export const incrementAdView = async (adId: string): Promise<void> => {
  try {
    // First get the current views count
    const { data, error: fetchError } = await supabase
      .from('advertisements')
      .select('views')
      .eq('id', adId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching ad view count:', fetchError);
      return;
    }
    
    const currentViews = data?.views || 0;
    
    // Then update the views count
    const { error: updateError } = await supabase
      .from('advertisements')
      .update({ views: currentViews + 1 })
      .eq('id', adId);
    
    if (updateError) {
      console.error('Error incrementing ad view count:', updateError);
    }
  } catch (error) {
    console.error('Unexpected error incrementing ad view count:', error);
  }
};

// Record ad click
export const incrementAdClick = async (adId: string): Promise<void> => {
  try {
    // First get the current clicks count
    const { data, error: fetchError } = await supabase
      .from('advertisements')
      .select('clicks')
      .eq('id', adId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching ad click count:', fetchError);
      return;
    }
    
    const currentClicks = data?.clicks || 0;
    
    // Then update the clicks count
    const { error: updateError } = await supabase
      .from('advertisements')
      .update({ clicks: currentClicks + 1 })
      .eq('id', adId);
    
    if (updateError) {
      console.error('Error incrementing ad click count:', updateError);
    }
  } catch (error) {
    console.error('Unexpected error incrementing ad click count:', error);
  }
};
