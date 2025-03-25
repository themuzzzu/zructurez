
import { ReactNode, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { AIAssistant } from "@/components/ai-support/AIAssistant";
import { SmartNotificationAgent } from "@/components/ai-notifications/SmartNotificationAgent";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface LayoutProps {
  children: ReactNode;
  hideSidebar?: boolean;
}

export const Layout = ({ children, hideSidebar = false }: LayoutProps) => {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true" ? 64 : 256;
  });
  
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Listen for sidebar state changes
  useEffect(() => {
    const handleSidebarChange = () => {
      setSidebarWidth(localStorage.getItem("sidebarCollapsed") === "true" ? 64 : 256);
    };

    window.addEventListener('sidebarStateChanged', handleSidebarChange);
    
    return () => {
      window.removeEventListener('sidebarStateChanged', handleSidebarChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16 w-full no-gap"> {/* Added no-gap class */}
        {!hideSidebar && !isMobile && (
          <div style={{ width: sidebarWidth + 'px' }} className="transition-all duration-300 fixed h-[calc(100vh-64px)] border-r border-zinc-200 dark:border-zinc-800">
            <Sidebar />
          </div>
        )}
        <main 
          className="flex-1 transition-all duration-300 w-full no-gap" 
          style={{ marginLeft: hideSidebar || isMobile ? 0 : sidebarWidth + 'px', padding: 0 }}
        >
          {children}
        </main>
      </div>
      
      {/* AI Components */}
      <AIAssistant />
      <SmartNotificationAgent />
    </div>
  );
};
