
import { Home, Store, Wrench, Building, MessageSquare, MoreVertical, SunMoon, Users, Briefcase, Calendar, Map } from "lucide-react";
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

// Create a filled icon component for mobile nav
const FilledIcon = ({ Icon }: { Icon: React.ElementType }) => (
  <div className="relative">
    <Icon className="h-5 w-5" fill="currentColor" stroke="black" strokeWidth={1.5} />
  </div>
);

export const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDarkMode = theme === "dark";

  // Main navigation items - match what's in Sidebar.tsx
  const mobileNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Store, label: "Marketplace", path: "/marketplace" },
    { icon: Wrench, label: "Services", path: "/services" },
    { icon: Building, label: "Business", path: "/businesses" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
  ];

  // Additional items for the dropdown menu
  const dropdownItems = [
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
    { icon: Users, label: "Communities", path: "/communities" },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: Map, label: "Maps", path: "/maps" },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  if (!isMobile) {
    return null; // Don't render on non-mobile devices
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-3 px-1 sm:px-2 z-50 animate-slide-up backdrop-blur-sm">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="icon"
              className={cn(
                "flex flex-col items-center justify-center h-14 w-14 p-0 gap-1",
                isActive ? "bg-accent" : ""
              )}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
            >
              {isActive ? (
                <FilledIcon Icon={Icon} />
              ) : (
                <Icon className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="text-xs font-medium">
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
              className="flex flex-col items-center justify-center h-14 w-14 p-0 gap-1"
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-medium">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {dropdownItems.map((item) => (
              <DropdownMenuItem 
                key={item.path}
                onClick={() => navigate(item.path)}
                className="cursor-pointer"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
              <SunMoon className="mr-2 h-4 w-4" />
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
