
"use client";

import * as React from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  isDarkMode: boolean;
};

// Create the context with default values
const ThemeContext = React.createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => null,
  isDarkMode: false,
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Make sure we're importing React properly to use hooks
  const [theme, setThemeState] = React.useState("light");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
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

  // Listen for language changes to ensure theme persistence
  React.useEffect(() => {
    const handleLanguageChange = () => {
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

export const useTheme = () => React.useContext(ThemeContext);
