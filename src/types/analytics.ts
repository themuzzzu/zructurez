
export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'expired' | 'pending';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
  plan?: {
    name: string;
    price: number;
    interval: 'month' | 'year';
    features: string[];
  };
}

export interface UserAnalytics {
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  period: 'day' | 'week' | 'month' | 'year';
  data: {
    date: string;
    value: number;
  }[];
}
