
import React, { useEffect } from "react";
import { SunMoon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ThemeToggleProps {
  isCollapsed: boolean;
  isDarkMode: boolean;
  onClick: () => void;
}

export const ThemeToggle = ({ isCollapsed, isDarkMode, onClick }: ThemeToggleProps) => {
  const { t } = useLanguage();
  
  if (isCollapsed) {
    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full p-2 justify-center rounded-lg mt-1 transition-all duration-200",
          isDarkMode
            ? "hover:bg-zinc-800"
            : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
        )}
        onClick={onClick}
        data-theme-toggle="true"
        aria-label={t("theme")}
      >
        <SunMoon className="h-5 w-5 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 px-3 py-2 rounded-lg mt-1 text-sm transition-all duration-200",
        isDarkMode
          ? "hover:bg-zinc-800"
          : "hover:bg-zinc-200 dark:hover:bg-zinc-800"
      )}
      onClick={onClick}
      data-theme-toggle="true"
    >
      <div className="flex items-center justify-center">
        <SunMoon size={20} className="text-muted-foreground" />
      </div>
      <span className="text-sm text-muted-foreground" data-translate="theme">
        {t("theme")}
      </span>
    </Button>
  );
};
