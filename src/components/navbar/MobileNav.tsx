
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/95 border-t border-zinc-800 py-3 px-1 sm:px-2 z-50 animate-slide-up backdrop-blur-sm">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="icon"
              className="flex items-center justify-center h-10 w-10 p-0"
              onClick={() => navigate(item.path)}
              aria-label={item.label}
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                isActive ? "bg-zinc-800" : "hover:bg-zinc-800/70"
              )}>
                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-muted-foreground")} />
              </div>
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
              <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-800/70">
                <MoreVertical className="h-5 w-5 text-muted-foreground" />
              </div>
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
