
export interface AnalyticsSummary {
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalClicks: number;
  conversionRate: number;
  period: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  status: string;
  amount: number;
  billing_interval: string;
  next_payment_date: string;
  product_limit: number;
  service_limit: number;
  visibility_level: string;
  analytics_level: string;
  created_at: string;
}
