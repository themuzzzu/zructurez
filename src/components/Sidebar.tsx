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
    <Icon size={20} fill="white" stroke="black" strokeWidth={1.5} />
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
      "h-screen border-r border-zinc-200 bg-white dark:bg-black dark:border-zinc-800 overflow-y-auto transition-all duration-300 fixed left-0 top-16 z-30", 
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4 text-muted-foreground" />
          ) : (
            <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      
      <div className="space-y-2 p-2">
        {routes.map((route) => {
          const isActive = location.pathname === route.path;

          return isCollapsed ? (
            <Button
              key={route.path}
              variant="ghost"
              className={cn(
                "w-full p-0 justify-center",
                isActive ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
              )}
              onClick={() => navigate(route.path)}
            >
              {isActive ? (
                <FilledIcon Icon={route.icon} />
              ) : (
                <route.icon className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
          ) : (
            <Button
              key={route.path}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-4 px-4",
                isActive ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
              )}
              onClick={() => navigate(route.path)}
            >
              <div className="flex items-center justify-center">
                {isActive ? (
                  <FilledIcon Icon={route.icon} />
                ) : (
                  <route.icon size={20} className="text-muted-foreground" />
                )}
              </div>
              <span className="text-lg font-medium text-gray-800 dark:text-white">
                {route.name}
              </span>
            </Button>
          );
        })}
        
        {/* Theme toggle */}
        {isCollapsed ? (
          <Button
            variant="ghost"
            className="w-full p-0 justify-center mt-4"
            onClick={toggleTheme}
          >
            <SunMoon className="h-5 w-5 text-muted-foreground" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start gap-4 px-4 mt-4"
            onClick={toggleTheme}
          >
            <div className="flex items-center justify-center">
              <SunMoon size={20} className="text-muted-foreground" />
            </div>
            <span className="text-lg font-medium text-gray-800 dark:text-white">
              Toggle Theme
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};
