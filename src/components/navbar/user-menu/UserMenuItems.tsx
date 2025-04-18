
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
    <DropdownMenuGroup className="space-y-0.5">
      <DropdownMenuItem 
        onClick={() => onNavigate("/profile")}
        className="flex items-center py-2.5 px-3 cursor-pointer rounded-md transition-colors hover:bg-muted focus:bg-muted"
      >
        <User className="mr-3 h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Profile</span>
        <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => onNavigate("/businesses/my-businesses")}
        className="flex items-center py-2.5 px-3 cursor-pointer rounded-md transition-colors hover:bg-muted focus:bg-muted"
      >
        <Store className="mr-3 h-4 w-4 text-muted-foreground" />
        <span className="font-medium">My Businesses</span>
        <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => onNavigate("/wishlist")}
        className="flex items-center py-2.5 px-3 cursor-pointer rounded-md transition-colors hover:bg-muted focus:bg-muted"
      >
        <Heart className="mr-3 h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Wishlist</span>
        {wishlistCount > 0 && (
          <Badge className="ml-auto px-2 py-0.5 rounded-full" variant="secondary">
            {wishlistCount}
          </Badge>
        )}
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => onNavigate("/cart")}
        className="flex items-center py-2.5 px-3 cursor-pointer rounded-md transition-colors hover:bg-muted focus:bg-muted"
      >
        <ShoppingBag className="mr-3 h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Cart</span>
        {cartCount > 0 && (
          <Badge className="ml-auto px-2 py-0.5 rounded-full" variant="secondary">
            {cartCount}
          </Badge>
        )}
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => onNavigate("/notifications")}
        className="flex items-center py-2.5 px-3 cursor-pointer rounded-md transition-colors hover:bg-muted focus:bg-muted"
      >
        <Bell className="mr-3 h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Notifications</span>
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => onNavigate("/pricing")}
        className="flex items-center py-2.5 px-3 cursor-pointer rounded-md transition-colors hover:bg-muted focus:bg-muted"
      >
        <BadgeDollarSign className="mr-3 h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Pricing Plans</span>
        <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
};
