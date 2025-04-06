
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceCard } from "@/components/ServiceCard";
import { RankingsTabs } from "./RankingsTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/utils/productUtils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { toast } from "sonner";

export const ServiceRankings = () => {
  const navigate = useNavigate();
  const [rankingType, setRankingType] = useState<"views" | "recent" | "price">("views");
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "all">("all");
  const [retryCount, setRetryCount] = useState(0);
  
  const { data: services, isLoading, error, refetch } = useQuery({
    queryKey: ['service-rankings', rankingType, timeframe],
    queryFn: async () => {
      try {
        let query = supabase
          .from('services')
          .select('*');
        
        // Apply sorting based on ranking type
        switch (rankingType) {
          case 'views':
            query = query.order('views', { ascending: false });
            break;
          case 'recent':
            query = query.order('created_at', { ascending: false });
            break;
          case 'price':
            query = query.order('price', { ascending: false });
            break;
        }
        
        // Apply timeframe filter
        if (timeframe !== 'all') {
          const now = new Date();
          let startDate;
          
          switch (timeframe) {
            case 'day':
              startDate = new Date(now.setDate(now.getDate() - 1));
              break;
            case 'week':
              startDate = new Date(now.setDate(now.getDate() - 7));
              break;
            case 'month':
              startDate = new Date(now.setMonth(now.getMonth() - 1));
              break;
          }
          
          query = query.gte('created_at', startDate.toISOString());
        }
        
        const { data, error } = await query.limit(8);
        
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Error fetching rankings:", err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });

  // Handle errors with automatic retry
  useEffect(() => {
    if (error && retryCount < 3) {
      const timer = setTimeout(() => {
        console.log(`Retrying service rankings fetch (attempt ${retryCount + 1})...`);
        setRetryCount(prev => prev + 1);
        refetch();
      }, 2000 * (retryCount + 1)); // Increase delay with each retry
      
      return () => clearTimeout(timer);
    } else if (error && retryCount >= 3) {
      toast.error("Could not load service rankings. Please try again later.");
    }
  }, [error, retryCount, refetch]);

  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
        <h3 className="text-xl md:text-2xl font-bold">Top Rankings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Handle empty state or error state with graceful fallback
  if (!services || services.length === 0) {
    return (
      <div className="space-y-4 mb-8">
        <h3 className="text-xl md:text-2xl font-bold">Top Rankings</h3>
        <div className="p-8 text-center border rounded-lg bg-background">
          <p className="text-muted-foreground mb-4">No rankings available at this moment.</p>
          <Button onClick={() => refetch()} variant="outline">
            Refresh Rankings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl md:text-2xl font-bold">Top Rankings</h3>
        <div className="flex flex-wrap gap-2">
          <Select value={rankingType} onValueChange={(value) => setRankingType(value as any)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="views">Most Viewed</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="price">Top Price</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24h</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.slice(0, 4).map((service, index) => (
          <ErrorBoundary key={service.id}>
            <div className="relative">
              {index < 3 && (
                <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold z-10 shadow-md">
                  {index + 1}
                </div>
              )}
              <ServiceCard
                id={service.id}
                name={service.title || 'Untitled Service'}
                description={service.description || 'No description available'}
                image={service.image_url || '/placeholder.svg'}
                price={formatPrice(service.price || 0)}
                providerName={service.provider_name || 'Service Provider'}
                providerId={service.user_id || ''}
              />
            </div>
          </ErrorBoundary>
        ))}
      </div>
      
      {services.length > 4 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {services.slice(4, 8).map((service) => (
            <ErrorBoundary key={service.id}>
              <ServiceCard
                id={service.id}
                name={service.title || 'Untitled Service'}
                description={service.description || 'No description available'}
                image={service.image_url || '/placeholder.svg'}
                price={formatPrice(service.price || 0)}
                providerName={service.provider_name || 'Service Provider'}
                providerId={service.user_id || ''}
              />
            </ErrorBoundary>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-4">
        <Button 
          onClick={() => navigate(`/search?type=service&sort=${rankingType}`)}
          variant="outline"
        >
          View All Rankings
        </Button>
      </div>
    </div>
  );
};
