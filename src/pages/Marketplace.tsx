
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { MarketplaceProvider } from "@/providers/MarketplaceProvider";

const Marketplace = () => {
  return (
    <Layout>
      <MarketplaceProvider>
        {/* Marketplace content will be redesigned */}
        <div className="container max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Marketplace (Under Redesign)</h1>
        </div>
      </MarketplaceProvider>
    </Layout>
  );
};

export default Marketplace;
