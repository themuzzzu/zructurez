
import { useQuery } from "@tanstack/react-query";
import { BusinessCard } from "@/components/BusinessCard";
import { supabase } from "@/integrations/supabase/client";

export const SubscribedBusinessesTab = () => {
  const { data: subscribedBusinesses } = useQuery({
    queryKey: ['user-subscribed-businesses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from('business_subscriptions')
        .select(`
          business_id,
          businesses (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      return data?.map(item => item.businesses) || [];
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subscribedBusinesses?.map((business: any) => (
        <div key={business.id} className="w-full">
          <div className="aspect-[3/4] w-full">
            <BusinessCard {...business} />
          </div>
        </div>
      ))}
    </div>
  );
};
