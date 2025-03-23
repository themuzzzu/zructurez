
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kjmlxafygdzkrlopyyvk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbWx4YWZ5Z2R6a3Jsb3B5eXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0OTM1OTcsImV4cCI6MjA0OTA2OTU5N30.YSE8moLsMnhZIMnCdVfL7b2Xj2SDF9pHkLTKVTPLUkM";

// Create a custom type that includes our RPC functions
type CustomSupabaseClient = ReturnType<typeof createClient<Database>> & {
  rpc: ReturnType<typeof createClient<Database>>["rpc"] & {
    (
      fn: "increment_ad_views" | "increment_ad_clicks" | "update_user_presence" | "get_user_presence",
      params: { 
        ad_id?: string; 
        user_id?: string; 
        last_seen_time?: string;
      }
    ): Promise<{ data: any; error: any }>;
  };
};

// Create and export the Supabase client with our custom type
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
) as CustomSupabaseClient;
