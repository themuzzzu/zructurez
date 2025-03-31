
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
  // Reduce sidebar width by approximately 30% of original values
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true" ? 45 : 180; // Reduced from 64 : 256
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16 w-full">
        {!hideSidebar && !isMobile && (
          <div 
            style={{ width: sidebarWidth + 'px', left: '0px' }} 
            className={`transition-all duration-300 fixed h-[calc(100vh-64px)] ${isDarkMode ? 'border-zinc-800/50' : 'border-zinc-200/50'} border-r scrollbar-hide overflow-y-auto`}
          >
            <Sidebar />
          </div>
        )}
        <main 
          className={`flex-1 transition-all duration-300 w-full overflow-y-auto scrollbar-hide ${hideSidebar || isMobile ? 'mobile-container' : ''}`}
          style={{ 
            marginLeft: hideSidebar || isMobile ? 0 : sidebarWidth + 'px', 
            paddingBottom: isMobile ? '5rem' : '',
            // Add small padding on mobile
            paddingLeft: isMobile ? '0' : (!hideSidebar && !isMobile) ? '0.25rem' : '',
            paddingRight: isMobile ? '0' : '',
            maxHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </main>
      </div>
      
      {/* AI Components */}
      <AIAssistant />
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};
