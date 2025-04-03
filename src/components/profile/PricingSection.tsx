
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { Badge } from "@/components/ui/badge";
import { BadgeDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const PricingSection = () => {
  const [showAllPlans, setShowAllPlans] = useState(false);
  
  const { data: currentPlan, isLoading } = useQuery({
    queryKey: ['user-plan'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      return data;
    }
  });

  const handleSelectPlan = (planId: string) => {
    // This would be connected to a payment processing system
    toast.success(`Plan ${planId} selected! Payment flow would start here.`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <div className="flex items-center">
            <BadgeDollarSign className="mr-2 h-5 w-5 text-primary" />
            <span>Pricing & Plans</span>
          </div>
        </CardTitle>
        {currentPlan && (
          <Badge variant="outline" className="ml-2">
            {currentPlan.plan_name || "Basic Plan"}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {currentPlan ? (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{currentPlan.plan_name || "Basic Plan"}</h3>
                    <p className="text-sm text-muted-foreground">
                      Renewal on {new Date(currentPlan.next_payment_date || Date.now() + 30*24*60*60*1000).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {currentPlan.status || "Active"}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Products</div>
                    <div className="text-lg font-semibold">{currentPlan.product_limit || "5"}/{currentPlan.product_limit || "5"}</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Services</div>
                    <div className="text-lg font-semibold">{currentPlan.service_limit || "1"}/{currentPlan.service_limit || "1"}</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Visibility</div>
                    <div className="text-lg font-semibold">{currentPlan.visibility_level || "Local"}</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Analytics</div>
                    <div className="text-lg font-semibold">{currentPlan.analytics_level || "Basic"}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 mb-6">
                <h3 className="text-lg font-semibold mb-2">No active subscription</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a plan below to enhance your business presence
                </p>
              </div>
            )}

            {showAllPlans ? (
              <>
                <PricingPlans 
                  onSelectPlan={handleSelectPlan} 
                  selectedPlan={currentPlan?.plan_id}
                  compact={true}
                />
                <div className="text-center mt-4">
                  <Button variant="outline" onClick={() => setShowAllPlans(false)}>
                    Show Less
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <Button onClick={() => setShowAllPlans(true)}>
                  View All Plans
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
