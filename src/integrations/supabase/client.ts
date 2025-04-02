
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
  product_labels: {
    Row: {
      id: string;
      product_id: string;
      name: string;
      attributes: string[];
      created_at: string;
    };
    Insert: {
      id?: string;
      product_id: string;
      name: string;
      attributes: string[];
      created_at?: string;
    };
    Update: {
      id?: string;
      product_id?: string;
      name?: string;
      attributes?: string[];
      created_at?: string;
    };
  };
  saved_product_labels: {
    Row: {
      id: string;
      user_id: string;
      name: string;
      attributes: string[];
      created_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      name: string;
      attributes: string[];
      created_at?: string;
    };
    Update: {
      id?: string;
      user_id?: string;
      name?: string;
      attributes?: string[];
      created_at?: string;
    };
  };
};

// Update the orders table type to include address_id
type EnhancedOrdersTable = {
  orders: {
    Row: {
      id: string;
      user_id: string;
      status: string;
      created_at: string;
      total_price: number;
      quantity: number;
      product_id: string;
      business_id?: string;
      address_id?: string;
      payment_method?: string;
      coupon_code?: string;
      discount?: number;
      shipping_fee?: number;
    };
    Insert: {
      id?: string;
      user_id: string;
      status?: string;
      created_at?: string;
      total_price: number;
      quantity?: number;
      product_id: string;
      business_id?: string;
      address_id?: string;
      payment_method?: string;
      coupon_code?: string;
      discount?: number;
      shipping_fee?: number;
    };
    Update: {
      id?: string;
      user_id?: string;
      status?: string;
      created_at?: string;
      total_price?: number;
      quantity?: number;
      product_id?: string;
      business_id?: string;
      address_id?: string;
      payment_method?: string;
      coupon_code?: string;
      discount?: number;
      shipping_fee?: number;
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

// Create a custom type for our client that correctly types the from method
type CustomSupabaseClient = typeof supabaseClient & {
  from<T extends keyof (CustomSchema & EnhancedOrdersTable)>(
    table: T
  ): ReturnType<typeof supabaseClient['from']>;
};

// Cast the client to our custom type
export const supabase = supabaseClient as CustomSupabaseClient;
