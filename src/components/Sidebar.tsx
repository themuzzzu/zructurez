
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

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar = ({ className }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem("sidebarCollapsed") === "true");
  const { theme, setTheme } = useTheme();

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
      "h-screen border-r border-zinc-800 bg-black overflow-y-auto transition-all duration-300 fixed left-0 top-0 z-30",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-zinc-800 transition-all duration-200"
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
              className="w-full p-0 justify-center"
              onClick={() => navigate(route.path)}
            >
              <div className="flex items-center justify-center w-10 h-10">
                <div className={cn(
                  "p-2 rounded-full transition-colors",
                  isActive ? "bg-zinc-800" : "hover:bg-zinc-800/70"
                )}>
                  <route.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-muted-foreground")} />
                </div>
              </div>
            </Button>
          ) : (
            <NavButton
              key={route.path}
              icon={route.icon}
              label={route.name}
              isActive={isActive}
              onClick={() => navigate(route.path)}
              className="w-full"
            />
          );
        })}
        
        {/* Theme toggle */}
        {isCollapsed ? (
          <Button
            variant="ghost"
            className="w-full p-0 justify-center mt-4"
            onClick={toggleTheme}
          >
            <div className="flex items-center justify-center w-10 h-10">
              <div className="p-2 rounded-full transition-colors hover:bg-zinc-800/70">
                <SunMoon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </Button>
        ) : (
          <NavButton
            icon={SunMoon}
            label="Toggle Theme"
            onClick={toggleTheme}
            className="mt-4"
          />
        )}
      </div>
    </div>
  );
};
