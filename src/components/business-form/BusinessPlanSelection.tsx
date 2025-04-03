
import { PricingPlans } from "../pricing/PricingPlans";
import { useState } from "react";
import { toast } from "sonner";

interface BusinessPlanSelectionProps {
  onSelectPlan: (planId: string) => void;
  selectedPlan?: string;
}

export const BusinessPlanSelection = ({ 
  onSelectPlan, 
  selectedPlan 
}: BusinessPlanSelectionProps) => {
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = (planId: string) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSelectPlan(planId);
      setLoading(false);
      toast.success(`Plan ${planId} selected successfully`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Choose a Plan for Your Business</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the best plan for your business needs. You can always upgrade later.
        </p>
      </div>

      <PricingPlans 
        onSelectPlan={loading ? undefined : handleSelectPlan}
        selectedPlan={selectedPlan}
        showCTA={!loading}
      />

      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
};
