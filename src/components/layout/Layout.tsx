
import React, { ReactNode } from "react";
import { Navbar } from "../Navbar";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Toaster } from "sonner";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Toaster position="top-right" richColors closeButton />
      </div>
    </QueryClientProvider>
  );
};
