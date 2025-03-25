
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Home,
  Store,
  Wrench,
  Users,
  MessageSquare,
  Calendar,
  Settings,
  Briefcase,
  Map,
  Building,
  PanelLeftClose,
  PanelLeft,
  SunMoon,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { NavButton } from "./navbar/NavButton";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

// Create a filled icon component
const FilledIcon = ({ Icon }: { Icon: React.ElementType }) => (
  <div className="relative">
    <Icon size={18} className="text-zinc-200 dark:text-white" strokeWidth={2} />
  </div>
);

export const Sidebar = ({ className }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem("sidebarCollapsed") === "true");
  const { theme, setTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Save collapse state to localStorage and dispatch custom event
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(isCollapsed));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('sidebarStateChanged'));
  }, [isCollapsed]);

  const routes = [
    { name: "Home", path: "/", icon: Home },
    { name: "Marketplace", path: "/marketplace", icon: Store },
    { name: "Services", path: "/services", icon: Wrench },
    { name: "Business", path: "/businesses", icon: Building },
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { name: "Communities", path: "/communities", icon: Users },
    { name: "Messages", path: "/messages", icon: MessageSquare },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "Maps", path: "/maps", icon: Map },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (isMobile) {
    return null; // Don't render sidebar on mobile
  }

  return (
    <div className={cn(
      "h-full bg-white/95 dark:bg-black/95 overflow-y-auto transition-all duration-300 fixed left-0 top-16 z-30", 
      isCollapsed ? "w-12" : "w-44", // Reduced from w-16 : w-64
      className
    )}>
      <div className="flex justify-end py-1 px-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeft className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <PanelLeftClose className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      </div>
      
      <div className="space-y-0.5 px-1 py-1">
        {routes.map((route) => {
          const isActive = location.pathname === route.path;

          return isCollapsed ? (
            <Button
              key={route.path}
              variant="ghost"
              className={cn(
                "w-full p-2 justify-center",
                isActive 
                  ? "bg-zinc-900 dark:bg-zinc-900 rounded-lg" 
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
              )}
              onClick={() => navigate(route.path)}
            >
              {isActive ? (
                <FilledIcon Icon={route.icon} />
              ) : (
                <route.icon className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          ) : (
            <Button
              key={route.path}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-3 py-2 text-sm",
                isActive 
                  ? "bg-zinc-900 dark:bg-zinc-900 rounded-lg font-semibold" 
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
              )}
              onClick={() => navigate(route.path)}
            >
              <div className="flex items-center justify-center">
                {isActive ? (
                  <FilledIcon Icon={route.icon} />
                ) : (
                  <route.icon size={18} className="text-muted-foreground" />
                )}
              </div>
              <span className={cn(
                "text-sm",
                isActive 
                  ? "font-semibold text-zinc-200 dark:text-white" 
                  : "text-gray-800 dark:text-white"
              )}>
                {route.name}
              </span>
            </Button>
          );
        })}
        
        {/* Theme toggle */}
        {isCollapsed ? (
          <Button
            variant="ghost"
            className="w-full p-2 justify-center rounded-full mt-1"
            onClick={toggleTheme}
          >
            <SunMoon className="h-4 w-4 text-muted-foreground" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 rounded-full mt-1 text-sm"
            onClick={toggleTheme}
          >
            <div className="flex items-center justify-center">
              <SunMoon size={18} className="text-muted-foreground" />
            </div>
            <span className="text-sm text-gray-800 dark:text-white">
              Toggle Theme
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
