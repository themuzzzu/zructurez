
import { useQuery } from "@tanstack/react-query";
import { BusinessCard } from "@/components/BusinessCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const SubscribedBusinessesTab = () => {
  const { data: subscribedBusinesses, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!subscribedBusinesses?.length) {
    return (
      <div className="text-center p-12">
        <p className="text-muted-foreground">You haven't subscribed to any businesses yet.</p>
      </div>
    );
  }

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
