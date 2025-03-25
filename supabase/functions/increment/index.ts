
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    const { table, id, column, value = 1 } = await req.json();
    
    if (!table || !id || !column) {
      throw new Error('Missing required parameters: table, id, column');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    // Get current value
    const { data, error: fetchError } = await supabaseClient
      .from(table)
      .select(column)
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Calculate new value
    const currentValue = data?.[column] || 0;
    const newValue = currentValue + value;
    
    // Update the value
    const { error: updateError } = await supabaseClient
      .from(table)
      .update({ [column]: newValue })
      .eq('id', id);
      
    if (updateError) throw updateError;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        previous: currentValue,
        current: newValue
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
