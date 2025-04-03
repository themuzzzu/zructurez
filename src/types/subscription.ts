
export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  status: string;
  created_at: string;
  amount: number;
  billing_interval: string;
  next_payment_date: string;
  product_limit: number;
  service_limit: number;
  visibility_level: string;
  analytics_level: string;
}

export interface PaymentHistory {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  payment_date: string;
  plan_name: string;
  transaction_id: string;
}

export interface RankingMetrics {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  price?: number;
  image_url?: string;
  category?: string;
  views?: number;
  rank?: number;
  badge?: string;
  score?: number; // Added for compatibility
}
