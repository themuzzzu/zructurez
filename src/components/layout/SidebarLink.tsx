
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

type IconName = keyof typeof Icons;

interface SidebarLinkProps {
  href: string;
  icon: IconName;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon,
  children,
  isActive,
  onClick,
}) => {
  const Icon = Icons[icon] || Icons.CircleDot;

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
        isActive
          ? "bg-gray-100 text-blue-600 font-medium"
          : "hover:bg-gray-100 text-gray-700"
      )}
      onClick={onClick}
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </Link>
  );
};
