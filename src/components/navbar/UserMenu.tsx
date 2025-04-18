
import React, { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { UserPlanInfo } from "../pricing/UserPlanInfo";
import { supabase } from "@/integrations/supabase/client";
import { useMenuCounts } from "@/hooks/useMenuCounts";
import { UserMenuHeader } from "./user-menu/UserMenuHeader";
import { UserMenuItems } from "./user-menu/UserMenuItems";
import { UserMenuSettings } from "./user-menu/UserMenuSettings";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount, wishlistCount } = useMenuCounts(user?.id);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full p-0.5 transition-transform hover:scale-105 active:scale-95"
        >
          <Avatar className="h-full w-full ring-2 ring-primary/10">
            <AvatarImage 
              src={user?.user_metadata?.avatar_url} 
              alt="User Avatar" 
              className="object-cover w-full h-full"
            />
            <AvatarFallback className="bg-primary/5 text-primary w-full h-full flex items-center justify-center font-medium">
              {user?.user_metadata?.name 
                ? getInitials(user.user_metadata.name) 
                : "U"}
            </AvatarFallback>
          </Avatar>
          {(wishlistCount > 0 || cartCount > 0) && (
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full ring-2 ring-background" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 md:w-72 bg-card border-none shadow-2xl shadow-primary/5" 
        align="end"
      >
        <UserMenuHeader user={user} />
        <UserPlanInfo user={user} onUpgradeClick={() => navigateTo("/pricing")} />
        <DropdownMenuSeparator />
        <div className="p-1">
          <UserMenuItems 
            onNavigate={navigateTo}
            cartCount={cartCount}
            wishlistCount={wishlistCount}
          />
        </div>
        <DropdownMenuSeparator />
        <div className="p-1">
          <UserMenuSettings 
            onNavigate={navigateTo}
            onSignOut={handleSignOut}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
