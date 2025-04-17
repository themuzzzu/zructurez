
// Basic analytics data interfaces
export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageSessionDuration: number;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  plan: {
    name: string;
    price: number;
    features: string[];
  };
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
