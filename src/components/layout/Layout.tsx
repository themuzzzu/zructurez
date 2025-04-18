
import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { SuspenseBoundary } from "./SuspenseBoundary";

interface LayoutProps {
  children: ReactNode;
  hideNav?: boolean;
  hideSidebar?: boolean;
}

export function Layout({ children, hideNav = false, hideSidebar = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {!hideNav && <Navbar />}
      <main className="flex-1 pt-16 relative">
        <SuspenseBoundary>
          {children}
        </SuspenseBoundary>
      </main>
    </div>
  );
}
