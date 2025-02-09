
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

export const usePerformanceMetrics = () => {
  const [realtimeData, setRealtimeData] = useState<any[]>([]);

  const { data: metrics = [], isLoading } = useQuery({
    queryKey: ['performance-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'performance_metrics',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            setRealtimeData(current => [payload.new, ...current].slice(0, 100));
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtimeSubscription();
  }, []);

  const combinedData = [...(realtimeData || []), ...(metrics || [])].slice(0, 100);

  return {
    combinedData,
    isLoading
  };
};
