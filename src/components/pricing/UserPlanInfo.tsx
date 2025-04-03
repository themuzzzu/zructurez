
import React from "react";
import { User } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserSubscription } from "@/types/subscription";

interface UserPlanInfoProps {
  user: User | null;
  subscription?: UserSubscription | null;
  onUpgradeClick: () => void;
}

export const UserPlanInfo: React.FC<UserPlanInfoProps> = ({ 
  user, 
  subscription, 
  onUpgradeClick 
}) => {
  if (!user) return null;
  
  return (
    <div className="px-2 py-1 space-y-1">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs font-normal">
          {subscription?.plan_name || "Basic Plan"}
        </Badge>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 text-xs px-2 hover:bg-primary/10"
          onClick={onUpgradeClick}
        >
          Upgrade
        </Button>
      </div>
    </div>
  );
};
