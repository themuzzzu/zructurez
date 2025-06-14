
import React from "react";
import { OfflineIndicator } from "@/components/layout/OfflineIndicator";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <OfflineIndicator />
      <main className="pt-0">
        {children}
      </main>
    </div>
  );
};
