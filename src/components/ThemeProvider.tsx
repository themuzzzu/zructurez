
// Import your existing code, assuming you've already created this file
// Only adding changes necessary for language sync

"use client";

import * as React from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useEffect, createContext, useContext, useState } from "react";

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => null,
  isDarkMode: false,
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [theme, setThemeState] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check if we have a saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.add(savedTheme);
    }

    // Detect system preference on first load
    if (!savedTheme) {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setThemeState(isSystemDark ? "dark" : "light");
      document.documentElement.classList.add(isSystemDark ? "dark" : "light");
    }

    setMounted(true);
  }, []);

  // Set theme with proper DOM updates
  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Remove existing theme class
    document.documentElement.classList.remove("light", "dark");
    // Add new theme class
    document.documentElement.classList.add(newTheme);

    // Store the setting
    localStorage.setItem("theme", newTheme);

    // Dispatch theme change event for other components that might need it
    window.dispatchEvent(new CustomEvent("themeChanged", {
      detail: { theme: newTheme }
    }));
  };

  // ListEn for language changes to ensure theme persistence
  useEffect(() => {
    const handleLanguageChange = (e: Event) => {
      // Ensure theme is still applied after language change
      const currentTheme = localStorage.getItem("theme") || theme;
      setTimeout(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(currentTheme);
      }, 100);
    };
    
    window.addEventListener("language-changed", handleLanguageChange);
    
    return () => {
      window.removeEventListener("language-changed", handleLanguageChange);
    };
  }, [theme]);

  const value = {
    theme,
    setTheme,
    isDarkMode: theme === "dark",
  };

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeContext.Provider value={value}>
        {mounted && children}
      </ThemeContext.Provider>
    </NextThemeProvider>
  );
}

export const useTheme = () => useContext(ThemeContext);
