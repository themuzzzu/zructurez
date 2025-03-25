import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { category } = await req.json();

    // Get performance data
    const { data: performanceData, error: performanceError } = await supabaseClient
      .from('ad_analytics')
      .select(`
        ad_id,
        impressions,
        clicks,
        conversions,
        advertisements (
          id,
          type,
          category
        )
      `);

    if (performanceError) throw performanceError;

    // Get current auctions
    const { data: auctions, error: auctionsError } = await supabaseClient
      .from('ad_auctions')
      .select('*');

    if (auctionsError) throw auctionsError;

    // Generate recommendations based on performance data
    // In a real implementation, this would use ML algorithms to generate recommendations
    const recommendations = generateRecommendations(performanceData, auctions, category);

    // Update recommendations in the database
    for (const rec of recommendations) {
      const { error } = await supabaseClient
        .from('ad_auctions')
        .update({ 
          min_bid: rec.recommendedBid,
          ai_recommendation_reason: rec.reason 
        })
        .eq('id', rec.auctionId);

      if (error) throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Bid recommendations generated successfully",
        count: recommendations.length
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

// Function to generate recommendations based on performance data
function generateRecommendations(performanceData: any[], auctions: any[], category?: string) {
  // In a real implementation, this would use ML to analyze performance patterns
  const recommendations = [];

  for (const auction of auctions) {
    // Filter by category if provided
    if (category && category !== 'all' && auction.category !== category) {
      continue;
    }

    // Calculate metrics for this auction
    const relevantData = performanceData.filter(item => 
      item.advertisements?.category === auction.category
    );

    // Calculate average CTR for this category
    const totalImpressions = relevantData.reduce((sum, item) => sum + (item.impressions || 0), 0);
    const totalClicks = relevantData.reduce((sum, item) => sum + (item.clicks || 0), 0);
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    // Generate a recommendation
    const currentBid = auction.current_bid || auction.min_bid;
    let recommendedBid = currentBid;

    // Simple recommendation algorithm (this would be much more sophisticated in a real implementation)
    if (avgCTR > 4) {
      // High-performing category, increase bid
      recommendedBid = Math.round(currentBid * 1.15);
      reason = `High CTR (${avgCTR.toFixed(2)}%) indicates strong performance. Increasing bid to capture more traffic.`;
    } else if (avgCTR > 2) {
      // Medium performance, slight increase
      recommendedBid = Math.round(currentBid * 1.05);
      reason = `Moderate CTR (${avgCTR.toFixed(2)}%). Small bid increase recommended to maintain competitive position.`;
    } else {
      // Low performance, reduce bid or keep the same
      recommendedBid = Math.max(auction.min_bid, Math.round(currentBid * 0.95));
      reason = `Low CTR (${avgCTR.toFixed(2)}%). Adjusting bid to improve ROI while maintaining visibility.`;
    }

    // Add random variation (for demo purposes)
    const variation = Math.random() * 10 - 5; // -5 to +5
    recommendedBid = Math.max(auction.min_bid, Math.round(recommendedBid + variation));

    let reason = `AI analysis based on category performance metrics.`;

    recommendations.push({
      auctionId: auction.id,
      category: auction.category,
      keyword: auction.keyword,
      currentBid: currentBid,
      recommendedBid: recommendedBid,
      reason: reason
    });
  }

  return recommendations;
}
