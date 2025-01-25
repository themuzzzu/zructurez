import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { MembershipPlansCard } from "./profile/MembershipPlansCard";

interface BusinessMembershipButtonProps {
  businessId: string;
}

export const BusinessMembershipButton = ({ businessId }: BusinessMembershipButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [showPlans, setShowPlans] = useState(false);

  const { data: business } = useQuery({
    queryKey: ['business-plans', businessId],
    queryFn: async () => {
      const { data } = await supabase
        .from('businesses')
        .select('membership_plans')
        .eq('id', businessId)
        .single();
      return data;
    }
  });

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

  const handleMembership = async (plan: any) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to join membership");
        return;
      }

      if (membership) {
        if (membership.status === 'active') {
          const { error } = await supabase
            .from('business_memberships')
            .update({ status: 'cancelled' })
            .eq('id', membership.id);

          if (error) throw error;
          toast.success("Membership cancelled");
        } else {
          const { error } = await supabase
            .from('business_memberships')
            .update({ 
              status: 'active',
              membership_type: plan.name.toLowerCase(),
              membership_details: {
                plan: plan.name.toLowerCase(),
                features: plan.features,
                price: plan.price
              }
            })
            .eq('id', membership.id);

          if (error) throw error;
          toast.success("Membership reactivated with new plan");
        }
      } else {
        const { error } = await supabase
          .from('business_memberships')
          .insert([
            { 
              business_id: businessId, 
              user_id: user.id,
              membership_type: plan.name.toLowerCase(),
              status: 'active',
              membership_details: {
                plan: plan.name.toLowerCase(),
                features: plan.features,
                price: plan.price
              }
            }
          ]);

        if (error) throw error;
        toast.success("Joined membership successfully");
      }
      
      setShowPlans(false);
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
    <>
      <Button 
        onClick={() => isActive ? handleMembership(null) : setShowPlans(true)}
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

      <Dialog open={showPlans} onOpenChange={setShowPlans}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogTitle>Choose a Membership Plan</DialogTitle>
          <MembershipPlansCard
            plans={business?.membership_plans || []}
            onSelectPlan={handleMembership}
            selectedPlan={membership?.membership_details?.plan}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};