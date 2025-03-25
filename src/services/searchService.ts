import { supabase } from "@/integrations/supabase/client";
import type { 
  SearchResult, 
  SearchSuggestion, 
  SearchFilters, 
  VoiceSearchData,
  ImageSearchData,
  SponsoredTerm
} from "@/types/search";

// Get search suggestions as user types
export const getSearchSuggestions = async (term: string): Promise<SearchSuggestion[]> => {
  if (!term || term.length < 2) return [];
  
  try {
    // Get from suggestions table first
    const { data: suggestions, error } = await supabase
      .from('search_suggestions')
      .select('*')
      .ilike('term', `%${term}%`)
      .order('frequency', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    // If we have enough suggestions, return them
    if (suggestions.length >= 3) {
      return suggestions.map(s => ({
        id: s.id,
        term: s.term,
        frequency: s.frequency,
        category: s.category,
        isSponsored: s.is_sponsored
      }));
    }
    
    // Otherwise, also search products table for additional suggestions
    const { data: products } = await supabase
      .from('products')
      .select('id, title')
      .ilike('title', `%${term}%`)
      .limit(5 - suggestions.length);
    
    const productSuggestions = products?.map(p => ({
      id: p.id,
      term: p.title,
      frequency: 1,
      category: 'product'
    })) || [];
    
    return [...suggestions.map(s => ({
      id: s.id,
      term: s.term,
      frequency: s.frequency,
      category: s.category,
      isSponsored: s.is_sponsored
    })), ...productSuggestions];
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return [];
  }
};

// Search function for products
export const searchProducts = async (
  query: string, 
  filters?: SearchFilters
): Promise<SearchResult[]> => {
  try {
    let searchQuery = supabase
      .from('products')
      .select('*');
    
    // Apply text search
    searchQuery = searchQuery.or(`title.ilike.%${query}%, description.ilike.%${query}%`);
    
    // Apply filters if provided
    if (filters) {
      if (filters.categories && filters.categories.length > 0) {
        searchQuery = searchQuery.in('category', filters.categories);
      }
      
      if (filters.priceMin !== undefined) {
        searchQuery = searchQuery.gte('price', filters.priceMin);
      }
      
      if (filters.priceMax !== undefined) {
        searchQuery = searchQuery.lte('price', filters.priceMax);
      }
    }
    
    // Apply sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          searchQuery = searchQuery.order('price', { ascending: true });
          break;
        case 'price-desc':
          searchQuery = searchQuery.order('price', { ascending: false });
          break;
        case 'newest':
          searchQuery = searchQuery.order('created_at', { ascending: false });
          break;
        default:
          // Default sort by relevance (handled client-side for now)
          searchQuery = searchQuery.order('views', { ascending: false });
      }
    } else {
      // Default sorting
      searchQuery = searchQuery.order('views', { ascending: false });
    }
    
    const { data, error } = await searchQuery;
    
    if (error) throw error;
    
    // Transform to search results
    return data.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      imageUrl: product.image_url,
      category: product.category,
      price: product.price,
      type: 'product',
      url: `/product/${product.id}`,
      isSponsored: false
    }));
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

// Combined search that looks across multiple entity types
export const performSearch = async (
  query: string,
  filters?: SearchFilters
): Promise<{results: SearchResult[], correctedQuery?: string}> => {
  try {
    if (!query || query.trim().length === 0) {
      return { results: [] };
    }
    
    // Log the search query if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('search_queries').insert({
        user_id: user.id,
        query: query,
        model_used: 'keyword', // For now, just using keyword search
        session_id: sessionStorage.getItem('sessionId') || crypto.randomUUID()
      });
    }
    
    // Get sponsored results if enabled
    let sponsoredResults: SearchResult[] = [];
    if (filters?.includeSponsored !== false) {
      const sponsoredProducts = await getSponsoredResults(query);
      sponsoredResults = sponsoredProducts;
    }
    
    // Get regular search results
    const productResults = await searchProducts(query, filters);
    
    // Look for businesses and services matching the query
    const businessResults = await searchBusinesses(query);
    
    // Check for spelling corrections (simplified for now)
    const correctedQuery = checkSpellingCorrection(query);
    
    // Merge and sort results, with sponsored results at top
    const allResults = [...sponsoredResults, ...productResults, ...businessResults];
    
    return {
      results: allResults,
      correctedQuery: correctedQuery !== query ? correctedQuery : undefined
    };
  } catch (error) {
    console.error('Error performing search:', error);
    return { results: [] };
  }
};

// Simple spelling correction (placeholder for more advanced implementation)
const checkSpellingCorrection = (query: string): string => {
  // Common misspellings dictionary (simplified example)
  const corrections: Record<string, string> = {
    'phne': 'phone',
    'labtop': 'laptop',
    'camrea': 'camera',
    'cloths': 'clothes',
    'jaket': 'jacket',
    'shrt': 'shirt'
  };
  
  const words = query.toLowerCase().split(' ');
  const correctedWords = words.map(word => corrections[word] || word);
  const corrected = correctedWords.join(' ');
  
  return corrected;
};

// Get sponsored search results
const getSponsoredResults = async (query: string): Promise<SearchResult[]> => {
  try {
    // Find sponsored terms that match the search query
    const { data: sponsoredTerms } = await supabase
      .from('sponsored_search_terms')
      .select(`
        *,
        businesses(id, name, description, image_url, category)
      `)
      .eq('status', 'active')
      .lte('spent_today', supabase.raw('max_daily_budget'))
      .or(`term.ilike.%${query}%, term.eq.${query}`);
    
    if (!sponsoredTerms || sponsoredTerms.length === 0) {
      return [];
    }
    
    // Increment impressions for these terms
    const termIds = sponsoredTerms.map(term => term.id);
    await supabase.rpc('increment_sponsored_impressions', { term_ids: termIds });
    
    // Get products from these businesses that match the query
    const businessIds = sponsoredTerms.map(term => term.business_id);
    
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .in('user_id', businessIds)
      .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
      .limit(3);
    
    if (!products || products.length === 0) {
      return [];
    }
    
    // Convert to search results with sponsored flag
    return products.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      imageUrl: product.image_url,
      category: product.category,
      price: product.price,
      type: 'product',
      url: `/product/${product.id}`,
      isSponsored: true
    }));
  } catch (error) {
    console.error('Error getting sponsored results:', error);
    return [];
  }
};

// Search businesses
const searchBusinesses = async (query: string): Promise<SearchResult[]> => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .or(`name.ilike.%${query}%, description.ilike.%${query}%, category.ilike.%${query}%`)
      .order('verified', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    return (data || []).map(business => ({
      id: business.id,
      title: business.name,
      description: business.description,
      imageUrl: business.image_url,
      category: business.category,
      type: 'business',
      url: `/business/${business.id}`,
      isSponsored: false
    }));
  } catch (error) {
    console.error('Error searching businesses:', error);
    return [];
  }
};

// Record a click on a search result
export const recordSearchResultClick = async (resultId: string, isSponsored: boolean, query: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    // Update the user's recent search
    const { data: searchQueries } = await supabase
      .from('search_queries')
      .select('id')
      .eq('user_id', user.id)
      .eq('query', query)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (searchQueries && searchQueries.length > 0) {
      await supabase
        .from('search_queries')
        .update({
          clicked_results: supabase.raw(`clicked_results || '{"${resultId}": "${new Date().toISOString()}"}'::jsonb`)
        })
        .eq('id', searchQueries[0].id);
    }
    
    // If it's a sponsored result, record the click and update billing
    if (isSponsored) {
      // First, find which sponsored term led to this result
      const { data: products } = await supabase
        .from('products')
        .select('user_id')
        .eq('id', resultId)
        .single();
      
      if (products) {
        const { data: sponsoredTerms } = await supabase
          .from('sponsored_search_terms')
          .select('id, bid_amount')
          .eq('business_id', products.user_id)
          .like('term', `%${query}%`)
          .eq('status', 'active')
          .limit(1);
        
        if (sponsoredTerms && sponsoredTerms.length > 0) {
          // Record click and update spend
          await supabase
            .from('sponsored_search_terms')
            .update({
              clicks: supabase.raw('clicks + 1'),
              spent_today: supabase.raw(`spent_today + ${sponsoredTerms[0].bid_amount}`)
            })
            .eq('id', sponsoredTerms[0].id);
        }
      }
    }
  } catch (error) {
    console.error('Error recording search result click:', error);
  }
};

// Save voice recording for speech-to-text processing
export const saveVoiceRecording = async (audioBlob: Blob): Promise<VoiceSearchData | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in');
    
    // Create a unique filename
    const filename = `voice-search-${user.id}-${new Date().getTime()}.webm`;
    
    // Upload the audio file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('voice-searches')
      .upload(filename, audioBlob, {
        contentType: 'audio/webm',
      });
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('voice-searches')
      .getPublicUrl(filename);
    
    // Save the record in the database
    const { data, error } = await supabase
      .from('voice_search_recordings')
      .insert({
        user_id: user.id,
        audio_url: publicUrl,
        processed: false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      audioUrl: data.audio_url,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error saving voice recording:', error);
    return null;
  }
};

// Process voice recording with speech-to-text
export const processVoiceToText = async (recordingId: string): Promise<string | null> => {
  try {
    // Call the speech-to-text edge function
    const { data, error } = await supabase.functions.invoke('process-voice-search', {
      body: { recordingId }
    });
    
    if (error) throw error;
    
    // Update the database with the transcription
    if (data.transcription) {
      await supabase
        .from('voice_search_recordings')
        .update({
          transcription: data.transcription,
          processed: true
        })
        .eq('id', recordingId);
    }
    
    return data.transcription || null;
  } catch (error) {
    console.error('Error processing voice to text:', error);
    return null;
  }
};

// Save image for visual search
export const saveImageSearch = async (imageBlob: Blob): Promise<ImageSearchData | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in');
    
    // Create a unique filename
    const filename = `image-search-${user.id}-${new Date().getTime()}.jpg`;
    
    // Upload the image file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('image-searches')
      .upload(filename, imageBlob, {
        contentType: 'image/jpeg',
      });
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('image-searches')
      .getPublicUrl(filename);
    
    // Save the record in the database
    const { data, error } = await supabase
      .from('image_search_uploads')
      .insert({
        user_id: user.id,
        image_url: publicUrl,
        processed: false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      imageUrl: data.image_url,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error saving image search:', error);
    return null;
  }
};

// Process image for visual search
export const processImageSearch = async (imageId: string): Promise<string | null> => {
  try {
    // Call the image-to-text edge function
    const { data, error } = await supabase.functions.invoke('process-image-search', {
      body: { imageId }
    });
    
    if (error) throw error;
    
    // Update the database with the description
    if (data.description) {
      await supabase
        .from('image_search_uploads')
        .update({
          description: data.description,
          processed: true
        })
        .eq('id', imageId);
    }
    
    return data.description || null;
  } catch (error) {
    console.error('Error processing image search:', error);
    return null;
  }
};
