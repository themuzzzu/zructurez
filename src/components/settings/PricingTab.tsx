import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { Badge } from "@/components/ui/badge";
import { BadgeDollarSign, History, ChevronRight, BarChart3, Rocket, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUserSubscription } from "@/hooks/useUserSubscription";

const mockPaymentHistory = [
  {
    id: "payment-1",
    user_id: "user-123",
    description: "Monthly subscription - Basic Plan",
    amount: 99,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    payment_method: "Card ending in 4242",
    status: "Completed"
  },
  {
    id: "payment-2",
    user_id: "user-123",
    description: "Monthly subscription - Basic Plan",
    amount: 99,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    payment_method: "Card ending in 4242",
    status: "Completed"
  }
];

export const PricingTab = () => {
  const [showAllPlans, setShowAllPlans] = useState(false);
  
  const { data: currentPlan, isLoading } = useUserSubscription();

  const handleSelectPlan = (planId: string) => {
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
            <Card className="overflow-hidden border-primary/20">
              <div className="bg-gradient-to-r from-primary/10 to-background p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <BadgeDollarSign className="mr-2 h-5 w-5 text-primary" />
                      Current Plan
                    </CardTitle>
                    <CardDescription>Your active subscription</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-sm bg-background/80">
                    {currentPlan.status || "Active"}
                  </Badge>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{currentPlan.planName || "Basic Plan"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentPlan.billingInterval || "Monthly"} billing
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{currentPlan.amount || "100"}</div>
                      <p className="text-sm text-muted-foreground">
                        Next payment on {new Date(currentPlan.nextPaymentDate || Date.now() + 30*24*60*60*1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Products</div>
                      <div className="text-lg font-semibold flex items-center">
                        <BarChart3 className="h-4 w-4 mr-1 text-primary" />
                        {currentPlan.productLimit || "5"}/{currentPlan.productLimit || "5"}
                      </div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Services</div>
                      <div className="text-lg font-semibold flex items-center">
                        <Zap className="h-4 w-4 mr-1 text-primary" />
                        {currentPlan.serviceLimit || "1"}/{currentPlan.serviceLimit || "1"}
                      </div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Visibility</div>
                      <div className="text-lg font-semibold flex items-center">
                        <Rocket className="h-4 w-4 mr-1 text-primary" />
                        {currentPlan.visibilityLevel || "Local"}
                      </div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Analytics</div>
                      <div className="text-lg font-semibold flex items-center">
                        <BarChart3 className="h-4 w-4 mr-1 text-primary" />
                        {currentPlan.analyticsLevel || "Basic"}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" onClick={() => setShowAllPlans(true)}>
                    Manage Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {(showAllPlans || !currentPlan) && (
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-6">
                {currentPlan ? "Change Plan" : "Select a Plan"}
              </h3>
              <PricingPlans 
                onSelectPlan={handleSelectPlan} 
                selectedPlan={currentPlan?.plan_id}
                variant="comparison"
              />
              {currentPlan && (
                <div className="text-center mt-6">
                  <Button variant="outline" onClick={() => setShowAllPlans(false)}>
                    Hide Plans
                  </Button>
                </div>
              )}
            </div>
          )}

          {paymentHistory && paymentHistory.length > 0 && (
            <Card className="mt-8">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <History className="h-5 w-5 mr-2" />
                    Payment History
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <CardDescription>Recent transactions and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                      <div>
                        <div className="font-medium">{payment.description || `Payment for Basic Plan`}</div>
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
