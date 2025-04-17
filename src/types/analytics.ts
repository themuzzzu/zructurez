
export interface AnalyticsSummary {
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalClicks: number;
  conversionRate: number;
  period: string;
}

export interface BusinessAnalytics {
  id: string;
  business_id: string;
  period: string;
  views: number;
  engagement: number;
  conversions: number;
  revenue: number;
  daily_data: DailyAnalytics[];
}

export interface DailyAnalytics {
  date: string;
  views: number;
  engagement: number;
  conversions: number;
  revenue: number;
}

export interface AdPerformance {
  id: string;
  ad_id: string;
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  cpc: number;
  conversions: number;
  conversionRate: number;
  roi: number;
  date: string;
}
