
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
import { NavButton } from "./NavButton";

export const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const mobileNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Store, label: "Marketplace", path: "/marketplace" },
    { icon: Wrench, label: "Services", path: "/services" },
    { icon: Building, label: "Business", path: "/business" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/90 border-t py-1.5 sm:py-2 px-1 sm:px-2 z-50 animate-slide-up backdrop-blur-sm">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant={isActive ? "dark-nav-active" : "dark-nav"}
              size="sm"
              className={`flex flex-col items-center gap-0.5 h-auto py-1 px-2 transition-all duration-200 rounded-lg ${
                isActive ? 'text-white scale-105' : 'text-muted-foreground'
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px]">{item.label}</span>
            </Button>
          );
        })}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="dark-nav" 
              size="sm" 
              className="flex flex-col items-center gap-0.5 h-auto py-1 px-2 rounded-lg"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="text-[10px]">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-zinc-900 text-white border-zinc-700">
            <DropdownMenuItem onClick={() => navigate('/jobs')} className="hover:bg-zinc-800">
              Jobs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/communities')} className="hover:bg-zinc-800">
              Communities
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/events')} className="hover:bg-zinc-800">
              Events
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/maps')} className="hover:bg-zinc-800">
              Maps
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme} className="hover:bg-zinc-800">
              <SunMoon className="mr-2 h-4 w-4" />
              Toggle Theme
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
