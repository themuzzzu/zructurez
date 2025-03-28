
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FilledIcon } from "./FilledIcon";

interface SidebarItemProps {
  name: string;
  path: string;
  icon: React.ElementType;
  isActive: boolean;
  isCollapsed: boolean;
  isDarkMode: boolean;
  onClick: (path: string) => void;
}

export const SidebarItem = ({ 
  name, 
  path, 
  icon: Icon, 
  isActive, 
  isCollapsed, 
  isDarkMode,
  onClick 
}: SidebarItemProps) => {
  const activeBackground = "bg-zinc-800";

  if (isCollapsed) {
    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full p-2 justify-center transition-all duration-200",
          isActive 
            ? activeBackground + " rounded-lg" 
            : isDarkMode
              ? "hover:bg-zinc-800 rounded-lg"
              : "hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg"
        )}
        onClick={() => onClick(path)}
      >
        {isActive ? (
          <FilledIcon Icon={Icon} />
        ) : (
          <Icon className={cn("h-5 w-5", 
            isDarkMode 
              ? "text-muted-foreground" 
              : "text-muted-foreground"
          )} />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 px-3 py-2 text-sm transition-all duration-200",
        isActive 
          ? activeBackground + " rounded-lg" 
          : isDarkMode
            ? "hover:bg-zinc-800 rounded-lg"
            : "hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg"
      )}
      onClick={() => onClick(path)}
    >
      <div className="flex items-center justify-center">
        {isActive ? (
          <FilledIcon Icon={Icon} />
        ) : (
          <Icon size={20} className={cn(
            "text-muted-foreground"
          )} />
        )}
      </div>
      <span className={cn(
        "text-sm",
        isActive 
          ? "font-bold text-white" 
          : "text-muted-foreground"
      )}>
        {name}
      </span>
    </Button>
  );
};
