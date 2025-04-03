
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

export interface AnalyticsSummary {
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalClicks: number;
}

export interface RankingMetrics {
  id: string;
  rank?: number;
  badge?: string;
  views?: number;
  category?: string;
  name?: string;
  title?: string;
  image_url?: string;
}
