
import React from "react";
import { User } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";

interface UserPlanInfoProps {
  user: User | null;
  onUpgradeClick: () => void;
}

export const UserPlanInfo: React.FC<UserPlanInfoProps> = ({ user, onUpgradeClick }) => {
  if (!user) return null;
  
  return (
    <div className="px-2 py-1 space-y-1">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs font-normal">
          Basic Plan
        </Badge>
      </div>
    </div>
  );
};
