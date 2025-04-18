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
  nextPaymentDate: string;
  amount: number;
  productLimit: number;
  serviceLimit: number;
  visibilityLevel: string;
  analyticsLevel: string;
  billingInterval: string;
  plan?: {
    name: string;
    price: number;
    features: string[];
  };
}

// Basic analytics data interfaces
export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageSessionDuration: number;
}

export interface MetricData {
  name: string;
  value: number;
  previousValue: number;
  percentChange: number;
  isPositive: boolean;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface AnalyticsFilters {
  startDate: Date;
  endDate: Date;
  granularity: 'day' | 'week' | 'month';
  segment?: string;
}

export interface EventData {
  eventName: string;
  count: number;
  uniqueUsers: number;
}
