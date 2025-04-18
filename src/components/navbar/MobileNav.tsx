
import React from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import * as LucideIcons from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavItem {
  icon: keyof typeof LucideIcons;
  label: string;
  href: string;
  active: boolean;
}

export function MobileNav() {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const navItems: NavItem[] = [
    {
      icon: "Home",
      label: t("home"),
      href: "/",
      active: location.pathname === "/",
    },
    {
      icon: "Search",
      label: t("search"),
      href: "/search",
      active: location.pathname.startsWith("/search"),
    },
    {
      icon: "MapPin",
      label: t("map"),
      href: "/maps",
      active: location.pathname.startsWith("/maps"),
    },
    {
      icon: "Store",
      label: t("marketplace"),
      href: "/marketplace",
      active: location.pathname.startsWith("/marketplace"),
    },
    {
      icon: "User",
      label: user ? t("profile") : t("account"),
      href: user ? "/profile" : "/login",
      active: location.pathname.startsWith("/profile") || location.pathname.startsWith("/login"),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item, index) => {
          // Get the correct icon component from Lucide
          const IconComponent = LucideIcons[item.icon];
          return (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-1 px-3 text-xs",
                item.active
                  ? "text-primary border-t-2 border-primary"
                  : "text-muted-foreground"
              )}
            >
              <IconComponent className="h-5 w-5 mb-1" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
