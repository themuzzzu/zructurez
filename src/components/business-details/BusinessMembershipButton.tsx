import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MembershipPlansCard } from "./profile/MembershipPlansCard";
import { useMembership } from "@/hooks/useMembership";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BusinessMembershipButtonProps {
  businessId: string;
}

export const BusinessMembershipButton = ({ businessId }: BusinessMembershipButtonProps) => {
  const [showPlans, setShowPlans] = useState(false);
  const { 
    loading, 
    isActive, 
    membershipPlans, 
    membershipDetails, 
    handleMembership 
  } = useMembership(businessId);

  const { data: subscriberCount } = useQuery({
    queryKey: ['business-subscribers', businessId],
    queryFn: async () => {
      const { count } = await supabase
        .from('business_subscriptions')
        .select('*', { count: 'exact' })
        .eq('business_id', businessId);
      return count || 0;
    }
  });

  const handleClick = () => {
    if (!isActive && subscriberCount && subscriberCount < 20) {
      toast.error("This business needs at least 20 subscribers before joining membership");
      return;
    }
    
    if (isActive) {
      handleMembership(null);
    } else {
      setShowPlans(true);
    }
  };

  return (
    <>
      <Button 
        onClick={handleClick}
        variant={isActive ? "outline" : "default"}
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white"
      >
        {loading ? "Loading..." : (
          isActive ? "Cancel Membership" : "Join Membership"
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