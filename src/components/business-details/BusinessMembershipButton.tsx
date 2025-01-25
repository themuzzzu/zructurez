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

interface MembershipPlan {
  name: string;
  price: number;
  features: string[];
  description?: string;
}

interface MembershipDetails {
  plan: string;
  features: string[];
  price: number;
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

  const handleMembership = async (plan: MembershipPlan | null) => {
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
              membership_type: plan!.name.toLowerCase(),
              membership_details: {
                plan: plan!.name.toLowerCase(),
                features: plan!.features,
                price: plan!.price
              } as MembershipDetails
            })
            .eq('id', membership.id);

          if (error) throw error;
          toast.success("Membership reactivated with new plan");
        }
      } else if (plan) {
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
              } as MembershipDetails
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
  const membershipPlans = Array.isArray(business?.membership_plans) 
    ? (business.membership_plans as any[]).map(plan => ({
        name: String(plan.name || ''),
        price: Number(plan.price || 0),
        features: Array.isArray(plan.features) ? plan.features.map(String) : [],
        description: String(plan.description || '')
      }))
    : [];

  const membershipDetails = membership?.membership_details as MembershipDetails | undefined;

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
            plans={membershipPlans}
            onSelectPlan={handleMembership}
            selectedPlan={membershipDetails?.plan}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};