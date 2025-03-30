
import { useQuery } from "@tanstack/react-query";
import { fetchBusinessAnalytics } from "@/utils/viewsTracking";

export interface BusinessAnalyticsData {
  businessViews: number;
  productAnalytics: Array<{
    id: string;
    title: string;
    views: number;
  }>;
  serviceAnalytics: Array<{
    id: string;
    title: string;
    views: number;
  }>;
  postAnalytics: Array<{
    id: string;
    content: string;
    views: number;
  }>;
  lastUpdated: string;
}

export const useBusinessAnalytics = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['business-analytics', userId],
    queryFn: () => fetchBusinessAnalytics(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
