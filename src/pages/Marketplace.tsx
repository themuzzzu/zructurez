
import React, { Suspense, lazy } from "react";
import { Layout } from "@/components/layout/Layout";
import { NotFound } from "@/components/NotFound";
import { useParams } from "react-router-dom";
import { MarketplaceProvider } from "@/providers/MarketplaceProvider";
import { MarketplaceSkeleton } from "@/components/marketplace/MarketplaceSkeleton";

const OptimizedMarketplace = lazy(() => 
  import("./marketplace/OptimizedMarketplace")
);

const Marketplace = () => {
  const params = useParams();
  
  if (params.productId) {
    return <NotFound />;
  }
  
  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 pt-2 sm:pt-6 pb-16">
        <MarketplaceProvider>
          <Suspense fallback={<MarketplaceSkeleton />}>
            <OptimizedMarketplace />
          </Suspense>
        </MarketplaceProvider>
      </div>
    </Layout>
  );
};

export default Marketplace;
