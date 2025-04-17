
import { createClient } from '@supabase/supabase-js';

// Setup Supabase client with placeholder values
// In a real app, these should come from environment variables
const supabaseUrl = 'https://your-supabase-project.supabase.co';
const supabaseKey = 'your-public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
