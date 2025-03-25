
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adId, statType } = await req.json();
    
    if (!adId || !statType) {
      throw new Error('Missing required parameters: adId, statType');
    }
    
    if (!['impressions', 'clicks', 'conversions'].includes(statType)) {
      throw new Error('Invalid statType. Must be one of: impressions, clicks, conversions');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    // Check if ad_analytics record exists for this ad
    const { data: existingRecord, error: fetchError } = await supabaseClient
      .from('ad_analytics')
      .select('*')
      .eq('ad_id', adId)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') {
      // Error other than "no rows returned"
      throw fetchError;
    }
    
    let result;
    
    if (!existingRecord) {
      // Create new record
      const newRecord = {
        ad_id: adId,
        [statType]: 1,
        impressions: statType === 'impressions' ? 1 : 0,
        clicks: statType === 'clicks' ? 1 : 0,
        conversions: statType === 'conversions' ? 1 : 0
      };
      
      const { data, error } = await supabaseClient
        .from('ad_analytics')
        .insert(newRecord)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    } else {
      // Update existing record
      const updates = {
        [statType]: (existingRecord[statType] || 0) + 1,
        last_updated: new Date().toISOString()
      };
      
      const { data, error } = await supabaseClient
        .from('ad_analytics')
        .update(updates)
        .eq('id', existingRecord.id)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    }
    
    // For clicks, also update the ad's 'reach' field (re-using for clicks in this context)
    if (statType === 'clicks') {
      const { error } = await supabaseClient
        .from('advertisements')
        .update({ clicks: (existingRecord?.clicks || 0) + 1 })
        .eq('id', adId);
        
      if (error) throw error;
    }
    
    // For impressions, update the ad's 'reach' field
    if (statType === 'impressions') {
      const { error } = await supabaseClient
        .from('advertisements')
        .update({ reach: (existingRecord?.impressions || 0) + 1 })
        .eq('id', adId);
        
      if (error) throw error;
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Ad ${statType} incremented successfully`,
        data: result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
