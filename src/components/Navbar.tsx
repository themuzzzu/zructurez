
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/theme/ModeToggle";
import { UserMenu } from "@/components/navbar/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { SearchBar } from "@/components/SearchBar";
import { MobileMenu } from "@/components/navbar/MobileMenu";
import { NotificationsPopover } from "@/components/notifications/NotificationsPopover";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageCircle, ShoppingCart } from "lucide-react";
import Logo from "@/components/Logo";
import { AppNavigation } from "@/components/navbar/AppNavigation";

type Profile = {
  avatar_url: string;
  bio: string;
  created_at: string;
  id: string;
  location: string;
  name: string;
  updated_at: string;
  username: string;
};

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Check if we're on the login, signup, or forgot-password routes
  const isAuthRoute = ["/login", "/signup", "/forgot-password", "/reset-password"].includes(
    location.pathname
  );

  // Don't show navbar on auth pages
  if (isAuthRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="hidden font-bold sm:inline-block">Zructs</span>
          </Link>
          <AppNavigation />
        </div>
        <MobileMenu />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <SearchBar />
          
          {/* Only show these icons if user is logged in */}
          {user && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate("/notifications")}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center"
                  >
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate("/messages")}
                aria-label="Messages"
              >
                <MessageCircle className="h-5 w-5" />
                {unreadMessages > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center"
                  >
                    {unreadMessages > 9 ? "9+" : unreadMessages}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate("/cart")}
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center"
                  >
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </Badge>
                )}
              </Button>
            </>
          )}
          
          <NotificationsPopover />
          <ModeToggle />
          
          {user ? (
            <UserMenu />
          ) : (
            <Button variant="default" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
