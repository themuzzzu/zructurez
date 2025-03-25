
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

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
    const { businessId, analysisType } = await req.json();
    
    if (!businessId) {
      throw new Error('Missing required parameter: businessId');
    }
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get business data
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();
      
    if (businessError) {
      throw new Error(`Error fetching business: ${businessError.message}`);
    }
    
    // Get products for the business's user
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', business.user_id);
      
    if (productsError) {
      throw new Error(`Error fetching products: ${productsError.message}`);
    }
    
    // Get orders for this business
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('business_id', businessId);
      
    if (ordersError) {
      throw new Error(`Error fetching orders: ${ordersError.message}`);
    }
    
    // Get ads for this business
    const { data: ads, error: adsError } = await supabase
      .from('advertisements')
      .select('*')
      .eq('business_id', businessId);
      
    if (adsError) {
      throw new Error(`Error fetching ads: ${adsError.message}`);
    }
    
    let result;
    
    // Generate different insights based on the analysis type
    switch (analysisType) {
      case 'pricing':
        result = generatePricingInsights(products, orders);
        break;
        
      case 'inventory':
        result = generateInventoryInsights(products, orders);
        break;
        
      case 'ads':
        result = generateAdInsights(ads, orders);
        break;
        
      case 'summary':
      default:
        result = generateBusinessSummary(business, products, orders, ads);
        break;
    }
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error generating business insights:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Generate pricing insights and recommendations
function generatePricingInsights(products, orders) {
  const pricingInsights = products.map(product => {
    // Calculate product metrics
    const productOrders = orders.filter(order => order.product_id === product.id);
    const totalSold = productOrders.reduce((sum, order) => sum + order.quantity, 0);
    const totalRevenue = productOrders.reduce((sum, order) => sum + order.total_price, 0);
    
    // Current stock and views
    const stockLevel = product.stock;
    const views = product.views || 0;
    
    // Calculate conversion rate (views to purchases)
    const conversionRate = views > 0 ? (totalSold / views) * 100 : 0;
    
    // Generate price recommendation based on stock, views, and sales
    let recommendedPrice = product.price;
    let priceChangeReason = '';
    
    if (stockLevel < 5 && conversionRate > 2) {
      // Low stock and good conversion - can increase price
      recommendedPrice = product.price * 1.1;
      priceChangeReason = 'Low stock with strong demand';
    } else if (stockLevel > 20 && conversionRate < 1) {
      // High stock and poor conversion - reduce price
      recommendedPrice = product.price * 0.9;
      priceChangeReason = 'High stock with weak demand';
    } else if (views > 100 && totalSold < 10) {
      // Many views but few sales - price may be too high
      recommendedPrice = product.price * 0.95;
      priceChangeReason = 'High interest but low conversion';
    } else if (totalSold > 20 && stockLevel < 10) {
      // Popular item with limited stock - increase price
      recommendedPrice = product.price * 1.05;
      priceChangeReason = 'Popular product with limited supply';
    }
    
    // Round to nearest whole number
    recommendedPrice = Math.round(recommendedPrice);
    
    return {
      id: product.id,
      title: product.title,
      currentPrice: product.price,
      recommendedPrice,
      priceChangePercent: ((recommendedPrice - product.price) / product.price) * 100,
      priceChangeReason,
      metrics: {
        views,
        conversionRate: conversionRate.toFixed(2),
        stockLevel,
        totalSold,
        totalRevenue,
      }
    };
  });
  
  return {
    pricingInsights,
    summary: {
      itemsAnalyzed: pricingInsights.length,
      itemsWithPriceChange: pricingInsights.filter(p => p.currentPrice !== p.recommendedPrice).length,
      averagePriceChangePercent: pricingInsights.reduce((sum, p) => sum + p.priceChangePercent, 0) / pricingInsights.length,
    }
  };
}

// Generate inventory insights and stock forecasting
function generateInventoryInsights(products, orders) {
  const today = new Date();
  
  const inventoryInsights = products.map(product => {
    // Calculate sales velocity (units sold per day)
    const productOrders = orders.filter(order => order.product_id === product.id);
    
    // Group orders by day
    const ordersByDay = productOrders.reduce((acc, order) => {
      const orderDate = new Date(order.created_at).toDateString();
      if (!acc[orderDate]) {
        acc[orderDate] = 0;
      }
      acc[orderDate] += order.quantity;
      return acc;
    }, {});
    
    // Calculate average daily sales
    const uniqueDays = Object.keys(ordersByDay).length;
    const totalSold = productOrders.reduce((sum, order) => sum + order.quantity, 0);
    const avgDailySales = uniqueDays > 0 ? totalSold / uniqueDays : 0;
    
    // Predict stockout date
    const currentStock = product.stock;
    const daysUntilStockout = avgDailySales > 0 ? Math.floor(currentStock / avgDailySales) : 999;
    
    let stockoutDate = null;
    let restockUrgency = 'low';
    
    if (daysUntilStockout < Infinity) {
      stockoutDate = new Date(today);
      stockoutDate.setDate(today.getDate() + daysUntilStockout);
      
      if (daysUntilStockout <= 7) {
        restockUrgency = 'high';
      } else if (daysUntilStockout <= 30) {
        restockUrgency = 'medium';
      }
    }
    
    // Recommended restock amount
    const restockAmount = Math.ceil(avgDailySales * 30); // 30 days supply
    
    return {
      id: product.id,
      title: product.title,
      currentStock,
      avgDailySales: avgDailySales.toFixed(2),
      daysUntilStockout,
      stockoutDate: stockoutDate ? stockoutDate.toISOString() : null,
      restockUrgency,
      restockAmount,
      salesVelocity: avgDailySales > 2 ? 'high' : avgDailySales > 0.5 ? 'medium' : 'low',
    };
  });
  
  return {
    inventoryInsights,
    summary: {
      itemsAnalyzed: inventoryInsights.length,
      itemsNeedingRestock: inventoryInsights.filter(p => p.restockUrgency !== 'low').length,
      avgDaysUntilStockout: inventoryInsights.reduce((sum, p) => sum + p.daysUntilStockout, 0) / inventoryInsights.length,
    }
  };
}

// Generate ad performance insights
function generateAdInsights(ads, orders) {
  const adInsights = ads.map(ad => {
    const impressions = ad.reach || 0;
    const clicks = ad.clicks || 0;
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    
    // Calculate days the ad has been running
    const startDate = new Date(ad.start_date);
    const today = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysRunning = Math.round((today.getTime() - startDate.getTime()) / msPerDay);
    
    // Calculate daily metrics
    const dailyBudget = ad.budget / Math.max(daysRunning, 1);
    const dailyImpressions = impressions / Math.max(daysRunning, 1);
    const dailyClicks = clicks / Math.max(daysRunning, 1);
    
    // Calculate cost metrics
    const cpm = impressions > 0 ? (dailyBudget / impressions) * 1000 : 0;
    const cpc = clicks > 0 ? dailyBudget / clicks : 0;
    
    // Estimate conversion and revenue (simulated)
    const avgConversionRate = 0.03; // 3% of clicks convert
    const avgOrderValue = 500; // ₹500 average order value
    const estimatedConversions = clicks * avgConversionRate;
    const estimatedRevenue = estimatedConversions * avgOrderValue;
    const roas = dailyBudget > 0 ? estimatedRevenue / dailyBudget : 0;
    
    // Best time recommendation (simulated)
    const hours = [
      { hour: '9-11 AM', score: Math.random() * 10 },
      { hour: '12-2 PM', score: Math.random() * 10 },
      { hour: '3-5 PM', score: Math.random() * 10 },
      { hour: '6-8 PM', score: Math.random() * 10 },
      { hour: '9-11 PM', score: Math.random() * 10 }
    ];
    
    const bestTimeToAdvertise = hours.sort((a, b) => b.score - a.score)[0].hour;
    
    // Performance assessment
    let performanceRating;
    let optimizationTip;
    
    if (ctr < 0.5) {
      performanceRating = 'poor';
      optimizationTip = 'Revise ad creative and targeting to improve CTR';
    } else if (ctr < 1) {
      performanceRating = 'below average';
      optimizationTip = 'Consider refining your audience targeting';
    } else if (ctr < 2) {
      performanceRating = 'average';
      optimizationTip = 'Test different ad formats to improve engagement';
    } else if (ctr < 3) {
      performanceRating = 'good';
      optimizationTip = 'Increase budget to reach more potential customers';
    } else {
      performanceRating = 'excellent';
      optimizationTip = 'Expand this campaign to similar audiences';
    }
    
    return {
      id: ad.id,
      title: ad.title,
      impressions,
      clicks,
      ctr: ctr.toFixed(2),
      daysRunning,
      dailyBudget: dailyBudget.toFixed(2),
      cpm: cpm.toFixed(2),
      cpc: cpc.toFixed(2),
      estimatedConversions: estimatedConversions.toFixed(2),
      estimatedRevenue: estimatedRevenue.toFixed(2),
      roas: roas.toFixed(2),
      performanceRating,
      optimizationTip,
      bestTimeToAdvertise
    };
  });
  
  return {
    adInsights,
    summary: {
      adsAnalyzed: adInsights.length,
      averageCTR: adInsights.reduce((sum, ad) => sum + parseFloat(ad.ctr), 0) / Math.max(adInsights.length, 1),
      averageROAS: adInsights.reduce((sum, ad) => sum + parseFloat(ad.roas), 0) / Math.max(adInsights.length, 1),
      bestTimeToAdvertise: getBestOverallAdTime(adInsights),
    }
  };
}

// Helper function to determine best overall ad time
function getBestOverallAdTime(adInsights) {
  const timeCount = {};
  
  adInsights.forEach(ad => {
    if (!timeCount[ad.bestTimeToAdvertise]) {
      timeCount[ad.bestTimeToAdvertise] = 0;
    }
    timeCount[ad.bestTimeToAdvertise]++;
  });
  
  let bestTime = '6-8 PM';
  let maxCount = 0;
  
  for (const [time, count] of Object.entries(timeCount)) {
    if (count > maxCount) {
      maxCount = count;
      bestTime = time;
    }
  }
  
  return bestTime;
}

// Generate overall business summary
function generateBusinessSummary(business, products, orders, ads) {
  // Basic business metrics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
  const totalAds = ads.length;
  
  // Calculate total ad spend
  const totalAdSpend = ads.reduce((sum, ad) => sum + ad.budget, 0);
  
  // Calculate month-over-month growth
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  
  const thisMonthOrders = orders.filter(order => new Date(order.created_at) >= lastMonth);
  const lastMonthOrders = orders.filter(order => {
    const date = new Date(order.created_at);
    return date >= twoMonthsAgo && date < lastMonth;
  });
  
  const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + order.total_price, 0);
  const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.total_price, 0);
  
  const revenueGrowth = lastMonthRevenue > 0 
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0;
  
  // Top performing products
  const productPerformance = products.map(product => {
    const productOrders = orders.filter(order => order.product_id === product.id);
    const productRevenue = productOrders.reduce((sum, order) => sum + order.total_price, 0);
    const unitsSold = productOrders.reduce((sum, order) => sum + order.quantity, 0);
    
    return {
      id: product.id,
      title: product.title,
      revenue: productRevenue,
      unitsSold,
      conversionRate: product.views > 0 ? (unitsSold / product.views) * 100 : 0
    };
  }).sort((a, b) => b.revenue - a.revenue);
  
  const topProducts = productPerformance.slice(0, 3);
  
  // Business insights
  const insights = [];
  
  if (revenueGrowth > 15) {
    insights.push('Your business is growing rapidly. Consider expanding your product range.');
  } else if (revenueGrowth < 0) {
    insights.push('Revenue has declined. Review pricing and marketing strategies.');
  }
  
  if (totalAds > 0 && totalAdSpend > 0) {
    const totalAdImpressions = ads.reduce((sum, ad) => sum + (ad.reach || 0), 0);
    const totalAdClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
    
    if (totalAdClicks > 0) {
      const adROI = totalRevenue / totalAdSpend;
      
      if (adROI < 2) {
        insights.push('Your ad campaigns are not generating sufficient ROI. Consider optimizing targeting and messaging.');
      } else if (adROI > 5) {
        insights.push('Your ads are performing exceptionally well. Consider increasing ad budget to scale growth.');
      }
    }
  }
  
  // Low stock warning
  const lowStockItems = products.filter(p => p.stock < 5).length;
  if (lowStockItems > 0) {
    insights.push(`${lowStockItems} products are running low on stock. Consider restocking soon to avoid lost sales.`);
  }
  
  return {
    businessName: business.name,
    businessCategory: business.category,
    metrics: {
      totalProducts,
      totalOrders,
      totalRevenue,
      totalAds,
      totalAdSpend,
      revenueGrowth: revenueGrowth.toFixed(2),
      avgOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0,
      lowStockItems,
    },
    topProducts,
    insights
  };
}
