
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { Badge } from "@/components/ui/badge";
import { BadgeDollarSign, ChevronRight, ArrowUpRight, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { UserSubscription } from "@/types/subscription";

export const PricingSection = () => {
  const [showAllPlans, setShowAllPlans] = useState(false);
  const navigate = useNavigate();
  
  const { data: currentPlan, isLoading } = useQuery({
    queryKey: ['user-plan'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      // Assuming the user_subscriptions table exists in your database
      try {
        const { data, error } = await supabase
          .from('pricing_plans')
          .select('*')
          .eq('id', 'pro') // This is a workaround, using a direct query to a plans table
          .maybeSingle();
        
        if (error) throw error;
        
        // Map database fields to our UserSubscription interface
        const subscriptionData: UserSubscription = {
          id: "sub_1",
          user_id: user.id,
          plan_id: data?.id || "basic",
          plan_name: data?.name || "Basic Plan",
          status: "active",
          created_at: new Date().toISOString(),
          amount: data?.price || 0,
          billing_interval: "monthly",
          next_payment_date: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
          // Use max_listings from database or fallback to defaults
          product_limit: data?.max_listings || 5,
          service_limit: data?.message_quota || 1,
          visibility_level: data?.support_level || "Local",
          analytics_level: data?.analytics_level || "Basic"
        };
        
        return subscriptionData;
      } catch (error) {
        console.error("Error fetching subscription:", error);
        return null;
      }
    }
  });

  const handleSelectPlan = (planId: string) => {
    // This would be connected to a payment processing system
    toast.success(`Plan ${planId} selected! Payment flow would start here.`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-background">
        <CardTitle>
          <div className="flex items-center">
            <BadgeDollarSign className="mr-2 h-5 w-5 text-primary" />
            <span>Pricing & Plans</span>
          </div>
        </CardTitle>
        {currentPlan && (
          <Badge variant="outline" className="ml-2 bg-background/80">
            {currentPlan.plan_name || "Basic Plan"}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pt-6">
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

                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowAllPlans(!showAllPlans)}>
                    {showAllPlans ? "Hide Plans" : "View Plans"}
                  </Button>
                  <Button className="flex-1" onClick={() => navigate("/settings/pricing")}>
                    Manage <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 mb-6">
                <div className="bg-gradient-to-r from-primary/5 to-background rounded-lg p-6 mb-6">
                  <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">No active subscription</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select a plan below to enhance your business presence and unlock premium features
                  </p>
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => setShowAllPlans(true)}
                  >
                    View Plans <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {showAllPlans ? (
              <>
                <PricingPlans 
                  onSelectPlan={handleSelectPlan} 
                  selectedPlan={currentPlan?.plan_id}
                  variant="minimal"
                />
                <div className="text-center mt-6">
                  <Button variant="outline" onClick={() => setShowAllPlans(false)}>
                    Show Less
                  </Button>
                </div>
              </>
            ) : (
              !currentPlan && (
                <div className="flex gap-4">
                  <div className="border rounded-lg p-4 flex-1">
                    <div className="flex justify-between mb-2">
                      <div className="text-lg font-semibold">Pro Plan</div>
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold mb-2">₹299<span className="text-sm font-normal">/mo</span></div>
                    <div className="text-muted-foreground text-sm mb-4">30 products, 4 services</div>
                    <Button variant="default" size="sm" className="w-full" onClick={() => setShowAllPlans(true)}>
                      View Details
                    </Button>
                  </div>
                  <div className="border-2 border-primary rounded-lg p-4 flex-1 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 bg-primary text-primary-foreground text-xs font-bold py-1 px-4 rotate-45 transform origin-bottom-right">
                      Popular
                    </div>
                    <div className="flex justify-between mb-2">
                      <div className="text-lg font-semibold">Pro+ Plan</div>
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold mb-2">₹599<span className="text-sm font-normal">/mo</span></div>
                    <div className="text-muted-foreground text-sm mb-4">50 products, 7 services</div>
                    <Button variant="default" size="sm" className="w-full" onClick={() => setShowAllPlans(true)}>
                      View Details
                    </Button>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
