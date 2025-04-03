
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
        
        // Since the user_subscriptions table doesn't exist yet in Supabase,
        // we'll return the mock data
        return mockUserSubscription;
      } catch (error) {
        console.error('Error fetching user subscription:', error);
        return null;
      }
    }
  });
};
