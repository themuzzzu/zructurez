
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Image URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing image: ${imageUrl}`);
    
    // If OpenAI key is available, use Vision API
    if (openAIApiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a product image analyzer. Describe the image briefly and extract search keywords that would be useful for finding similar products. Focus on: product type, color, style, material, and any distinctive features. Provide only comma-separated keywords, nothing else.'
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Describe this product image as search keywords:' },
                { type: 'image_url', image_url: { url: imageUrl } }
              ]
            }
          ],
          max_tokens: 300
        })
      });

      const data = await response.json();
      
      if (data.error) {
        console.error('OpenAI API error:', data.error);
        throw new Error(data.error.message);
      }
      
      const description = data.choices[0].message.content.trim();
      
      return new Response(
        JSON.stringify({ description }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Fallback if no API key available - return mock analysis
      console.log('No OpenAI API key available, returning mock response');
      
      const mockResponses = [
        "black leather shoes, formal footwear, men's fashion, polished, business attire",
        "red dress, sleeveless, cocktail, party wear, evening outfit, women's fashion",
        "wooden furniture, coffee table, living room, rustic design, home decor",
        "smartphone, black, mobile device, electronics, touchscreen, gadget",
        "winter jacket, puffer coat, cold weather, outdoor clothing, zipper, pockets"
      ];
      
      const description = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      return new Response(
        JSON.stringify({ description }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error processing image:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process image' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
