
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { Badge } from "@/components/ui/badge";
import { BadgeDollarSign, History } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const PricingTab = () => {
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

  const { data: paymentHistory } = useQuery({
    queryKey: ['payment-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data } = await supabase
        .from('payment_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      return data || [];
    }
  });

  const handleSelectPlan = (planId: string) => {
    // This would be connected to a payment processing system
    toast.success(`Plan ${planId} selected! Payment flow would start here.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Pricing & Plans</h2>
        <p className="text-muted-foreground">
          Manage your subscription and payment details
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {currentPlan && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Current Plan</CardTitle>
                  <Badge>{currentPlan.status || "Active"}</Badge>
                </div>
                <CardDescription>Your subscription details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{currentPlan.plan_name || "Basic Plan"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentPlan.billing_interval || "Monthly"} billing
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{currentPlan.amount || "100"}</div>
                      <p className="text-sm text-muted-foreground">
                        Next payment on {new Date(currentPlan.next_payment_date || Date.now() + 30*24*60*60*1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              </CardContent>
            </Card>
          )}

          <h3 className="text-xl font-semibold mt-8 mb-4">Available Plans</h3>
          <PricingPlans 
            onSelectPlan={handleSelectPlan} 
            selectedPlan={currentPlan?.plan_id}
          />

          {paymentHistory && paymentHistory.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <div className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  <CardTitle>Payment History</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <div className="font-medium">{payment.description || `Payment for ${payment.plan_name || "Basic Plan"}`}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(payment.created_at).toLocaleDateString()} · 
                          {payment.payment_method || "Card ending in 4242"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{payment.amount}</div>
                        <Badge variant="outline" className="text-xs">
                          {payment.status || "Completed"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
