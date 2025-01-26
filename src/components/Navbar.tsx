import { Bell, Search, Menu, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Cart } from "./cart/Cart";
import { NotificationList } from "./notifications/NotificationList";
import { SearchBox } from "./search/SearchBox";
import { useQuery } from "@tanstack/react-query";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: cartItemCount = 0 } = useQuery({
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

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return 0;

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.session.user.id)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    },
  });

  const handleProfileAction = async (action: string) => {
    if (action === "Sign out") {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
      } else {
        navigate("/auth");
      }
    } else if (action === "Profile") {
      navigate("/profile");
    } else if (action === "Settings") {
      navigate("/settings");
    } else {
      toast.info(`${action} clicked - Feature coming soon!`);
    }
  };

  return (
    <nav className="border-b bg-background py-3 fixed top-0 w-full z-50">
      <div className="container max-w-[1400px] flex items-center justify-between animate-fade-down">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar className="w-full" />
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold text-primary">
            {profile?.name || 'Welcome'}
          </h1>
        </div>

        {isHomePage && (
          <SearchBox className="flex-1 max-w-xl mx-4 hidden md:block" />
        )}

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative transition-transform duration-300 hover:scale-110">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-sm animate-fade-in">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </div>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <NotificationList />
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <div className="relative">
                <Button variant="ghost" size="icon" className="transition-transform duration-300 hover:scale-110">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-sm animate-fade-in">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Shopping Cart</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <Cart />
              </div>
            </SheetContent>
          </Sheet>

          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex gap-2 transition-all duration-300 hover:bg-accent/80">
                <img 
                  src={profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                  alt="avatar" 
                  className="h-6 w-6 rounded-full transition-transform duration-300 hover:scale-110" 
                />
                <span className="text-sm hidden sm:inline">{profile?.username || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileAction("Profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProfileAction("Settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleProfileAction("Help")}>
                Help
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleProfileAction("Sign out")}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};