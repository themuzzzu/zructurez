
import { PricingPlans } from "../pricing/PricingPlans";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Shield, BadgeDollarSign, Lock, CheckCircle, Eye, BarChart3, Zap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

  const planFeatures = {
    basic: {
      products: 5, 
      services: 1,
      visibility: "Local",
      analytics: "Basic Views",
    },
    pro: {
      products: 30, 
      services: 4,
      visibility: "Town-wide",
      analytics: "Views & Clicks",
    },
    "pro-plus": {
      products: 50, 
      services: 7,
      visibility: "City-wide",
      analytics: "Advanced Insights",
    },
    master: {
      products: 100, 
      services: 15,
      visibility: "Multi-city",
      analytics: "Full Analytics",
    }
  };

  const selectedPlanFeatures = selectedPlan ? planFeatures[selectedPlan as keyof typeof planFeatures] : null;

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

      {selectedPlanFeatures && (
        <Alert className="bg-primary/5 border-primary/20">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <AlertTitle>Plan Selected</AlertTitle>
                <AlertDescription>
                  You've selected a plan that includes:
                </AlertDescription>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div className="flex flex-col items-center p-3 bg-background rounded-lg border">
                <BadgeDollarSign className="h-5 w-5 text-primary mb-1" />
                <div className="text-lg font-semibold">{selectedPlanFeatures.products}</div>
                <div className="text-xs text-muted-foreground">Products</div>
              </div>
              
              <div className="flex flex-col items-center p-3 bg-background rounded-lg border">
                <Zap className="h-5 w-5 text-primary mb-1" />
                <div className="text-lg font-semibold">{selectedPlanFeatures.services}</div>
                <div className="text-xs text-muted-foreground">Services</div>
              </div>
              
              <div className="flex flex-col items-center p-3 bg-background rounded-lg border">
                <Eye className="h-5 w-5 text-primary mb-1" />
                <div className="text-lg font-semibold">{selectedPlanFeatures.visibility}</div>
                <div className="text-xs text-muted-foreground">Visibility</div>
              </div>
              
              <div className="flex flex-col items-center p-3 bg-background rounded-lg border">
                <BarChart3 className="h-5 w-5 text-primary mb-1" />
                <div className="text-lg font-semibold text-center text-sm">{selectedPlanFeatures.analytics}</div>
                <div className="text-xs text-muted-foreground">Analytics</div>
              </div>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
};
