
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t py-2 px-4 z-50 animate-slide-up backdrop-blur-sm bg-background/80">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-1 transition-all duration-200 ${
                isActive ? 'text-primary scale-110' : 'text-muted-foreground'
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-1">
              <MoreVertical className="h-5 w-5" />
              <span className="text-xs">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
