
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

// Better loading placeholder with reduced padding on mobile
const MarketplaceSkeleton = () => (
  <div className="space-y-3 w-full px-1 sm:px-4">
    <Skeleton className="h-10 w-full max-w-3xl mx-auto rounded-lg" />
    <Skeleton className="h-56 w-full rounded-lg" />
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-1">
          <Skeleton className="h-36 rounded-md w-full" />
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
    
    // Preload critical resources and images for faster loading
    const resources = [
      '/lovable-uploads/a727b8a0-84a4-45b2-88da-392010b1b66c.png',
      '/lovable-uploads/c395d99e-dcf4-4659-9c50-fc50708c858d.png'
    ];
    
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = resource;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    });
  }, []);
  
  // If we have a productId parameter, show a 404 since the route should be /product/:productId
  if (params.productId) {
    return <NotFound />;
  }
  
  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-1 sm:px-4 pt-2 sm:pt-6 pb-16 overflow-visible">
        <Suspense fallback={<MarketplaceSkeleton />}>
          <OptimizedMarketplace />
        </Suspense>
      </div>
    </Layout>
  );
};

export default Marketplace;
