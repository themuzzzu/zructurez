
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
import { useTheme } from "./ThemeProvider";
import { Heart, MapPin, Map } from "lucide-react";
import { useLocation } from "@/providers/LocationProvider";
import { useGeolocation } from "@/hooks/useGeolocation";

export const Navbar = () => {
  const routerLocation = useRouterLocation();
  const navigate = useNavigate();
  const isHomePage = routerLocation.pathname === "/";
  const { theme } = useTheme();
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

  return (
    <>
      <nav className="border-b bg-background py-2 fixed top-0 left-0 right-0 w-full z-50 h-16">
        <div className="container max-w-[1400px] flex items-center justify-between px-2 sm:px-4 mx-auto">
          <div className="flex items-center gap-2">
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
            <h1 className="text-xl font-bold text-primary truncate">
              Zructures
            </h1>
          </div>

          <div className="flex items-center gap-1">
            {/* Home page specific buttons (location and maps) - visible on mobile */}
            {isHomePage && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="relative group flex items-center gap-1 px-1 py-1 h-9 sm:hidden"
                  aria-label="Select location"
                  onClick={() => setShowLocationPicker(true)}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate("/maps")}
                  aria-label="View map"
                  className="sm:hidden"
                >
                  <Map className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {/* Non-home page specific buttons (wishlist) - visible on mobile */}
            {!isHomePage && isBusinessOrServices() && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/wishlist")}
                aria-label="View wishlist"
                className="hidden xs:flex"
              >
                <Heart className="h-4 w-4" />
              </Button>
            )}

            {/* Location selector button - only visible on desktop */}
            <Button 
              variant="ghost" 
              size="sm"
              className="relative group items-center gap-1.5 px-2 py-1 h-9 hidden sm:flex"
              aria-label="Select location"
              onClick={() => setShowLocationPicker(true)}
            >
              <MapPin className="h-4 w-4" />
              <span className="max-w-24 truncate text-sm hidden md:inline">
                {currentLocation === "All India" ? "Select location" : currentLocation}
              </span>
            </Button>

            {/* Map button - only visible on desktop */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/maps")}
              aria-label="View map"
              className={`hidden sm:flex ${routerLocation.pathname === "/maps" ? "bg-accent" : ""}`}
            >
              <Map className="h-4 w-4" />
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
