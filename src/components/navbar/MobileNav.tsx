
import React from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Home, ShoppingBag, Wrench, Briefcase, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { IconComponent } from "@/types/component";

interface NavItem {
  icon: IconComponent;
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
      icon: Home,
      label: t("home"),
      href: "/",
      active: location.pathname === "/",
    },
    {
      icon: ShoppingBag,
      label: t("marketplace"),
      href: "/marketplace",
      active: location.pathname.startsWith("/marketplace"),
    },
    {
      icon: Wrench,
      label: t("services"),
      href: "/services",
      active: location.pathname.startsWith("/services"),
    },
    {
      icon: Briefcase,
      label: t("business"),
      href: "/businesses",
      active: location.pathname.startsWith("/business"),
    },
    {
      icon: MoreHorizontal,
      label: t("more"),
      href: "/more",
      active: location.pathname === "/more",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item, index) => {
          const Icon = item.icon;
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
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
