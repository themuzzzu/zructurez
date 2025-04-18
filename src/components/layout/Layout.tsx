
import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { SuspenseBoundary } from "./SuspenseBoundary";
import { Sidebar } from "@/components/Sidebar";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface LayoutProps {
  children: ReactNode;
  hideNav?: boolean;
  hideSidebar?: boolean;
}

export function Layout({ children, hideNav = false, hideSidebar = false }: LayoutProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {!hideNav && <Navbar />}
      <div className="flex flex-1 pt-16">
        {!hideSidebar && !isMobile && (
          <Sidebar className="h-[calc(100vh-4rem)] fixed left-0 top-16" />
        )}
        <main className={`flex-1 relative ${!hideSidebar && !isMobile ? 'ml-[72px]' : ''}`}>
          <SuspenseBoundary>
            {children}
          </SuspenseBoundary>
        </main>
      </div>
    </div>
  );
}
