
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
// In a production app, you should use environment variables
const supabaseUrl = 'https://kjmlxafygdzkrlopyyvk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbWx4YWZ5Z2R6a3Jsb3B5eXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0OTM1OTcsImV4cCI6MjA0OTA2OTU5N30.YSE8moLsMnhZIMnCdVfL7b2Xj2SDF9pHkLTKVTPLUkM';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

// Helper function to create mock results when Supabase is not properly configured
export const getMockSearchResults = (searchQuery: string) => {
  console.log("Generating mock search results for:", searchQuery);
  
  const categories = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books'];
  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Amazon', 'IKEA'];
  
  // Generate 10-15 products based on search query
  return Array(8 + Math.floor(Math.random() * 7))
    .fill(null)
    .map((_, index) => {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const isSponsored = index === 0 || Math.random() > 0.9;
      const isDiscounted = Math.random() > 0.7;
      const price = Math.floor(Math.random() * 9000) + 999;
      const discountPercentage = Math.floor(Math.random() * 30) + 10;
      const originalPrice = Math.floor(price / (1 - discountPercentage / 100));
      
      return {
        id: `mock-${Date.now()}-${index}`,
        title: `${brand} ${searchQuery} ${index + 1}`,
        description: `This is a mock product result for "${searchQuery}" in the ${category} category by ${brand}.`,
        imageUrl: `https://picsum.photos/seed/${brand.toLowerCase()}-${index}/300/300`,
        category,
        price,
        type: "product",
        url: `/product/mock-${Date.now()}-${index}`,
        isSponsored,
        relevanceScore: 100 - index * 5,
        highlight_tags: ["New", "Popular", "Trending"].slice(0, Math.floor(Math.random() * 3)),
        isDiscounted,
        discount_percentage: isDiscounted ? discountPercentage : 0,
        original_price: isDiscounted ? originalPrice : price,
        brand,
        rating: Math.floor(Math.random() * 30 + 20) / 10, // 2.0 to 5.0
        rating_count: Math.floor(Math.random() * 500) + 10,
        provider: "MockStore",
        tags: [category, brand, searchQuery]
      };
    });
};
