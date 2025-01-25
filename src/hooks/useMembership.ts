import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { MembershipPlan, MembershipDetails } from "@/types/membership";
import { membershipDetailsToJson, jsonToMembershipDetails } from "@/types/membership";

export const useMembership = (businessId: string) => {
  const [loading, setLoading] = useState(false);

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

      const membershipDetails = plan ? {
        plan: plan.name.toLowerCase(),
        features: plan.features,
        price: plan.price
      } : null;

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
              membership_details: membershipDetails ? membershipDetailsToJson(membershipDetails) : null
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
              membership_details: membershipDetailsToJson(membershipDetails!)
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

  const membershipPlans = Array.isArray(business?.membership_plans) 
    ? (business.membership_plans as any[]).map(plan => ({
        name: String(plan.name || ''),
        price: Number(plan.price || 0),
        features: Array.isArray(plan.features) ? plan.features.map(String) : [],
        description: String(plan.description || '')
      }))
    : [];

  const membershipDetails = membership?.membership_details 
    ? jsonToMembershipDetails(membership.membership_details)
    : undefined;
    
  const isActive = membership?.status === 'active';

  return {
    loading,
    isActive,
    membership,
    membershipPlans,
    membershipDetails,
    handleMembership
  };
};