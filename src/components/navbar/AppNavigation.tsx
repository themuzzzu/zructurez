
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";

export const AppNavigation: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Marketplace", path: "/marketplace" },
    { label: "Services", path: "/services" },
    { label: "Rankings", path: "/rankings" },
  ];

  return (
    <nav className="flex items-center space-x-4">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive(item.path)
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
