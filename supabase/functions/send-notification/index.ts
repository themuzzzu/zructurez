
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.6'
// Use firebase-admin without the problematic google-gax dependency
import * as admin from 'https://cdn.jsdelivr.net/npm/firebase-admin@11.11.0/+esm'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationPayload {
  title: string
  body: string
  user_id?: string
  tokens?: string[]
  type?: string
  data?: Record<string, string>
  topic?: string
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Initialize Firebase Admin if not already initialized
    let firebaseInitialized = false
    try {
      admin.app()
      firebaseInitialized = true
    } catch (error) {
      const firebaseConfig = JSON.parse(Deno.env.get('FIREBASE_SERVICE_ACCOUNT') || '{}')
      
      if (!Object.keys(firebaseConfig).length) {
        throw new Error('Missing Firebase service account configuration')
      }
      
      admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
      })
      firebaseInitialized = true
    }
    
    // Parse request body
    const { title, body, user_id, tokens, data, topic, type = 'general' } = await req.json() as NotificationPayload
    
    if ((!user_id && !tokens && !topic) || !title || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // If user_id is provided, fetch device tokens
    let deviceTokens: string[] = tokens || []
    
    if (user_id && !tokens) {
      const { data: tokenData, error } = await supabase
        .from('user_device_tokens')
        .select('device_token')
        .eq('user_id', user_id)
      
      if (error) {
        throw error
      }
      
      deviceTokens = tokenData.map(t => t.device_token)
    }
    
    if (deviceTokens.length === 0 && !topic) {
      return new Response(
        JSON.stringify({ message: 'No device tokens found for user' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Prepare the notification message
    const message: any = {
      notification: {
        title,
        body,
      },
      data: {
        ...data,
        type,
        title,
        body,
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      android: {
        notification: {
          sound: 'default',
          clickAction: 'FLUTTER_NOTIFICATION_CLICK',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            category: type,
          },
        },
      },
    }
    
    // Send to topic or tokens
    let response
    
    if (topic) {
      message.topic = topic
      response = await admin.messaging().send(message)
    } else {
      message.tokens = deviceTokens
      response = await admin.messaging().sendMulticast(message)
    }
    
    // Save notification to database for history (optional)
    if (user_id) {
      await supabase.from('notifications').insert({
        user_id,
        message: body,
        type,
      })
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: response,
        sentTo: topic ? `topic: ${topic}` : `${deviceTokens.length} devices`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending notification:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
