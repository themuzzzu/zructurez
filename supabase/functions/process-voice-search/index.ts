
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
    const { audioUrl } = await req.json()
    
    if (!audioUrl) {
      throw new Error('No audio URL provided')
    }

    // For demo purposes, we'll return mock transcriptions
    // In a real app, this would call a speech-to-text API (like Google Speech-to-Text, Amazon Transcribe, etc.)
    const mockTranscriptions = [
      'show me winter jackets',
      'I need shoes for running',
      'find red dresses under fifty dollars',
      'show leather bags on sale',
      'find bluetooth headphones with noise cancellation',
      'search for gaming laptops',
      'show me kitchen gadgets',
      'find phone cases for iPhone 13',
      'search for outdoor furniture',
      'show me smart home devices'
    ]
    
    // Pick a random transcription
    const randomIndex = Math.floor(Math.random() * mockTranscriptions.length)
    const transcription = mockTranscriptions[randomIndex]
    
    // Add a short delay to simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return new Response(
      JSON.stringify({ 
        transcription,
        confidence: 0.92,
        audioUrl
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
