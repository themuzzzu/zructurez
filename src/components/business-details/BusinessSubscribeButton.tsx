import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface BusinessSubscribeButtonProps {
  businessId: string;
}

export const BusinessSubscribeButton = ({ businessId }: BusinessSubscribeButtonProps) => {
  const [loading, setLoading] = useState(false);

  const { data: isSubscribed, refetch } = useQuery({
    queryKey: ['business-subscription', businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('business_subscriptions')
        .select('id')
        .eq('business_id', businessId)
        .eq('user_id', user.id)
        .maybeSingle();

      return !!data;
    }
  });

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to subscribe");
        return;
      }

      if (isSubscribed) {
        const { error } = await supabase
          .from('business_subscriptions')
          .delete()
          .eq('business_id', businessId)
          .eq('user_id', user.id);

        if (error) throw error;
        toast.success("Unsubscribed successfully");
      } else {
        const { error } = await supabase
          .from('business_subscriptions')
          .insert([
            { business_id: businessId, user_id: user.id }
          ]);

        if (error) throw error;
        toast.success("Subscribed successfully");
      }
      
      refetch();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to update subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSubscribe}
      variant={isSubscribed ? "outline" : "default"}
      disabled={loading}
      className="w-full"
    >
      {loading ? "Loading..." : (isSubscribed ? "Unsubscribe" : "Subscribe")}
    </Button>
  );
};