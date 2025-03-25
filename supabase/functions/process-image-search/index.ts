
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    
    if (!imageUrl) {
      throw new Error('No image URL provided')
    }

    // For demo purposes, we'll return a mock description
    // In a real app, this would call a CV API (like Google Cloud Vision, Microsoft Computer Vision, etc.)
    const mockDescriptions = [
      'black leather shoes footwear fashion boots',
      'smartphone mobile device electronics gadget tech',
      'headphones audio wireless electronics sound',
      'modern furniture home decor interior chair',
      'coffee mug kitchen ceramic drink home',
      'laptop computer electronics device tech',
      'wristwatch accessory timepiece style fashion',
      'backpack bag travel accessory fashion',
      'camera photography device electronics gadget',
      'sunglasses eyewear fashion accessory style'
    ]
    
    // Pick a random description
    const randomIndex = Math.floor(Math.random() * mockDescriptions.length)
    const description = mockDescriptions[randomIndex]
    
    // Add a short delay to simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return new Response(
      JSON.stringify({ 
        description,
        confidence: 0.95,
        imageUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
