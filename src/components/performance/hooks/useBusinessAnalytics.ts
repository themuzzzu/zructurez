
import { useQuery } from "@tanstack/react-query";
import { fetchBusinessAnalytics } from "@/utils/viewsTracking";

export const useBusinessAnalytics = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['business-analytics', userId],
    queryFn: () => fetchBusinessAnalytics(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
