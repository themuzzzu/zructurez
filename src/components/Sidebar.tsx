
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

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar = ({ className }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem("sidebarCollapsed") === "true");
  const { theme, setTheme } = useTheme();

  // Save collapse state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  const routes = [
    { name: "Home", path: "/", icon: Home },
    { name: "Marketplace", path: "/marketplace", icon: Store },
    { name: "Services", path: "/services", icon: Wrench },
    { name: "Business", path: "/business", icon: Building },
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

  return (
    <div className={cn(
      "h-screen border-r bg-background overflow-y-auto transition-all duration-300 fixed left-0 top-0 z-30",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-accent/50"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="space-y-1 p-3">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = location.pathname === route.path;

          return (
            <Button
              key={route.path}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-10 px-3 gap-3 hover:bg-accent/50",
                isCollapsed && "justify-center px-0"
              )}
              onClick={() => navigate(route.path)}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{route.name}</span>
              )}
            </Button>
          );
        })}
        
        {/* Theme toggle */}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-10 px-3 gap-3 hover:bg-accent/50 mt-4",
            isCollapsed && "justify-center px-0"
          )}
          onClick={toggleTheme}
        >
          <SunMoon className="h-4 w-4 shrink-0" />
          {!isCollapsed && (
            <span className="text-sm font-medium">Toggle Theme</span>
          )}
        </Button>
      </div>
    </div>
  );
};
