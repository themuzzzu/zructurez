
import { ReactNode, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );

  // Listen for sidebar collapse state changes
  useEffect(() => {
    const checkSidebarState = () => {
      setSidebarCollapsed(localStorage.getItem("sidebarCollapsed") === "true");
    };
    
    // Check on initial render
    checkSidebarState();
    
    // Listen for localStorage changes
    window.addEventListener('storage', checkSidebarState);
    
    // Also listen for custom event for immediate updates
    window.addEventListener('sidebarStateChanged', checkSidebarState);
    
    return () => {
      window.removeEventListener('storage', checkSidebarState);
      window.removeEventListener('sidebarStateChanged', checkSidebarState);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="flex">
          <Sidebar className="hidden lg:block h-[calc(100vh-4rem)]" />
          <main 
            className={`flex-1 transition-all duration-300 w-full pb-16 lg:pb-0 ${
              sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
