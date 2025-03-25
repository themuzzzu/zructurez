
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { imageId } = await req.json();
    
    if (!imageId) {
      throw new Error('Image ID is required');
    }
    
    // Create a Supabase client with Admin privileges
    const supabaseAdmin = Deno.env.get('SUPABASE_URL') 
      ? createClient(
          Deno.env.get('SUPABASE_URL') || '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
        )
      : null;
    
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client could not be initialized');
    }
    
    // Get the image from the database
    const { data: imageData, error: fetchError } = await supabaseAdmin
      .from('image_search_uploads')
      .select('*')
      .eq('id', imageId)
      .single();
    
    if (fetchError || !imageData) {
      throw new Error('Image not found');
    }
    
    // Use OpenAI's Vision API to analyze the image
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a visual search assistant. Describe the products shown in the image in detail, focusing on type, color, style, and features. Format as a search query.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: imageData.image_url,
                },
              },
              {
                type: 'text',
                text: 'What is shown in this image? Describe it as if you were writing a search query to find similar products.',
              },
            ],
          },
        ],
        max_tokens: 300,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${errorText}`);
    }
    
    const result = await response.json();
    const description = result.choices[0].message.content;
    
    return new Response(
      JSON.stringify({ description }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing image search:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper function to create Supabase client
function createClient(url: string, key: string) {
  return {
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: string) => ({
          single: () => ({ data: null, error: null })
        })
      })
    })
  };
}
