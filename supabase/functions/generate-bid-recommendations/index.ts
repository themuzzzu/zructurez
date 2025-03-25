
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
    const { category } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    // Get category information
    let categoryQuery = supabaseClient.from('ad_categories');
    
    if (category && category !== 'all') {
      categoryQuery = categoryQuery.eq('name', category);
    }
    
    const { data: categories, error: categoryError } = await categoryQuery.select('*');
    
    if (categoryError) throw categoryError;
    
    // Generate recommendations for each category
    const recommendations = [];
    
    for (const cat of categories) {
      // In a real implementation, you would use ML to predict optimal bids
      // For now, we'll simulate with a basic algorithm
      
      // Get current bid stats
      const { data: auctionData, error: auctionError } = await supabaseClient
        .from('ad_auctions')
        .select('current_bid')
        .eq('category', cat.name)
        .order('current_bid', { ascending: false });
        
      if (auctionError) throw auctionError;
      
      // Calculate recommendation
      const avgBid = auctionData.length > 0
        ? auctionData.reduce((sum, auction) => sum + auction.current_bid, 0) / auctionData.length
        : cat.min_bid;
        
      const maxBid = auctionData.length > 0
        ? Math.max(...auctionData.map(auction => auction.current_bid))
        : cat.min_bid;
        
      // Generate recommendation based on current market
      const competitionFactor = auctionData.length > 5 ? 1.2 : 1.05;
      const recommendedMinBid = Math.max(cat.min_bid, avgBid * 0.8);
      const recommendedOptimalBid = Math.max(cat.min_bid, avgBid * competitionFactor);
      const recommendedMaxBid = Math.max(cat.min_bid, maxBid * 1.1);
      
      // Update category with new min_bid if needed
      if (recommendedMinBid > cat.min_bid) {
        await supabaseClient
          .from('ad_categories')
          .update({ min_bid: recommendedMinBid })
          .eq('id', cat.id);
      }
      
      recommendations.push({
        category: cat.name,
        min_bid: recommendedMinBid,
        optimal_bid: recommendedOptimalBid,
        max_bid: recommendedMaxBid,
        competition_level: auctionData.length > 10 
          ? 'High' 
          : auctionData.length > 5 
          ? 'Medium' 
          : 'Low'
      });
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        recommendations,
        timestamp: new Date().toISOString()
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
