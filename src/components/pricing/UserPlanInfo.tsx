
import React from "react";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, BadgeDollarSign, Crown } from "lucide-react";

interface UserPlanInfoProps {
  user: User | null;
  onUpgradeClick: () => void;
}

export const UserPlanInfo = ({ user, onUpgradeClick }: UserPlanInfoProps) => {
  const { data: currentPlan, isLoading } = useQuery({
    queryKey: ['user-plan'],
    queryFn: async () => {
      if (!user) return null;
      
      const { data } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      return data;
    },
    enabled: !!user,
  });

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="px-2 py-1.5 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-2 py-1.5 text-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <BadgeDollarSign className="h-4 w-4 mr-1.5 text-primary" />
          <span className="font-medium">Current Plan</span>
        </div>
        {currentPlan ? (
          <Badge variant="outline" className="text-xs font-normal">
            {currentPlan.plan_name || "Basic Plan"}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs font-normal">
            Free
          </Badge>
        )}
      </div>
      
      {currentPlan ? (
        <div className="text-xs text-muted-foreground mb-1.5">
          {currentPlan.product_limit || 5} products, {currentPlan.service_limit || 1} services
        </div>
      ) : (
        <div className="text-xs text-muted-foreground mb-1.5">
          Limited features available
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full text-xs h-7" 
        onClick={onUpgradeClick}
      >
        {currentPlan ? "Manage Plan" : "Upgrade Now"}
        {!currentPlan && <Crown className="ml-1 h-3 w-3" />}
      </Button>
    </div>
  );
};
