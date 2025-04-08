
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { NotFound } from "@/components/NotFound";
import { useParams } from "react-router-dom";
import { OptimizedMarketplace } from "./marketplace/OptimizedMarketplace";

const Marketplace = () => {
  const params = useParams();
  
  // If we have a productId parameter, show a 404 since the route should be /product/:productId
  if (params.productId) {
    return <NotFound />;
  }
  
  // Render the marketplace with the proper layout - updated padding for better mobile view
  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-2 sm:px-4 py-0 sm:py-4 overflow-visible">
        <OptimizedMarketplace />
      </div>
    </Layout>
  );
};

export default Marketplace;
