
import { Home, ShoppingBag, Wrench, Building, MessageSquare, MoreVertical, SunMoon, 
  Users, Briefcase, Calendar, Map, Settings, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "../ThemeProvider";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";

// Create a simplified icon component for mobile nav
const FilledIcon = ({ Icon }: { Icon: React.ElementType }) => {
  return (
    <div className="relative">
      <Icon 
        className="h-5 w-5 text-primary" 
        fill="none" 
        strokeWidth={2.5}
      />
    </div>
  );
};

// Regular icon with no inner decorations
const RegularIcon = ({ Icon }: { Icon: React.ElementType }) => {
  return (
    <div className="relative">
      <Icon className="h-5 w-5" strokeWidth={1.5} />
    </div>
  );
};

export const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDarkMode = theme === "dark";
  const [drawerOpen, setDrawerOpen] = useState(false);

  // All navigation items
  const allNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
    { icon: Wrench, label: "Services", path: "/services" },
    { icon: Building, label: "Business", path: "/businesses" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: Users, label: "Communities", path: "/communities" },
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: Map, label: "Maps", path: "/maps" },
    { icon: Heart, label: "Wishlist", path: "/wishlist" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  // Main navigation items for bottom bar
  const mainNavItems = allNavItems.slice(0, 5);
  
  // Additional items for the drawer menu
  const drawerItems = allNavItems.slice(5);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  if (!isMobile) {
    return null; // Don't render on non-mobile devices
  }

  // Check if the current path starts with any of our main paths
  const checkActivePath = (itemPath: string) => {
    if (itemPath === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(itemPath);
  };
  
  const handleNavClick = (item: any) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
      setDrawerOpen(false);
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-2 px-1 z-50 animate-fade-in">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {mainNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = checkActivePath(item.path);
          
          if (index < 4) {
            // First 4 items
            return (
              <Button
                key={item.path || item.label}
                variant="ghost"
                size="icon"
                className={cn(
                  "flex flex-col items-center justify-center h-14 w-14 p-0 gap-1",
                  isActive ? "text-primary dark:text-primary" : "text-zinc-500 dark:text-zinc-500"
                )}
                onClick={() => handleNavClick(item)}
                aria-label={item.label}
              >
                {isActive ? (
                  <FilledIcon Icon={Icon} />
                ) : (
                  <RegularIcon Icon={Icon} />
                )}
                <span className={cn(
                  "text-[10px] font-medium",
                  isActive ? "text-primary dark:text-primary" : "text-zinc-500 dark:text-zinc-500"
                )}>
                  {item.label}
                </span>
              </Button>
            );
          } else {
            return null;
          }
        })}

        {/* Drawer for remaining menu items instead of dropdown */}
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="flex flex-col items-center justify-center h-14 w-14 p-0 gap-1 text-zinc-500 dark:text-zinc-500"
              aria-label="More options"
            >
              <div className="relative">
                <MoreVertical className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium">More</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Menu</DrawerTitle>
              <DrawerDescription>
                Access all features and settings
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 py-2 grid grid-cols-3 gap-4">
              {allNavItems.map((item) => {
                const isActive = checkActivePath(item.path);
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={cn(
                      "flex flex-col items-center justify-center py-4 h-auto",
                      isActive ? "bg-muted" : ""
                    )}
                    onClick={() => handleNavClick(item)}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 mb-2",
                      isActive ? "text-primary" : "text-foreground"
                    )} />
                    <span className="text-xs">{item.label}</span>
                  </Button>
                );
              })}
              
              <Button
                variant="ghost"
                className="flex flex-col items-center justify-center py-4 h-auto"
                onClick={toggleTheme}
              >
                <SunMoon className="h-5 w-5 mb-2" />
                <span className="text-xs">
                  {isDarkMode ? "Light" : "Dark"}
                </span>
              </Button>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
