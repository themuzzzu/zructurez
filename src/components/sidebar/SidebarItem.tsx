
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
  // Regular icon with inner line for inactive state
  const RegularIcon = () => (
    <div className="relative">
      <Icon size={20} className="text-muted-foreground" />
      {/* Inner decorative line */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-current opacity-40"></div>
    </div>
  );

  const activeBackground = isDarkMode ? "bg-zinc-800" : "bg-zinc-200";

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
          <RegularIcon />
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
          <RegularIcon />
        )}
      </div>
      <span className={cn(
        "text-sm",
        isActive 
          ? "font-bold " + (isDarkMode ? "text-white" : "text-black") 
          : "text-muted-foreground"
      )}>
        {name}
      </span>
    </Button>
  );
};
