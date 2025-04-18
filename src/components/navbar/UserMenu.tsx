import React, { useState } from "react";
import { 
  User, 
  Settings, 
  LogOut, 
  Store, 
  Heart, 
  ShoppingBag,
  BadgeDollarSign,
  ChevronRight,
  Bell,
  LifeBuoy
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { UserPlanInfo } from "../pricing/UserPlanInfo";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch cart count
  const { data: cartCount = 0 } = useQuery({
    queryKey: ['cartCount'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return 0;

      const { count, error } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.session.user.id);

      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch wishlist count
  const { data: wishlistCount = 0 } = useQuery({
    queryKey: ['wishlistCount'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return 0;

      const { count, error } = await supabase
        .from('wishlists')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.session.user.id);

      if (error) throw error;
      return count || 0;
    },
  });

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
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden">
          <Avatar className="h-full w-full">
            <AvatarImage 
              src={user?.user_metadata?.avatar_url} 
              alt="User Avatar" 
              className="object-cover w-full h-full"
            />
            <AvatarFallback className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center">
              {user?.user_metadata?.name 
                ? getInitials(user.user_metadata.name) 
                : "U"}
            </AvatarFallback>
          </Avatar>
          {(wishlistCount > 0 || cartCount > 0) && (
            <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-card" align="end">
        <div className="p-2 bg-muted/50 rounded-t-md">
          <DropdownMenuLabel>
            <div className="font-normal text-muted-foreground text-xs">Signed in as</div>
            <div className="truncate font-medium text-sm">
              {user?.email || "Guest"}
            </div>
          </DropdownMenuLabel>
        </div>
        
        {/* Add current plan info */}
        <UserPlanInfo user={user} onUpgradeClick={() => navigateTo("/pricing")} />
        
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            onClick={() => navigateTo("/profile")}
            className="hover:bg-muted py-2 cursor-pointer"
          >
            <User className="mr-3 h-4 w-4" />
            <span>Profile</span>
            <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigateTo("/businesses/my-businesses")}
            className="hover:bg-muted py-2 cursor-pointer"
          >
            <Store className="mr-3 h-4 w-4" />
            <span>My Businesses</span>
            <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigateTo("/wishlist")}
            className="hover:bg-muted py-2 cursor-pointer"
          >
            <Heart className="mr-3 h-4 w-4" />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <Badge className="ml-auto px-1.5 rounded-full text-xs" variant="secondary">
                {wishlistCount}
              </Badge>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigateTo("/cart")}
            className="hover:bg-muted py-2 cursor-pointer"
          >
            <ShoppingBag className="mr-3 h-4 w-4" />
            <span>Cart</span>
            {cartCount > 0 && (
              <Badge className="ml-auto px-1.5 rounded-full text-xs" variant="secondary">
                {cartCount}
              </Badge>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigateTo("/notifications")}
            className="hover:bg-muted py-2 cursor-pointer"
          >
            <Bell className="mr-3 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigateTo("/pricing")}
            className="hover:bg-muted py-2 cursor-pointer"
          >
            <BadgeDollarSign className="mr-3 h-4 w-4" />
            <span>Pricing Plans</span>
            <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => navigateTo("/settings")}
          className="hover:bg-muted py-2 cursor-pointer"
        >
          <Settings className="mr-3 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigateTo("/support")}
          className="hover:bg-muted py-2 cursor-pointer"
        >
          <LifeBuoy className="mr-3 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 py-2 cursor-pointer"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
