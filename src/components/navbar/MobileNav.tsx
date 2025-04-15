
import { Home, ShoppingBag, Wrench, Building, MessageSquare, MoreVertical, SunMoon, Users, Briefcase, Calendar, Map, Heart, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "../ThemeProvider";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLocation as useLocationContext } from "@/providers/LocationProvider";

// Create a simplified icon component for mobile nav without dots/circles
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
  const { setShowLocationPicker } = useLocationContext();

  // Main navigation items for bottom bar according to the new layout
  const mainNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
    { icon: Wrench, label: "Services", path: "/services" },
    { icon: Building, label: "Business", path: "/businesses" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
  ];

  // Additional items for the dropdown menu
  const dropdownItems = [
    { icon: Heart, label: "Wishlist", path: "/wishlist" },
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
    { icon: Users, label: "Communities", path: "/communities" },
    { icon: Calendar, label: "Events", path: "/events" },
  ];

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
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-2 px-1 z-50 animate-fade-in">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = checkActivePath(item.path);
          
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
        })}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            {dropdownItems.map((item) => (
              <DropdownMenuItem 
                key={item.path}
                onClick={() => navigate(item.path)}
                className="cursor-pointer text-zinc-800 dark:text-zinc-200"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer text-zinc-800 dark:text-zinc-200">
              <SunMoon className="mr-2 h-4 w-4" />
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
