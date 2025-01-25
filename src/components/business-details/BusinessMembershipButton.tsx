import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface BusinessMembershipButtonProps {
  businessId: string;
}

export const BusinessMembershipButton = ({ businessId }: BusinessMembershipButtonProps) => {
  const [loading, setLoading] = useState(false);

  const { data: membership, refetch } = useQuery({
    queryKey: ['business-membership', businessId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from('business_memberships')
        .select('*')
        .eq('business_id', businessId)
        .eq('user_id', user.id)
        .maybeSingle();

      return data;
    }
  });

  const handleMembership = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to join membership");
        return;
      }

      if (membership) {
        const { error } = await supabase
          .from('business_memberships')
          .update({ status: membership.status === 'active' ? 'cancelled' : 'active' })
          .eq('id', membership.id);

        if (error) throw error;
        toast.success(membership.status === 'active' ? "Membership cancelled" : "Membership reactivated");
      } else {
        const { error } = await supabase
          .from('business_memberships')
          .insert([
            { 
              business_id: businessId, 
              user_id: user.id,
              membership_type: 'basic',
              status: 'active'
            }
          ]);

        if (error) throw error;
        toast.success("Joined membership successfully");
      }
      
      refetch();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to update membership");
    } finally {
      setLoading(false);
    }
  };

  const isActive = membership?.status === 'active';

  return (
    <Button 
      onClick={handleMembership}
      variant={isActive ? "outline" : "default"}
      disabled={loading}
      className="w-full bg-red-600 hover:bg-red-700 text-white"
    >
      {loading ? "Loading..." : (
        membership 
          ? (isActive ? "Cancel Membership" : "Reactivate Membership")
          : "Join Membership"
      )}
    </Button>
  );
};