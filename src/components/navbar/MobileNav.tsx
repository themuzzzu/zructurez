
import { Home, ShoppingBag, Wrench, Building, MessageSquare, MoreVertical, SunMoon, Users, Briefcase, Calendar, Map } from "lucide-react";
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

// Create a filled icon component for mobile nav with appropriate theme-based highlights
const FilledIcon = ({ Icon, isDarkMode }: { Icon: React.ElementType, isDarkMode: boolean }) => {
  return (
    <div className="relative">
      <Icon 
        className="h-5 w-5" 
        fill="currentColor" 
        stroke="currentColor" 
        strokeWidth={1.5} 
      />
      {/* Theme-appropriate highlight */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full" 
        style={{ 
          backgroundColor: isDarkMode ? 'white' : 'black',
          opacity: 0.85
        }}
      ></div>
      
      {/* Inner lines - these will be the opposite color of the highlight */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full" 
        style={{ 
          backgroundColor: isDarkMode ? 'black' : 'white',
          opacity: 0.9
        }}
      ></div>
    </div>
  );
};

// Regular icon with no inner decorations
const RegularIcon = ({ Icon }: { Icon: React.ElementType }) => {
  return (
    <div className="relative">
      <Icon className="h-5 w-5" />
    </div>
  );
};

export const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDarkMode = theme === "dark";

  // Main navigation items - match what's in Sidebar.tsx
  const mobileNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ShoppingBag, label: "Zructs", path: "/marketplace" },
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
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-2 px-1 sm:px-2 z-50 animate-fade-in">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                          (item.path === "/businesses" && location.pathname.startsWith("/businesses/")) ||
                          (item.path === "/marketplace" && location.pathname.startsWith("/marketplace/")) ||
                          (item.path === "/services" && location.pathname.startsWith("/services/")) ||
                          (item.path === "/messages" && location.pathname.startsWith("/messages/"));
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="icon"
              className={cn(
                "flex flex-col items-center justify-center h-14 w-14 p-0 gap-1",
                isActive ? "text-primary dark:text-primary" : "text-zinc-500 dark:text-zinc-500"
              )}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
            >
              {isActive ? (
                <FilledIcon Icon={Icon} isDarkMode={isDarkMode} />
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
