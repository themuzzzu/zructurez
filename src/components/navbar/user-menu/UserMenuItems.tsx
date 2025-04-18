
import { 
  User, Store, Heart, ShoppingBag, Bell, 
  BadgeDollarSign, ChevronRight 
} from "lucide-react";
import { DropdownMenuItem, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface UserMenuItemsProps {
  onNavigate: (path: string) => void;
  cartCount: number;
  wishlistCount: number;
}

export const UserMenuItems = ({ onNavigate, cartCount, wishlistCount }: UserMenuItemsProps) => {
  return (
    <DropdownMenuGroup>
      <DropdownMenuItem 
        onClick={() => onNavigate("/profile")}
        className="hover:bg-muted py-2 cursor-pointer"
      >
        <User className="mr-3 h-4 w-4" />
        <span>Profile</span>
        <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => onNavigate("/businesses/my-businesses")}
        className="hover:bg-muted py-2 cursor-pointer"
      >
        <Store className="mr-3 h-4 w-4" />
        <span>My Businesses</span>
        <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => onNavigate("/wishlist")}
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
        onClick={() => onNavigate("/cart")}
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
        onClick={() => onNavigate("/notifications")}
        className="hover:bg-muted py-2 cursor-pointer"
      >
        <Bell className="mr-3 h-4 w-4" />
        <span>Notifications</span>
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => onNavigate("/pricing")}
        className="hover:bg-muted py-2 cursor-pointer"
      >
        <BadgeDollarSign className="mr-3 h-4 w-4" />
        <span>Pricing Plans</span>
        <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
};
