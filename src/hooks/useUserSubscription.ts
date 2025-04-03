
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserSubscription } from '@/types/analytics';
import { mockUserSubscription } from '@/utils/mock-data';

export const useUserSubscription = () => {
  return useQuery({
    queryKey: ['user-subscription'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        
        // In the actual implementation, this would be a real DB query
        // For now, return mock data while the schema is being set up
        return mockUserSubscription;
      } catch (error) {
        console.error('Error fetching user subscription:', error);
        return null;
      }
    }
  });
};
