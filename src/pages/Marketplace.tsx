
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { NotFound } from "@/components/NotFound";
import { useParams } from "react-router-dom";
import { LikeProvider } from "@/components/products/LikeContext";

// Import the Marketplace component from the correct location 
const OptimizedMarketplace = React.lazy(() => import("./marketplace/OptimizedMarketplace"));

const Marketplace = () => {
  const params = useParams();
  
  // If we have a productId parameter, show a 404 since the route should be /product/:productId
  if (params.productId) {
    return <NotFound />;
  }
  
  // Render the marketplace with the proper layout and LikeProvider
  return (
    <Layout>
      <div className="overflow-x-hidden">
        <LikeProvider>
          <React.Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
            <OptimizedMarketplace />
          </React.Suspense>
        </LikeProvider>
      </div>
    </Layout>
  );
};

export default Marketplace;
