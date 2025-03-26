
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
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Create a filled icon component
const FilledIcon = ({ Icon, isDarkMode }: { Icon: React.ElementType; isDarkMode: boolean }) => (
  <div className="relative">
    <Icon 
      size={20} 
      className={isDarkMode ? "text-white" : "text-black"}
      strokeWidth={1.75} 
      fill="currentColor" 
    />
  </div>
);

export const Sidebar = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(() => {
    // Initialize with current path or default to home
    return location.pathname || "/";
  });
  const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem("sidebarCollapsed") === "true");
  const { theme, setTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDarkMode = theme === "dark";

  // Save collapse state to localStorage and dispatch custom event
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(isCollapsed));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('sidebarStateChanged'));
  }, [isCollapsed]);

  // Update active item when route changes
  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

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

  const handleItemClick = (path: string) => {
    setActiveItem(path);
    navigate(path);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (isMobile) {
    return null; // Don't render sidebar on mobile
  }

  return (
    <div className={cn(
      "h-full overflow-y-auto transition-all duration-300 fixed left-0 top-16 z-30", 
      isDarkMode ? "bg-background dark:bg-background" : "bg-background",
      isCollapsed ? "w-12" : "w-44", 
      className
    )}>
      <div className="flex justify-end py-1 px-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "rounded-full",
            isDarkMode ? "hover:bg-zinc-800 dark:hover:bg-zinc-800" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeft className={cn("h-3.5 w-3.5", isDarkMode ? "text-foreground" : "text-foreground")} />
          ) : (
            <PanelLeftClose className={cn("h-3.5 w-3.5", isDarkMode ? "text-foreground" : "text-foreground")} />
          )}
        </Button>
      </div>
      
      <div className="space-y-1 px-1 py-1">
        {routes.map((route) => {
          const isActive = activeItem === route.path;

          return isCollapsed ? (
            <Button
              key={route.path}
              variant="ghost"
              className={cn(
                "w-full p-2 justify-center transition-all duration-200",
                isActive 
                  ? isDarkMode 
                    ? "bg-zinc-900 rounded-full" 
                    : "bg-zinc-200 dark:bg-zinc-900 rounded-full"
                  : isDarkMode
                    ? "hover:bg-zinc-800 rounded-full"
                    : "hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full"
              )}
              onClick={() => handleItemClick(route.path)}
            >
              {isActive ? (
                <FilledIcon Icon={route.icon} isDarkMode={isDarkMode} />
              ) : (
                <route.icon className={cn("h-5 w-5", 
                  isDarkMode 
                    ? "text-muted-foreground" 
                    : "text-muted-foreground"
                )} />
              )}
            </Button>
          ) : (
            <Button
              key={route.path}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-3 py-2 text-sm transition-all duration-200",
                isActive 
                  ? isDarkMode
                    ? "bg-zinc-900 rounded-full" 
                    : "bg-zinc-200 dark:bg-zinc-900 rounded-full"
                  : isDarkMode
                    ? "hover:bg-zinc-800 rounded-full"
                    : "hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full"
              )}
              onClick={() => handleItemClick(route.path)}
            >
              <div className="flex items-center justify-center">
                {isActive ? (
                  <FilledIcon Icon={route.icon} isDarkMode={isDarkMode} />
                ) : (
                  <route.icon size={20} className={cn(
                    "text-muted-foreground"
                  )} />
                )}
              </div>
              <span className={cn(
                "text-sm",
                isActive 
                  ? isDarkMode
                    ? "font-bold text-foreground" 
                    : "font-bold text-foreground"
                  : "text-muted-foreground"
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
            className={cn(
              "w-full p-2 justify-center rounded-full mt-1 transition-all duration-200",
              isDarkMode
                ? "hover:bg-zinc-800"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
            )}
            onClick={toggleTheme}
          >
            <SunMoon className="h-5 w-5 text-muted-foreground" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 px-3 py-2 rounded-full mt-1 text-sm transition-all duration-200",
              isDarkMode
                ? "hover:bg-zinc-800"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
            )}
            onClick={toggleTheme}
          >
            <div className="flex items-center justify-center">
              <SunMoon size={20} className="text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">
              Toggle Theme
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
