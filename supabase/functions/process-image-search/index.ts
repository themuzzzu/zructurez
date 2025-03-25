
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
    const { imageUrl } = await req.json();
    
    if (!imageUrl) {
      throw new Error('No image URL provided');
    }

    // In a real implementation, this would call a computer vision API
    // For now, we'll simulate by generating a realistic description
    const description = await generateImageDescription(imageUrl);

    return new Response(
      JSON.stringify({ description }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateImageDescription(imageUrl: string): Promise<string> {
  // This is where you'd call a service like Google Cloud Vision, Azure Computer Vision, etc.
  // For this demo, we'll return a mock description
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a realistic description that would be useful for product search
  const productTypes = [
    "smartphone black android mobile device gadget electronics",
    "t-shirt cotton apparel clothing fashion casual red",
    "athletic shoes running footwear sports sneakers blue white",
    "dining table wooden furniture home decor brown",
    "leather wallet accessories brown fashion",
    "headphones wireless audio electronics black gadget",
    "laptop computer notebook device electronics silver",
    "watch wristwatch accessories fashion silver analog",
    "backpack bag travel accessories black",
    "sunglasses eyewear fashion accessories black"
  ];
  
  // Return a random description
  return productTypes[Math.floor(Math.random() * productTypes.length)];
}
