
import * as React from "react";

export type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () => {
      if (typeof window !== "undefined") {
        const storedTheme = localStorage.getItem(storageKey) as Theme | null;
        return storedTheme || defaultTheme;
      }
      return defaultTheme;
    }
  );

  // Apply theme to document and dispatch events
  const applyTheme = React.useCallback((newTheme: Theme) => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove("light", "dark");

    // Set the appropriate theme
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }

    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: newTheme } 
    }));

    // Save to localStorage
    localStorage.setItem(storageKey, newTheme);
  }, [storageKey]);

  // Apply theme whenever it changes
  React.useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Listen for system theme changes when system theme is selected
  React.useEffect(() => {
    if (theme !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      
      const newTheme = mediaQuery.matches ? "dark" : "light";
      root.classList.add(newTheme);
      
      // Dispatch event for system theme change
      window.dispatchEvent(new CustomEvent('systemThemeChanged', { 
        detail: { theme: newTheme } 
      }));
    };
    
    mediaQuery.addEventListener("change", handleChange);
    
    // Apply initial system preference
    handleChange();
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  const value = React.useMemo(() => ({
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
      applyTheme(newTheme);
    },
  }), [theme, applyTheme]);

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = (): ThemeProviderState => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
