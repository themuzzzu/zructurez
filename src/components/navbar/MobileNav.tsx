
import { Home, ShoppingBag, Wrench, Building, MessageSquare, MoreVertical, SunMoon, 
  Users, Briefcase, Calendar, Map, Settings, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useTheme } from "../ThemeProvider";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState, memo, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// Create a simplified icon component for mobile nav
const FilledIcon = memo(({ Icon }: { Icon: React.ElementType }) => {
  return (
    <div className="relative">
      <Icon 
        className="h-5 w-5 text-primary" 
        fill="none" 
        strokeWidth={2.5}
      />
    </div>
  );
});
FilledIcon.displayName = 'FilledIcon';

// Regular icon with no inner decorations
const RegularIcon = memo(({ Icon }: { Icon: React.ElementType }) => {
  return (
    <div className="relative">
      <Icon className="h-5 w-5" strokeWidth={1.5} />
    </div>
  );
});
RegularIcon.displayName = 'RegularIcon';

export const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDarkMode = theme === "dark";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t, language } = useLanguage();
  const navRef = useRef<HTMLDivElement>(null);
  
  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = (e: Event) => {
      // Force re-render by triggering state update after language change
      setTimeout(() => {
        if (navRef.current) {
          // Update the nav items
          const navButtons = navRef.current.querySelectorAll('button[data-translate]');
          navButtons.forEach(button => {
            const key = button.getAttribute('data-translate');
            if (key) {
              const span = button.querySelector('span');
              if (span) {
                span.textContent = t(key);
              }
            }
          });
        }
      }, 100); // Short delay to ensure translations are loaded
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, [t, language]);

  // All navigation items with translations
  const allNavItems = [
    { icon: Home, label: t("home"), path: "/" },
    { icon: ShoppingBag, label: t("marketplace"), path: "/marketplace" },
    { icon: Wrench, label: t("services"), path: "/services" },
    { icon: Building, label: t("business"), path: "/businesses" },
    { icon: Map, label: t("maps"), path: "/maps" }, 
    { icon: MessageSquare, label: t("messages"), path: "/messages" },
    { icon: Users, label: t("communities"), path: "/communities" },
    { icon: Briefcase, label: t("jobs"), path: "/jobs" },
    { icon: Calendar, label: t("events"), path: "/events" },
    { icon: Heart, label: t("wishlist"), path: "/wishlist" },
    { icon: Settings, label: t("settings"), path: "/settings" },
  ];

  // Main navigation items for bottom bar
  const mainNavItems = allNavItems.slice(0, 5);
  
  if (!isMobile) {
    return null; // Don't render on non-mobile devices
  }

  // Check if the current path starts with any of our main paths
  const checkActivePath = (itemPath: string) => {
    if (itemPath === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(itemPath);
  };
  
  const handleNavClick = (item: any) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
      setDrawerOpen(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  return (
    <div 
      ref={navRef} 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-2 px-1 z-50 animate-fade-in"
    >
      <div className="flex justify-between items-center max-w-md mx-auto">
        {mainNavItems.map((item) => {
          const isActive = checkActivePath(item.path);
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="icon"
              className={cn(
                "flex flex-col items-center justify-center h-14 w-16 p-0 gap-1 bottom-nav-item",
                isActive ? "text-primary dark:text-primary" : "text-zinc-500 dark:text-zinc-500"
              )}
              onClick={() => handleNavClick(item)}
              aria-label={item.label}
              data-translate={item.label.toLowerCase()}
            >
              {isActive ? (
                <FilledIcon Icon={item.icon} />
              ) : (
                <RegularIcon Icon={item.icon} />
              )}
              <span className={cn(
                "text-[10px] font-medium overflow-hidden text-ellipsis w-full px-1",
                isActive ? "text-primary dark:text-primary" : "text-zinc-500 dark:text-zinc-500"
              )}
              data-translate={item.label.toLowerCase()}>
                {item.label}
              </span>
            </Button>
          );
        })}

        {/* Drawer for remaining menu items instead of dropdown */}
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="flex flex-col items-center justify-center h-14 w-16 p-0 gap-1 text-zinc-500 dark:text-zinc-500 bottom-nav-item"
              aria-label={t("more")}
              data-translate="more"
            >
              <div className="relative">
                <MoreVertical className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium w-full px-1" data-translate="more">
                {t("more")}
              </span>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle data-translate="menu">{t("menu")}</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 py-2 grid grid-cols-3 gap-4">
              {allNavItems.slice(5).map((item) => {
                const isActive = checkActivePath(item.path);
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={cn(
                      "flex flex-col items-center justify-center py-4 h-auto",
                      isActive ? "bg-muted" : ""
                    )}
                    onClick={() => handleNavClick(item)}
                    data-translate={item.label.toLowerCase()}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 mb-2",
                      isActive ? "text-primary" : "text-foreground"
                    )} />
                    <span className="text-xs" data-translate={item.label.toLowerCase()}>
                      {item.label}
                    </span>
                  </Button>
                );
              })}
              
              <Button
                variant="ghost"
                className="flex flex-col items-center justify-center py-4 h-auto"
                onClick={toggleTheme}
              >
                <SunMoon className="h-5 w-5 mb-2" />
                <span className="text-xs" data-translate={isDarkMode ? "light" : "dark"}>
                  {t(isDarkMode ? "light" : "dark")}
                </span>
              </Button>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" data-translate="close">{t("close")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
