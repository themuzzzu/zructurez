
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLocation as useRouterLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { CartButton } from "./navbar/CartButton";
import { UserMenu } from "./navbar/UserMenu";
import { MobileNav } from "./navbar/MobileNav";
import { SearchBox } from "./search/SearchBox";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "./ThemeProvider";
import { Heart, MapPin, Navigation, Locate, Map } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EnhancedLocationSelector } from "./location/EnhancedLocationSelector";
import { Badge } from "./ui/badge";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useLocation } from "@/providers/LocationProvider";
import { handleLocationUpdate, isZructuresAvailable } from "@/utils/locationUtils";

export const Navbar = () => {
  const routerLocation = useRouterLocation();
  const navigate = useNavigate();
  const isHomePage = routerLocation.pathname === "/";
  const { theme } = useTheme();
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const { loading } = useGeolocation();
  const { 
    currentLocation, 
    isLocationAvailable,
    setShowLocationPicker
  } = useLocation();

  const isBusinessOrServices = () => {
    return routerLocation.pathname.includes('/business') || 
           routerLocation.pathname.includes('/services') ||
           routerLocation.pathname.includes('/marketplace');
  };

  const handleLocationChange = (newLocation: string) => {
    handleLocationUpdate(newLocation);
    setLocationPopoverOpen(false);
  };

  return (
    <>
      <nav className="border-b bg-background py-3 fixed top-0 left-0 right-0 w-full z-50 h-16">
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
              Zructures
            </h1>
          </div>

          {isHomePage && (
            <SearchBox className="flex-1 max-w-xl mx-4 hidden md:block" />
          )}

          <div className="flex items-center gap-2">
            {/* Location selector button - only visible on desktop */}
            <Popover open={locationPopoverOpen} onOpenChange={setLocationPopoverOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="relative group flex items-center gap-1.5 px-2 py-1 h-9 hidden sm:flex"
                  aria-label="Select location"
                  onClick={() => setShowLocationPicker(true)}
                >
                  {loading ? (
                    <Locate className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  <span className="max-w-28 truncate text-sm">
                    {currentLocation === "All India" ? "Select location" : currentLocation}
                  </span>
                  <Badge 
                    variant={isLocationAvailable ? "success" : "warning"} 
                    className="h-2 w-2 rounded-full p-0"
                  />
                </Button>
              </PopoverTrigger>
            </Popover>

            {/* Wishlist button - only visible on non-homepage desktop in business/services/marketplace sections */}
            {isBusinessOrServices() && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/wishlist")}
                aria-label="View wishlist"
                className="hidden sm:flex"
              >
                <Heart className="h-5 w-5" />
              </Button>
            )}

            {/* Map button - only visible on desktop */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/maps")}
              aria-label="View map"
              className={`hidden sm:flex ${routerLocation.pathname === "/maps" ? "bg-accent" : ""}`}
            >
              <Map className="h-5 w-5" />
            </Button>

            <CartButton />
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <UserMenu />
          </div>
        </div>
      </nav>

      <MobileNav />
    </>
  );
};
