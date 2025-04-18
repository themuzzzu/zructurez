
import { ReactNode } from "react";
import { Navbar } from "../navbar/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SuspenseBoundary } from "./SuspenseBoundary";

interface LayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function Layout({ children, hideNav = false }: LayoutProps) {
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
