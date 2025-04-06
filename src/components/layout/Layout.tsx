
import { ReactNode, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { AIAssistant } from "@/components/ai-support/AIAssistant";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTheme } from "@/components/ThemeProvider";
import { MobileNav } from "@/components/navbar/MobileNav";

interface LayoutProps {
  children: ReactNode;
  hideSidebar?: boolean;
}

export const Layout = ({ children, hideSidebar = false }: LayoutProps) => {
  // Sidebar width values for desktop
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true" ? 45 : 180;
  });
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Listen for sidebar state changes
  useEffect(() => {
    const handleSidebarChange = () => {
      setSidebarWidth(localStorage.getItem("sidebarCollapsed") === "true" ? 45 : 180);
    };

    window.addEventListener('sidebarStateChanged', handleSidebarChange);
    
    return () => {
      window.removeEventListener('sidebarStateChanged', handleSidebarChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <div className="flex pt-16 w-full">
        {!hideSidebar && !isMobile && (
          <div 
            style={{ width: sidebarWidth + 'px' }} 
            className="transition-all duration-300 fixed h-[calc(100vh-64px)] overflow-y-auto scrollbar-hide"
          >
            <Sidebar />
          </div>
        )}
        <main 
          className="flex-1 transition-all duration-300 w-full overflow-y-auto scrollbar-hide overflow-x-hidden pb-16 sm:pb-6"
          style={{ 
            marginLeft: hideSidebar || isMobile ? 0 : sidebarWidth + 'px', 
            paddingBottom: isMobile ? '5rem' : '', 
            maxHeight: 'calc(100vh - 64px)',
            padding: isMobile ? '' : '0 24px', 
          }}
        >
          {children}
        </main>
      </div>
      
      {/* AI Components */}
      <AIAssistant />
      
      {/* Mobile Navigation - should render on ALL mobile device views */}
      <MobileNav />
    </div>
  );
};
