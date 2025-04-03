
import { PricingPlans } from "../pricing/PricingPlans";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Shield, BadgeDollarSign } from "lucide-react";

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
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold mb-3">Choose a Plan for Your Business</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the best plan for your business needs. You can always upgrade later.
        </p>
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-background p-6 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Shield className="h-12 w-12 text-primary" />
          <div>
            <h4 className="text-lg font-semibold mb-1">Why Choose a Paid Plan?</h4>
            <p className="text-muted-foreground mb-4">
              Upgrading to a paid plan increases your business visibility and unlocks powerful features to help you grow your customer base.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <BadgeDollarSign className="h-4 w-4 text-primary mr-2" />
                <span>More product & service listings</span>
              </div>
              <div className="flex items-center">
                <BadgeDollarSign className="h-4 w-4 text-primary mr-2" />
                <span>Improved search visibility</span>
              </div>
              <div className="flex items-center">
                <BadgeDollarSign className="h-4 w-4 text-primary mr-2" />
                <span>Advanced analytics & reports</span>
              </div>
            </div>
          </div>
        </div>
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
