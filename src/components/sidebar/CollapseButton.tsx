
import React from "react";
import { PanelLeft, PanelLeftClose } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CollapseButtonProps {
  isCollapsed: boolean;
  isDarkMode: boolean;
  onClick: () => void;
}

export const CollapseButton = ({ isCollapsed, isDarkMode, onClick }: CollapseButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        "rounded-full",
        isDarkMode ? "hover:bg-zinc-800 dark:hover:bg-zinc-800" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
      )}
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {isCollapsed ? (
        <PanelLeft className={cn("h-3.5 w-3.5", isDarkMode ? "text-foreground" : "text-foreground")} />
      ) : (
        <PanelLeftClose className={cn("h-3.5 w-3.5", isDarkMode ? "text-foreground" : "text-foreground")} />
      )}
    </Button>
  );
};
