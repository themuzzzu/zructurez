
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  name: string;
  path: string;
  icon: LucideIcon;
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
  onClick,
}: SidebarItemProps) => {
  if (isCollapsed) {
    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full p-2 justify-center rounded-lg transition-all duration-200",
          isActive
            ? "bg-zinc-200 dark:bg-zinc-800 text-primary dark:text-primary"
            : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
        )}
        onClick={() => onClick(path)}
      >
        <div className="relative">
          <Icon 
            className={cn(
              "h-5 w-5",
              isActive ? "text-primary dark:text-primary" : "text-muted-foreground"
            )} 
          />
          {isActive && (
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)' 
              }}
            />
          )}
        </div>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
        isActive
          ? "bg-zinc-200 dark:bg-zinc-800 text-primary dark:text-primary"
          : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
      )}
      onClick={() => onClick(path)}
    >
      <div className="relative">
        <Icon 
          className={cn(
            "h-5 w-5",
            isActive ? "text-primary dark:text-primary" : "text-muted-foreground"
          )} 
        />
        {isActive && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)' 
            }}
          />
        )}
      </div>
      <span className={cn(
        "text-sm",
        isActive ? "font-medium text-primary dark:text-primary" : "text-muted-foreground"
      )}>
        {name}
      </span>
    </Button>
  );
};
