
import { ReactNode, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
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
      <div className="flex pt-16 w-full h-[calc(100vh-4rem)]">
        {!hideSidebar && !isMobile && (
          <div 
            style={{ width: sidebarWidth + 'px' }} 
            className="transition-all duration-300 fixed h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden scrollbar-hide z-20"
          >
            <Sidebar />
          </div>
        )}
        <main 
          className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide transition-all duration-300 w-full"
          style={{ 
            marginLeft: hideSidebar || isMobile ? 0 : sidebarWidth + 'px',
            paddingBottom: isMobile ? '6rem' : '2rem', 
            height: 'calc(100vh - 64px)',
            padding: isMobile ? '0 0.5rem 6rem 0.5rem' : '0 1.5rem 2rem 1.5rem',
          }}
        >
          {children}
        </main>
      </div>
      
      {/* Mobile Navigation - should render on ALL mobile device views */}
      <MobileNav />
    </div>
  );
}
