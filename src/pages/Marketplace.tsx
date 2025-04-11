
import React, { Suspense, lazy } from "react";
import { Layout } from "@/components/layout/Layout";
import { NotFound } from "@/components/NotFound";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { trackPageLoad } from "@/utils/performanceUtils";
import { useEffect } from "react";

// Lazy load the marketplace component
const OptimizedMarketplace = lazy(() => 
  import("./marketplace/OptimizedMarketplace").then(module => {
    console.log("OptimizedMarketplace component loaded");
    return module;
  })
);

// Loading Placeholder
const MarketplaceSkeleton = () => (
  <div className="space-y-4 w-full">
    <Skeleton className="h-12 w-full max-w-3xl mx-auto rounded-lg" />
    <Skeleton className="h-64 w-full rounded-lg" />
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-40 rounded-md w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  </div>
);

const Marketplace = () => {
  const params = useParams();
  
  // Track page load performance
  useEffect(() => {
    trackPageLoad('/marketplace');
    
    // Preload critical resources
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = '/lovable-uploads/a727b8a0-84a4-45b2-88da-392010b1b66c.png';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  // If we have a productId parameter, show a 404 since the route should be /product/:productId
  if (params.productId) {
    return <NotFound />;
  }
  
  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-1 sm:px-4 pt-3 sm:pt-6 pb-16 overflow-visible">
        <Suspense fallback={<MarketplaceSkeleton />}>
          <OptimizedMarketplace />
        </Suspense>
      </div>
    </Layout>
  );
};

export default Marketplace;
