
import { globalCache } from "@/utils/cacheUtils";
import { preloadImages } from "@/utils/apiPerformance";
import { supabase } from "@/integrations/supabase/client";

/**
 * Stores navigation patterns to predict future paths
 */
interface NavigationPattern {
  from: string;
  to: string;
  count: number;
  timestamp: number;
}

// In-memory storage for user navigation patterns
const navigationPatterns: NavigationPattern[] = [];
const MAX_PATTERNS = 1000;

/**
 * Tracks user navigation patterns for prefetching predictions
 * @param from The path navigated from
 * @param to The path navigated to
 */
export const trackNavigation = (from: string, to: string): void => {
  // Don't track identical paths
  if (from === to) return;
  
  // Find existing pattern or create new one
  const existingPattern = navigationPatterns.find(
    pattern => pattern.from === from && pattern.to === to
  );
  
  if (existingPattern) {
    existingPattern.count += 1;
    existingPattern.timestamp = Date.now();
  } else {
    // Add new pattern, removing oldest if at capacity
    if (navigationPatterns.length >= MAX_PATTERNS) {
      // Find and remove oldest pattern by timestamp
      const oldestIndex = navigationPatterns.reduce(
        (oldest, current, index, array) => 
          current.timestamp < array[oldest].timestamp ? index : oldest, 
        0
      );
      navigationPatterns.splice(oldestIndex, 1);
    }
    
    // Add new pattern
    navigationPatterns.push({
      from,
      to,
      count: 1,
      timestamp: Date.now()
    });
  }
  
  // Could be extended to periodically persist patterns to database
  console.debug(`Tracked navigation from ${from} to ${to}`);
};

/**
 * Predicts likely next paths based on current path
 * @param currentPath Current user path
 * @returns Array of likely next paths
 */
export const predictNextPaths = (currentPath: string): string[] => {
  // Filter patterns from current path and sort by count
  const predictions = navigationPatterns
    .filter(pattern => pattern.from === currentPath)
    .sort((a, b) => b.count - a.count)
    .map(pattern => pattern.to)
    .slice(0, 3); // Get top 3 predictions
  
  return predictions;
};

/**
 * Prefetches likely product data based on viewing patterns
 * @param productId Current product being viewed
 */
export const prefetchRelatedProducts = async (productId: string): Promise<void> => {
  try {
    // Instead of product_views, fetch products from the same category
    const { data: currentProduct } = await supabase
      .from('products')
      .select('category')
      .eq('id', productId)
      .single();
    
    if (!currentProduct?.category) return;
    
    // Find other products in the same category
    setTimeout(async () => {
      try {
        const { data: relatedProducts } = await supabase
          .from('products')
          .select('*')
          .eq('category', currentProduct.category)
          .neq('id', productId) // Exclude current product
          .order('views', { ascending: false })
          .limit(5);
        
        if (relatedProducts?.length) {
          // Cache the products
          relatedProducts.forEach(product => {
            const cacheKey = `product:${product.id}`;
            globalCache.set(cacheKey, product, 5 * 60 * 1000); // Cache for 5 minutes
          });
          
          // Preload images
          const imageUrls = relatedProducts
            .filter(product => product.image_url)
            .map(product => product.image_url);
          
          preloadImages(imageUrls);
          console.debug(`Prefetched ${relatedProducts.length} related products for ${productId}`);
        }
      } catch (error) {
        console.error('Error prefetching related products:', error);
      }
    }, 500); // Delay to not compete with critical resources
  } catch (error) {
    console.error('Error finding related products:', error);
  }
};

/**
 * Prefetches category products when user views a category
 * @param category The category to prefetch
 */
export const prefetchCategoryProducts = async (category: string): Promise<void> => {
  const cacheKey = `category-products:${category}`;
  
  // Skip if already in cache
  if (globalCache.has(cacheKey)) return;
  
  // Use low priority fetch
  setTimeout(async () => {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('views', { ascending: false })
        .limit(20);
      
      if (products?.length) {
        // Cache the products
        globalCache.set(cacheKey, products, 3 * 60 * 1000); // Cache for 3 minutes
        
        // Preload images (only first 8 to avoid too many requests)
        const imageUrls = products
          .slice(0, 8)
          .filter(product => product.image_url)
          .map(product => product.image_url);
        
        preloadImages(imageUrls);
        console.debug(`Prefetched ${products.length} products for category ${category}`);
      }
    } catch (error) {
      console.error(`Error prefetching category products for ${category}:`, error);
    }
  }, 800); // Longer delay for category prefetching
};
