import React from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { links } from "@/lib/core-links";
import { SidebarLink } from "./SidebarLink";
import { Button } from "../ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define all the links for the sidebar
const sidebarLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
  },
  {
    href: "/marketplace",
    label: "Marketplace",
    icon: "Store",
  },
  {
    href: "/shop",
    label: "Shop",
    icon: "ShoppingBag",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: "Settings",
  },
  {
    href: "/billing",
    label: "Billing",
    icon: "CreditCard",
  },
  {
    href: "/help",
    label: "Help",
    icon: "HelpCircle",
  },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  const isCurrentPath = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const linkClasses = "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100";

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-xl font-bold">
            <img src="/logo-small.png" alt="Logo" className="w-8 h-8" />
            <span>App Name</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          {sidebarLinks.map((link, index) => (
            <SidebarLink
              key={index}
              href={link.href}
              icon={link.icon}
              isActive={isCurrentPath(link.href)}
              onClick={onClose}
            >
              {link.label}
            </SidebarLink>
          ))}
        </div>

        <div className="mt-auto">
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">
              Need help? <a href="/help" className="text-blue-600">Contact us</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
