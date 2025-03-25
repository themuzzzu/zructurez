
import { supabase } from "@/integrations/supabase/client";
import { SearchResult, SearchSuggestion, SearchFilters } from "@/types/search";

// Get search suggestions based on user input
export const getSearchSuggestions = async (term: string): Promise<SearchSuggestion[]> => {
  try {
    // Get matching suggestions from the database
    const { data: databaseSuggestions, error } = await supabase
      .from('search_suggestions')
      .select('*')
      .ilike('term', `%${term}%`)
      .order('frequency', { ascending: false })
      .limit(5);
      
    if (error) throw error;
    
    // Get sponsored suggestions that match the term
    const { data: sponsoredSuggestions, error: sponsoredError } = await supabase
      .from('sponsored_search_terms')
      .select('id, term')
      .ilike('term', `%${term}%`)
      .eq('status', 'active')
      .order('bid_amount', { ascending: false })
      .limit(2);
      
    if (sponsoredError) throw sponsoredError;
    
    // Combine regular and sponsored suggestions
    const suggestions: SearchSuggestion[] = [
      ...(databaseSuggestions || []).map(suggestion => ({
        id: suggestion.id,
        term: suggestion.term,
        frequency: suggestion.frequency,
        category: suggestion.category,
        isSponsored: false
      })),
      ...(sponsoredSuggestions || []).map(sponsored => ({
        id: sponsored.id,
        term: sponsored.term,
        frequency: 1000, // Higher frequency to prioritize
        isSponsored: true
      }))
    ];
    
    // Sort by frequency and limit to 5 suggestions
    return suggestions
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return [];
  }
};

// Perform search with filters
export const performSearch = async (
  query: string, 
  filters: SearchFilters = { includeSponsored: true }
): Promise<{ results: SearchResult[], correctedQuery?: string }> => {
  try {
    // Check if we need to correct the query
    let correctedQuery: string | undefined = undefined;
    
    // Apply search filters
    let dbQuery = supabase
      .from('products')
      .select('*');
    
    // Basic search - in a real app this would use FTS or vector search
    dbQuery = dbQuery.ilike('title', `%${query}%`);
    
    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      dbQuery = dbQuery.in('category', filters.categories);
    }
    
    // Apply price filters
    if (filters.priceMin !== undefined) {
      dbQuery = dbQuery.gte('price', filters.priceMin);
    }
    
    if (filters.priceMax !== undefined) {
      dbQuery = dbQuery.lte('price', filters.priceMax);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          dbQuery = dbQuery.order('price', { ascending: true });
          break;
        case 'price-desc':
          dbQuery = dbQuery.order('price', { ascending: false });
          break;
        case 'newest':
          dbQuery = dbQuery.order('created_at', { ascending: false });
          break;
        default: // 'relevance' - in a real app this would use ranking
          dbQuery = dbQuery.order('views', { ascending: false });
      }
    } else {
      // Default sort by relevance (views in this demo)
      dbQuery = dbQuery.order('views', { ascending: false });
    }
    
    // Execute query
    const { data: products, error } = await dbQuery.limit(20);
    
    if (error) throw error;
    
    // Get sponsored results if enabled
    let sponsoredResults: any[] = [];
    if (filters.includeSponsored) {
      const { data: sponsored, error: sponsoredError } = await supabase
        .from('products')
        .select('*')
        .eq('is_branded', true)  // Using branded as proxy for sponsored
        .ilike('title', `%${query}%`)
        .limit(3);
        
      if (!sponsoredError && sponsored) {
        sponsoredResults = sponsored.map(item => ({
          ...item,
          isSponsored: true,
          relevanceScore: 100  // Higher score to prioritize
        }));
      }
    }
    
    // Map results to SearchResult type
    const regularResults: SearchResult[] = (products || []).map(product => ({
      id: product.id,
      title: product.title,
      description: product.description || '',
      imageUrl: product.image_url,
      category: product.category,
      price: product.price,
      type: 'product',
      url: `/product/${product.id}`,
      relevanceScore: product.views || 0
    }));
    
    // Map sponsored results
    const mappedSponsoredResults: SearchResult[] = sponsoredResults.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description || '',
      imageUrl: product.image_url,
      category: product.category,
      price: product.price,
      type: 'product',
      url: `/product/${product.id}`,
      isSponsored: true,
      relevanceScore: product.relevanceScore || 0
    }));
    
    // Combine and sort results
    // In a real app, this would use a sophisticated ranking algorithm
    // For now, we'll put a sponsored result at positions 1, 3, and 6
    let combinedResults: SearchResult[] = [...regularResults];
    
    if (mappedSponsoredResults.length > 0) {
      // Insert sponsored results at strategic positions
      mappedSponsoredResults.forEach((sponsored, index) => {
        const position = [0, 2, 5][index]; // Positions 1, 3, 6
        if (position !== undefined && position <= combinedResults.length) {
          combinedResults.splice(position, 0, sponsored);
        } else {
          combinedResults.push(sponsored);
        }
      });
    }
    
    // Save search query to database for analytics
    const { data: user } = await supabase.auth.getUser();
    if (user?.user) {
      await supabase.from('search_queries').insert({
        user_id: user.user.id,
        query,
        corrected_query: correctedQuery,
        model_used: 'keyword', // In a real app, this would be the AI model used
        results_count: combinedResults.length
      });
    }
    
    // Also increment search suggestion frequency or create new suggestion
    try {
      const { data: existingSuggestion } = await supabase
        .from('search_suggestions')
        .select('id, frequency')
        .eq('term', query)
        .maybeSingle();
        
      if (existingSuggestion) {
        // Increment frequency
        await supabase
          .from('search_suggestions')
          .update({ 
            frequency: existingSuggestion.frequency + 1,
            last_used: new Date().toISOString()
          })
          .eq('id', existingSuggestion.id);
      } else if (combinedResults.length > 0) {
        // Only add suggestion if it returned results
        await supabase
          .from('search_suggestions')
          .insert({
            term: query,
            frequency: 1,
            category: combinedResults[0].category
          });
      }
    } catch (suggestionError) {
      console.error('Error updating search suggestions:', suggestionError);
    }
    
    return {
      results: combinedResults,
      correctedQuery
    };
  } catch (error) {
    console.error('Error performing search:', error);
    return { results: [] };
  }
};

// Record when a user clicks on a search result
export const recordSearchResultClick = async (
  resultId: string,
  isSponsored: boolean,
  query: string
): Promise<void> => {
  try {
    // Log the click for analytics
    const { data: user } = await supabase.auth.getUser();
    
    // Increment product views
    await supabase.rpc('increment_product_views', { product_id_param: resultId });
    
    // If it's a sponsored result, record the click for billing
    if (isSponsored) {
      // In a real app, this would update ad metrics and billing
      console.log('Recording sponsored click for', resultId);
    }
    
    // Record user interaction if logged in
    if (user?.user) {
      // Update the search query with the clicked result
      const { data: searchQueries } = await supabase
        .from('search_queries')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('query', query)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (searchQueries && searchQueries.length > 0) {
        await supabase
          .from('search_queries')
          .update({
            clicked_results: supabase.sql`clicked_results || ${JSON.stringify([{
              result_id: resultId,
              is_sponsored: isSponsored,
              clicked_at: new Date().toISOString()
            }])}`
          })
          .eq('id', searchQueries[0].id);
      }
    }
  } catch (error) {
    console.error('Error recording search result click:', error);
  }
};
