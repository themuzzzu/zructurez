
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { NotFound } from "@/components/NotFound";
import { useParams } from "react-router-dom";
import { LikeProvider } from "@/components/products/LikeContext";

// Import components directly to avoid dynamic import issues
import MarketplaceIndex from "./marketplace/index";

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
          <MarketplaceIndex />
        </LikeProvider>
      </div>
    </Layout>
  );
};

export default Marketplace;
