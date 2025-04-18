
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
  userId: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  amount: number;
  productLimit: number;
  serviceLimit: number;
  visibilityLevel: string;
  analyticsLevel: string;
  nextPaymentDate: string;
  billingInterval: string;
  plan?: {
    name: string;
    price: number;
    features: string[];
  };
}
