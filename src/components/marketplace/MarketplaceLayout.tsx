
import React from "react";
import { Layout } from "@/components/layout/Layout";

interface MarketplaceLayoutProps {
  children: React.ReactNode;
}

export const MarketplaceLayout = ({ children }: MarketplaceLayoutProps) => {
  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-6 space-y-8">
        {children}
      </div>
    </Layout>
  );
};
