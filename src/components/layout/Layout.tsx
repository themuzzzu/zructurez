
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
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      <div className="flex pt-16 w-full overflow-hidden">
        {!hideSidebar && !isMobile && (
          <div 
            style={{ width: sidebarWidth + 'px', left: '0px' }} 
            className={`transition-all duration-300 fixed h-[calc(100vh-64px)] ${isDarkMode ? 'border-zinc-800/50' : 'border-zinc-200/50'} border-r scrollbar-hide overflow-hidden`}
          >
            <Sidebar />
          </div>
        )}
        <main 
          className={`flex-1 transition-all duration-300 w-full overflow-auto scrollbar-hide ${hideSidebar || isMobile ? 'px-4 sm:px-6 pb-20' : ''}`}
          style={{ 
            marginLeft: hideSidebar || isMobile ? 0 : sidebarWidth + 'px', 
            paddingBottom: isMobile ? '5rem' : '',
            // Significantly reduce the horizontal padding when sidebar is open to match the second image
            paddingLeft: (!hideSidebar && !isMobile) ? '0.25rem' : ''
          }}
        >
          {children}
        </main>
      </div>
      
      {/* AI Components */}
      <AIAssistant />
      
      {/* Mobile Navigation - Make sure this is always rendered regardless of hideSidebar */}
      <MobileNav />
    </div>
  );
};
