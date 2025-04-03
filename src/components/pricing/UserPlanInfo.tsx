
import React from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserPlanInfoProps {
  user: User | null;
  onUpgradeClick: () => void;
}

export const UserPlanInfo = ({ user, onUpgradeClick }: UserPlanInfoProps) => {
  // Check if user has a paid plan (dummy implementation)
  const isPaidUser = user?.app_metadata?.plan === "premium" || user?.app_metadata?.plan === "business";
  const planName = user?.app_metadata?.plan || "Free";
  
  return (
    <div className="px-2 py-1.5 text-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-muted-foreground">Current Plan:</span>
        <Badge variant={isPaidUser ? "success" : "secondary"}>
          {planName}
        </Badge>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-1 text-xs h-7"
        onClick={onUpgradeClick}
      >
        {isPaidUser ? "Manage Plan" : "Upgrade Plan"}
      </Button>
    </div>
  );
};
