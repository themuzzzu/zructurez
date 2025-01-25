import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MembershipPlansCard } from "./profile/MembershipPlansCard";
import { useMembership } from "@/hooks/useMembership";

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

  return (
    <>
      <Button 
        onClick={() => isActive ? handleMembership(null) : setShowPlans(true)}
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