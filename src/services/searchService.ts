
import { supabase } from "@/integrations/supabase/client";
import { SearchResult, SearchSuggestion, SearchFilters } from "@/types/search";

// Create an increment function to use instead of RPC
const incrementValue = (value: number = 1) => value + 1;

// Get search suggestions based on user input
export const getSearchSuggestions = async (term: string): Promise<SearchSuggestion[]> => {
  try {
    // Mock data for search suggestions as we're not creating actual tables
    const mockSuggestions: SearchSuggestion[] = [
      { id: '1', term: 'wireless earbuds', frequency: 120, category: 'electronics', isSponsored: false },
      { id: '2', term: 'smartphone', frequency: 100, category: 'electronics', isSponsored: false },
      { id: '3', term: 'running shoes', frequency: 80, category: 'clothing', isSponsored: false },
      { id: '4', term: 'premium coffee maker', frequency: 150, category: 'home', isSponsored: true },
      { id: '5', term: 'smartwatch', frequency: 90, category: 'electronics', isSponsored: false },
      { id: '6', term: 'fitness tracker', frequency: 70, category: 'electronics', isSponsored: true }
    ];
    
    const filteredSuggestions = mockSuggestions.filter(suggestion => 
      suggestion.term.toLowerCase().includes(term.toLowerCase())
    );
    
    return filteredSuggestions.slice(0, 5);
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
    
    // Save search query to database
    try {
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        // Insert directly to search_queries table
        await supabase
          .from('search_queries')
          .insert({
            user_id: user.user.id,
            query: query,
            corrected_query: correctedQuery,
            model_used: 'keyword',
            results_count: combinedResults.length
          });
      }
    } catch (analyticError) {
      console.error('Error logging search analytics:', analyticError);
    }
    
    // Instead of using RPC for incrementing, update directly
    const incrementFrequency = async (term: string) => {
      try {
        // First check if the suggestion exists
        const { data, count } = await supabase
          .from('search_suggestions')
          .select('*', { count: 'exact' })
          .eq('term', term)
          .single();
          
        if (count && count > 0) {
          // Update existing suggestion
          await supabase
            .from('search_suggestions')
            .update({ frequency: (data?.frequency || 0) + 1 })
            .eq('term', term);
        } else if (combinedResults.length > 0) {
          // Create new suggestion
          await supabase
            .from('search_suggestions')
            .insert({
              term: query,
              category: combinedResults[0].category,
              frequency: 1
            });
        }
      } catch (error) {
        console.error('Error updating search suggestions:', error);
      }
    };
    
    // Try to increment the search term frequency
    await incrementFrequency(query);
    
    return {
      results: combinedResults,
      correctedQuery
    };
  } catch (error) {
    console.error('Error performing search:', error);
    return { results: [] };
  }
};

// Save an image for image search
export const saveImageSearch = async (file: File): Promise<{ id: string } | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `image-search/${fileName}`;
    
    const { error } = await supabase.storage
      .from('search-images')
      .upload(filePath, file);
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('search-images')
      .getPublicUrl(filePath);
    
    // Insert directly to the table
    const { data, error: insertError } = await supabase
      .from('image_searches')
      .insert({
        user_id: user.user.id,
        image_url: publicUrl
      })
      .select('id')
      .single();
    
    if (insertError) throw insertError;
    
    return { id: data.id };
  } catch (error) {
    console.error('Error saving image for search:', error);
    return null;
  }
};

// Process an image for search
export const processImageSearch = async (imageId: string): Promise<string | null> => {
  try {
    // Get image URL
    const { data, error } = await supabase
      .from('image_searches')
      .select('image_url')
      .eq('id', imageId)
      .single();
    
    if (error) throw error;
    
    const imageUrl = data.image_url;
    
    // Process image
    const { data: processResult, error: processError } = await supabase.functions
      .invoke('process-image-search', {
        body: { imageUrl },
      });
      
    if (processError) throw processError;
    
    // Update the record with the description
    await supabase
      .from('image_searches')
      .update({ description: processResult.description })
      .eq('id', imageId);
    
    return processResult.description;
  } catch (error) {
    console.error('Error processing image search:', error);
    return null;
  }
};

// Save a voice recording
export const saveVoiceRecording = async (audioBlob: Blob): Promise<{ id: string } | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return null;
    
    const fileName = `${Date.now()}.webm`;
    const filePath = `voice-search/${fileName}`;
    
    const { error } = await supabase.storage
      .from('voice-recordings')
      .upload(filePath, audioBlob);
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('voice-recordings')
      .getPublicUrl(filePath);
    
    // Insert directly to the table
    const { data, error: insertError } = await supabase
      .from('voice_recordings')
      .insert({
        user_id: user.user.id,
        audio_url: publicUrl
      })
      .select('id')
      .single();
    
    if (insertError) throw insertError;
    
    return { id: data.id };
  } catch (error) {
    console.error('Error saving voice recording:', error);
    return null;
  }
};

// Process a voice recording to text
export const processVoiceToText = async (recordingId: string): Promise<string | null> => {
  try {
    // Get recording URL
    const { data, error } = await supabase
      .from('voice_recordings')
      .select('audio_url')
      .eq('id', recordingId)
      .single();
    
    if (error) throw error;
    
    const audioUrl = data.audio_url;
    
    // Process audio
    const { data: processResult, error: processError } = await supabase.functions
      .invoke('process-voice-search', {
        body: { audioUrl },
      });
      
    if (processError) throw processError;
    
    // Update the record with the transcription
    await supabase
      .from('voice_recordings')
      .update({ transcription: processResult.transcription })
      .eq('id', recordingId);
    
    return processResult.transcription;
  } catch (error) {
    console.error('Error processing voice to text:', error);
    return null;
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
    
    // Increment product views directly
    const { data: product } = await supabase
      .from('products')
      .select('views')
      .eq('id', resultId)
      .single();
    
    if (product) {
      await supabase
        .from('products')
        .update({ views: (product.views || 0) + 1 })
        .eq('id', resultId);
    }
    
    // If it's a sponsored result, record the click for billing
    if (isSponsored) {
      // In a real app, this would update ad metrics and billing
      console.log('Recording sponsored click for', resultId);
    }
    
    // Record user interaction if logged in
    if (user?.user) {
      await supabase
        .from('search_result_clicks')
        .insert({
          user_id: user.user.id,
          query,
          result_id: resultId,
          is_sponsored: isSponsored
        });
    }
  } catch (error) {
    console.error('Error recording search result click:', error);
  }
};
