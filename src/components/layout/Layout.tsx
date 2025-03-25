
import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { AIAssistant } from "@/components/ai-support/AIAssistant";
import { SmartNotificationAgent } from "@/components/ai-notifications/SmartNotificationAgent";

interface LayoutProps {
  children: ReactNode;
  hideSidebar?: boolean;
}

export const Layout = ({ children, hideSidebar = false }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        {!hideSidebar && (
          <Sidebar />
        )}
        <main className="flex-1">
          {children}
        </main>
      </div>
      
      {/* AI Components */}
      <AIAssistant />
      <SmartNotificationAgent />
    </div>
  );
};
