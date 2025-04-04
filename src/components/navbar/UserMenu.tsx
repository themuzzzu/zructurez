
import React, { useState } from "react";
import { 
  User, 
  Settings, 
  LogOut, 
  Store, 
  Heart, 
  ShoppingCart,
  BadgeDollarSign,
  ChevronRight
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
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {user?.user_metadata?.name 
                ? getInitials(user.user_metadata.name) 
                : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel>
          <div className="font-normal text-muted-foreground">Signed in as</div>
          <div className="truncate font-medium">
            {user?.email || "Guest"}
          </div>
        </DropdownMenuLabel>
        
        {/* Add current plan info */}
        <UserPlanInfo user={user} onUpgradeClick={() => navigateTo("/pricing")} />
        
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigateTo("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigateTo("/businesses/my-businesses")}>
            <Store className="mr-2 h-4 w-4" />
            <span>My Businesses</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigateTo("/wishlist")}>
            <Heart className="mr-2 h-4 w-4" />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <Badge className="ml-auto px-1 text-xs" variant="secondary">{wishlistCount}</Badge>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigateTo("/cart")}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Cart</span>
            {cartCount > 0 && (
              <Badge className="ml-auto px-1 text-xs" variant="secondary">{cartCount}</Badge>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigateTo("/pricing")}>
            <BadgeDollarSign className="mr-2 h-4 w-4" />
            <span>Pricing Plans</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigateTo("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
