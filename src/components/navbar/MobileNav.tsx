
import { Home, Store, Wrench, Building, MessageSquare, MoreVertical, SunMoon } from "lucide-react";
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

  const mobileNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Store, label: "Marketplace", path: "/marketplace" },
    { icon: Wrench, label: "Services", path: "/services" },
    { icon: Building, label: "Business", path: "/businesses" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
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
                "flex items-center justify-center h-10 w-10 p-0",
                isActive && "bg-accent"
              )}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
            >
              {isActive ? (
                <FilledIcon Icon={Icon} />
              ) : (
                <Icon className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
          );
        })}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="flex items-center justify-center h-10 w-10 p-0"
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => navigate('/jobs')}>
              Jobs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/communities')}>
              Communities
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/events')}>
              Events
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/maps')}>
              Maps
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme}>
              <SunMoon className="mr-2 h-4 w-4" />
              Toggle Theme
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
