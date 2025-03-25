
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const deepSeekApiKey = Deno.env.get('DEEPSEEK_API_KEY');
const qwenApiKey = Deno.env.get('QWEN_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, modelProvider = 'openai' } = await req.json();
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Image URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing image with ${modelProvider}: ${imageUrl}`);
    
    // Choose the API based on the modelProvider parameter
    let modelKey;
    let apiEndpoint;
    let requestBody;
    
    switch(modelProvider) {
      case 'openai':
        if (!openAIApiKey) {
          return mockResponse();
        }
        
        modelKey = openAIApiKey;
        apiEndpoint = 'https://api.openai.com/v1/chat/completions';
        requestBody = {
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
        };
        break;
        
      case 'deepseek':
        if (!deepSeekApiKey) {
          return mockResponse();
        }
        
        // DeepSeek API integration would go here
        // For now, we'll return a mock response
        return mockResponse();
        
      case 'qwen':
        if (!qwenApiKey) {
          return mockResponse();
        }
        
        // Qwen API integration would go here
        // For now, we'll return a mock response
        return mockResponse();
        
      default:
        if (!openAIApiKey) {
          return mockResponse();
        }
        
        // Default to OpenAI
        modelKey = openAIApiKey;
        apiEndpoint = 'https://api.openai.com/v1/chat/completions';
        requestBody = {
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
        };
    }
    
    // Call the selected API
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${modelKey}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    if (data.error) {
      console.error(`${modelProvider} API error:`, data.error);
      throw new Error(data.error.message);
    }
    
    const description = data.choices[0].message.content.trim();
    
    return new Response(
      JSON.stringify({ description }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing image:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process image' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // Helper function to return a mock response when API keys are not available
  function mockResponse() {
    console.log('No API key available, returning mock response');
    
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
});
