
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { CartButton } from "./navbar/CartButton";
import { UserMenu } from "./navbar/UserMenu";
import { MobileNav } from "./navbar/MobileNav";
import { SearchBox } from "./search/SearchBox";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "./ThemeProvider";
import { Heart, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LocationSelector } from "./LocationSelector";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const { theme } = useTheme();
  const [currentLocation, setCurrentLocation] = useState(localStorage.getItem('userLocation') || "All India");

  // Listen for location updates
  useEffect(() => {
    const handleLocationUpdated = (event: CustomEvent) => {
      if (event.detail.location) {
        setCurrentLocation(event.detail.location);
      }
    };

    window.addEventListener('locationUpdated', handleLocationUpdated as EventListener);
    
    return () => {
      window.removeEventListener('locationUpdated', handleLocationUpdated as EventListener);
    };
  }, []);

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

  const isBusinessOrServices = () => {
    return location.pathname.includes('/business') || 
           location.pathname.includes('/services') ||
           location.pathname.includes('/marketplace');
  };

  const handleLocationChange = (newLocation: string) => {
    setCurrentLocation(newLocation);
    localStorage.setItem('userLocation', newLocation);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('locationUpdated', { 
      detail: { location: newLocation } 
    }));

    // Toast notification
    window.setTimeout(() => {
      import('sonner').then(({ toast }) => {
        toast.success(`Location updated to ${newLocation}`);
      });
    }, 100);
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
            {/* Location selector button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative group"
                  aria-label="Select location"
                >
                  <MapPin className="h-5 w-5" />
                  <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-green-500 rounded-full hidden group-hover:block" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Your Location</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentLocation || "Select location"}
                    </p>
                  </div>
                  <LocationSelector
                    value={currentLocation}
                    onChange={handleLocationChange}
                    className="w-full"
                  />
                  <div className="flex justify-between pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate("/settings?tab=location")}
                    >
                      More Settings
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        if (document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }
                      }}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {isBusinessOrServices() && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/wishlist")}
                aria-label="View wishlist"
              >
                <Heart className="h-5 w-5" />
              </Button>
            )}
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
