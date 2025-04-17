
import { cn } from "@/lib/utils";
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
  ShoppingBag,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { SidebarItem } from "./sidebar/SidebarItem";
import { ThemeToggle } from "./sidebar/ThemeToggle";
import { CollapseButton } from "./sidebar/CollapseButton";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

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
    { name: t("home"), path: "/", icon: Home },
    { name: t("marketplace"), path: "/marketplace", icon: ShoppingBag },
    { name: t("services"), path: "/services", icon: Wrench },
    { name: t("business"), path: "/businesses", icon: Building },
    { name: t("jobs"), path: "/jobs", icon: Briefcase },
    { name: t("communities"), path: "/communities", icon: Users },
    { name: t("messages"), path: "/messages", icon: MessageSquare },
    { name: t("events"), path: "/events", icon: Calendar },
    { name: t("maps"), path: "/maps", icon: Map },
    { name: t("settings"), path: "/settings", icon: Settings },
  ];

  const handleItemClick = (path: string) => {
    setActiveItem(path);
    navigate(path);
    
    // Auto-collapse sidebar on mobile after navigation
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Don't render sidebar on mobile - mobile navigation is handled separately
  if (isMobile) {
    return null;
  }

  return (
    <div className={cn(
      "h-full overflow-y-auto transition-all duration-300 fixed left-0 top-16 z-30 scrollbar-hide", 
      isDarkMode ? "bg-background dark:bg-background" : "bg-background",
      isCollapsed ? "w-12" : "w-44", 
      className
    )}>
      <div className="flex justify-end py-1 px-1">
        <CollapseButton 
          isCollapsed={isCollapsed} 
          isDarkMode={isDarkMode} 
          onClick={() => setIsCollapsed(!isCollapsed)} 
        />
      </div>
      
      <div className="space-y-1 px-1 py-1">
        {routes.map((route) => (
          <SidebarItem
            key={route.path}
            name={route.name}
            path={route.path}
            icon={route.icon}
            isActive={activeItem === route.path || 
                      (route.path !== "/" && activeItem.startsWith(route.path))}
            isCollapsed={isCollapsed}
            isDarkMode={isDarkMode}
            onClick={handleItemClick}
          />
        ))}
        
        {/* Theme toggle */}
        <ThemeToggle 
          isCollapsed={isCollapsed} 
          isDarkMode={isDarkMode} 
          onClick={toggleTheme} 
        />
      </div>
    </div>
  );
}
