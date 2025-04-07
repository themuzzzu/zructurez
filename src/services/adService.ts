
import { supabase } from "@/integrations/supabase/client";

// Ad Types
export type AdType = "business" | "service" | "product" | "sponsored";
export type AdFormat = "standard" | "banner" | "carousel" | "video" | "boosted_post" | "card" | "featured";
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
  updated_at?: string;
  impressions: number;
  clicks: number;
  ctr?: number;
  reach?: number;
  conversions?: number;
  targeting_locations?: string[];
  targeting_interests?: string[];
  targeting_age_min?: number;
  targeting_age_max?: number;
  targeting_gender?: string;
  business_id?: string; // Adding business_id field
}

export interface AdPlacement {
  id: string;
  name: string;
  description: string;
  type: string;
  location: string;
  size: string;
  cpc_rate: number;
  cpm_rate: number;
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

// Fetch active ads for display
export const fetchActiveAds = async (type?: AdType, format?: AdFormat, limit: number = 5) => {
  try {
    let query = supabase
      .from('advertisements')
      .select('*')
      .eq('status', 'active')
      .lt('end_date', new Date().toISOString())
      .gt('start_date', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (format) {
      query = query.eq('format', format);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as Advertisement[];
  } catch (error) {
    console.error('Error fetching active ads:', error);
    return [];
  }
};

// Generate mock ads when no real ads are available or for demo purposes
export const generateMockAds = (count: number = 3, type?: AdType, format?: AdFormat): Advertisement[] => {
  const types = ["business", "service", "product", "sponsored"];
  const formats = ["standard", "banner", "carousel", "featured"];
  
  return Array(count).fill(null).map((_, i) => {
    const mockType = type || types[Math.floor(Math.random() * types.length)] as AdType;
    const mockFormat = format || formats[Math.floor(Math.random() * formats.length)] as AdFormat;
    
    return {
      id: `mock-ad-${i}-${Date.now()}`,
      user_id: "system",
      title: `Featured ${mockType.charAt(0).toUpperCase() + mockType.slice(1)}`,
      description: `This is a mock ${mockType} advertisement for demonstration purposes.`,
      type: mockType,
      format: mockFormat,
      reference_id: `mock-ref-${i}`,
      location: "Local Area",
      budget: 1000,
      start_date: new Date(Date.now() - 86400000).toISOString(),
      end_date: new Date(Date.now() + 86400000).toISOString(),
      image_url: `https://images.unsplash.com/photo-${1580000000000 + i}?auto=format&fit=crop&w=300&q=80`,
      video_url: null,
      carousel_images: null,
      status: "active",
      created_at: new Date().toISOString(),
      impressions: Math.floor(Math.random() * 1000),
      clicks: Math.floor(Math.random() * 100),
      reach: Math.floor(Math.random() * 2000),
      conversions: Math.floor(Math.random() * 20),
    };
  });
};

// Track ad views for analytics - Handles non-UUID values gracefully
export const incrementAdView = async (adId: string) => {
  try {
    // Check if adId is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(adId)) {
      console.log(`Skipping increment for non-UUID ad id: ${adId}`);
      return false;
    }
    
    // Update the impressions count for the ad
    const { error: adError } = await supabase.rpc('increment_ad_views', {
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
    
    if (analyticsError) {
      // Just log analytics errors but don't fail the operation
      console.warn('Error recording ad analytics:', analyticsError);
    }
    
    return true;
  } catch (error) {
    console.error('Error incrementing ad view:', error);
    // Don't throw, just return false to prevent errors cascading
    return false;
  }
};

// Track ad clicks for analytics - Handles non-UUID values gracefully
export const incrementAdClick = async (adId: string) => {
  try {
    // Check if adId is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(adId)) {
      console.log(`Skipping increment for non-UUID ad id: ${adId}`);
      return false;
    }
    
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
    
    if (analyticsError) {
      // Just log analytics errors but don't fail the operation
      console.warn('Error recording ad click analytics:', analyticsError);
    }
    
    return true;
  } catch (error) {
    console.error('Error incrementing ad click:', error);
    // Don't throw, just return false to prevent errors cascading
    return false;
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
