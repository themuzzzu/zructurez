
import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SuspenseBoundary } from "./SuspenseBoundary";

interface LayoutProps {
  children: ReactNode;
  hideNav?: boolean;
  hideSidebar?: boolean; // Added to fix the hideSidebar prop error
}

export function Layout({ children, hideNav = false, hideSidebar = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {!hideNav && <Navbar />}
      <main className="min-h-screen pt-16">
        <SuspenseBoundary>
          {children}
        </SuspenseBoundary>
      </main>
    </div>
  );
}
