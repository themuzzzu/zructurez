
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kjmlxafygdzkrlopyyvk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbWx4YWZ5Z2R6a3Jsb3B5eXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0OTM1OTcsImV4cCI6MjA0OTA2OTU5N30.YSE8moLsMnhZIMnCdVfL7b2Xj2SDF9pHkLTKVTPLUkM";

// Create a custom type that includes our RPC functions and also our missing tables
type CustomSchema = Database['public']['Tables'] & {
  user_addresses: {
    Row: {
      id: string;
      user_id: string;
      name: string;
      phone: string;
      address_line1: string;
      address_line2?: string;
      city: string;
      state: string;
      postal_code: string;
      is_default: boolean;
      address_type: 'home' | 'work' | 'other';
      created_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      name: string;
      phone: string;
      address_line1: string;
      address_line2?: string;
      city: string;
      state: string;
      postal_code: string;
      is_default?: boolean;
      address_type: 'home' | 'work' | 'other';
      created_at?: string;
    };
    Update: {
      id?: string;
      user_id?: string;
      name?: string;
      phone?: string;
      address_line1?: string;
      address_line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      is_default?: boolean;
      address_type?: 'home' | 'work' | 'other';
      created_at?: string;
    };
  };
  coupons: {
    Row: {
      id: string;
      code: string;
      discount_type: 'percentage' | 'fixed';
      discount_value: number;
      min_order_value: number;
      max_discount?: number;
      valid_from: string;
      valid_until: string;
      is_active: boolean;
      created_at: string;
    };
    Insert: {
      id?: string;
      code: string;
      discount_type: 'percentage' | 'fixed';
      discount_value: number;
      min_order_value?: number;
      max_discount?: number;
      valid_from?: string;
      valid_until: string;
      is_active?: boolean;
      created_at?: string;
    };
    Update: {
      id?: string;
      code?: string;
      discount_type?: 'percentage' | 'fixed';
      discount_value?: number;
      min_order_value?: number;
      max_discount?: number;
      valid_from?: string;
      valid_until?: string;
      is_active?: boolean;
      created_at?: string;
    };
  };
  order_items: {
    Row: {
      id: string;
      order_id: string;
      product_id: string;
      quantity: number;
      price: number;
      total: number;
      created_at: string;
    };
    Insert: {
      id?: string;
      order_id: string;
      product_id: string;
      quantity?: number;
      price: number;
      total: number;
      created_at?: string;
    };
    Update: {
      id?: string;
      order_id?: string;
      product_id?: string;
      quantity?: number;
      price?: number;
      total?: number;
      created_at?: string;
    };
  };
};

// Create the Supabase client with the standard types
const supabaseClient = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Create a custom type for our client that overrides the 'from' method
export const supabase = {
  ...supabaseClient,
  from: (table: string) => {
    return supabaseClient.from(table as any);
  },
} as unknown as ReturnType<typeof createClient<Database>> & {
  from<T extends keyof CustomSchema>(
    table: T
  ): ReturnType<typeof createClient<Database>['from']>;
  rpc: ReturnType<typeof createClient<Database>>["rpc"] & {
    (
      fn: "increment_ad_views" | "increment_ad_clicks" | "update_user_presence" | "get_user_presence" | "record_ad_conversion" | "record_ad_impression",
      params: { 
        ad_id?: string; 
        user_id?: string; 
        last_seen_time?: string;
        conversion_type?: string;
        location?: string;
      }
    ): Promise<{ data: any; error: any }>;
  };
};
