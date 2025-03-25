
import { supabase } from "@/integrations/supabase/client";

// Get personalized recommendations based on user browsing history
export const getPersonalizedRecommendations = async (userId?: string, limit: number = 8) => {
  try {
    if (!userId) {
      // Return popular products if user is not logged in
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('views', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data || [];
    }
    
    // Get user's purchase history
    const { data: purchaseHistory } = await supabase
      .from('product_purchases')
      .select('product_id')
      .eq('user_id', userId);
      
    if (purchaseHistory && purchaseHistory.length > 0) {
      // Get categories from purchased products
      const purchasedIds = purchaseHistory.map(item => item.product_id);
      
      const { data: purchasedProducts } = await supabase
        .from('products')
        .select('category')
        .in('id', purchasedIds);
        
      if (purchasedProducts && purchasedProducts.length > 0) {
        // Extract unique categories
        const userCategories = [...new Set(purchasedProducts.map(p => p.category))];
        
        if (userCategories.length > 0) {
          // Get products in the same categories, but not already purchased
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .in('category', userCategories)
            .not('id', 'in', purchasedIds)
            .order('views', { ascending: false })
            .limit(limit);
            
          if (error) throw error;
          return data || [];
        }
      }
    }
    
    // Fallback to popular products
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('views', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    throw error;
  }
};

// Get trending products near a location
export const getTrendingProductsByLocation = async (location?: string, limit: number = 8) => {
  try {
    let query = supabase
      .from('products')
      .select('*');
      
    // In a real app, this would filter by location data
    // For demo purposes, just return trending products
    
    const { data, error } = await query
      .order('views', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting trending products by location:', error);
    throw error;
  }
};

// Get products frequently bought together
export const getPeopleBoughtTogether = async (productId: string, limit: number = 4) => {
  try {
    // In a real app, this would use a sophisticated recommendation algorithm
    // For demo purposes, just return products in the same category
    
    const { data: product } = await supabase
      .from('products')
      .select('category')
      .eq('id', productId)
      .single();
      
    if (!product) return [];
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', product.category)
      .neq('id', productId)
      .order('views', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting people also bought products:', error);
    throw error;
  }
};

// Get sponsored product recommendations
export const getSponsoredRecommendations = async (category?: string, limit: number = 4) => {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_branded', true);  // Using branded as a proxy for sponsored in this demo
      
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting sponsored recommendations:', error);
    throw error;
  }
};

// Record product view for recommendation improvement
export const recordProductView = async (productId: string, userId?: string) => {
  try {
    // Increment product view count
    await supabase.rpc('increment_product_views', { product_id_param: productId });
    
    // If logged in, record the view for the user (for personalization)
    if (userId) {
      await supabase.from('performance_metrics').insert({
        user_id: userId,
        endpoint: 'product_view',
        success: true,
        response_time: 0,
        metadata: { product_id: productId, path: `/product/${productId}` }
      });
    }
  } catch (error) {
    console.error('Error recording product view:', error);
  }
};
