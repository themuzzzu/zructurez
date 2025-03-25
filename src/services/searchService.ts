
import { supabase } from "@/integrations/supabase/client";
import { SearchResult, SearchSuggestion, SearchFilters } from "@/types/search";

// Get search suggestions based on user input
export const getSearchSuggestions = async (term: string): Promise<SearchSuggestion[]> => {
  try {
    // Create queries for both tables
    const { data: suggestionData } = await supabase
      .from('search_suggestions')
      .select('id, term, frequency, category')
      .ilike('term', `%${term}%`)
      .order('frequency', { ascending: false })
      .limit(5);
      
    const { data: sponsoredData } = await supabase
      .from('sponsored_search_terms')
      .select('id, term, bid_amount')
      .ilike('term', `%${term}%`)
      .eq('status', 'active')
      .order('bid_amount', { ascending: false })
      .limit(2);
      
    // Convert to the correct type
    const suggestions: SearchSuggestion[] = [
      ...(suggestionData || []).map((suggestion: any) => ({
        id: suggestion.id,
        term: suggestion.term,
        frequency: suggestion.frequency || 1,
        category: suggestion.category,
        isSponsored: false
      })),
      ...(sponsoredData || []).map((sponsored: any) => ({
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
    try {
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        await supabase.rpc('insert_search_query', {
          user_id_param: user.user.id,
          query_param: query,
          corrected_query_param: correctedQuery,
          model_used_param: 'keyword',
          results_count_param: combinedResults.length
        });
      }
    } catch (analyticError) {
      console.error('Error logging search analytics:', analyticError);
    }
    
    // Also increment search suggestion frequency or create new suggestion
    try {
      // Check if suggestion exists
      const { data: exists } = await supabase.rpc('check_search_suggestion_exists', {
        term_param: query
      });
      
      if (exists) {
        await supabase.rpc('increment_search_suggestion', {
          term_param: query
        });
      } else if (combinedResults.length > 0) {
        // Only add suggestion if it returned results
        await supabase.rpc('create_search_suggestion', {
          term_param: query,
          category_param: combinedResults[0].category
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
    
    const { data, error: insertError } = await supabase.rpc('insert_image_search', {
      user_id_param: user.user.id,
      image_url_param: publicUrl
    });
    
    if (insertError) throw insertError;
    
    return { id: data as string };
  } catch (error) {
    console.error('Error saving image for search:', error);
    return null;
  }
};

// Process an image for search
export const processImageSearch = async (imageId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('get_image_search_url', {
      image_id_param: imageId
    });
    
    if (error) throw error;
    
    const imageData = data as any;
    
    const { data: processResult, error: processError } = await supabase.functions
      .invoke('process-image-search', {
        body: { imageUrl: imageData.image_url },
      });
      
    if (processError) throw processError;
    
    // Update the record with the description
    await supabase.rpc('update_image_search_description', {
      image_id_param: imageId,
      description_param: processResult.description
    });
    
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
    
    const { data, error: insertError } = await supabase.rpc('insert_voice_recording', {
      user_id_param: user.user.id,
      audio_url_param: publicUrl
    });
    
    if (insertError) throw insertError;
    
    return { id: data as string };
  } catch (error) {
    console.error('Error saving voice recording:', error);
    return null;
  }
};

// Process a voice recording to text
export const processVoiceToText = async (recordingId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('get_voice_recording_url', {
      recording_id_param: recordingId
    });
    
    if (error) throw error;
    
    const recordingData = data as any;
    
    const { data: processResult, error: processError } = await supabase.functions
      .invoke('process-voice-search', {
        body: { audioUrl: recordingData.audio_url },
      });
      
    if (processError) throw processError;
    
    // Update the record with the transcription
    await supabase.rpc('update_voice_recording_transcription', {
      recording_id_param: recordingId,
      transcription_param: processResult.transcription
    });
    
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
    
    // Increment product views
    await supabase.rpc('increment_product_views', { product_id_param: resultId });
    
    // If it's a sponsored result, record the click for billing
    if (isSponsored) {
      // In a real app, this would update ad metrics and billing
      console.log('Recording sponsored click for', resultId);
    }
    
    // Record user interaction if logged in
    if (user?.user) {
      await supabase.rpc('record_search_result_click', {
        user_id_param: user.user.id,
        query_param: query,
        result_id_param: resultId,
        is_sponsored_param: isSponsored
      });
    }
  } catch (error) {
    console.error('Error recording search result click:', error);
  }
};
