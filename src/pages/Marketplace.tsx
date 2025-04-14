import React, { Suspense, lazy, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { NotFound } from "@/components/NotFound";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { trackPageLoad } from "@/utils/performanceUtils";
import { ErrorView } from "@/components/ErrorView";

// Load optimized marketplace with proper error handling
const OptimizedMarketplace = lazy(() => 
  import("./marketplace/OptimizedMarketplace").then(module => {
    console.log("OptimizedMarketplace component loaded successfully");
    return module;
  }).catch(error => {
    console.error("Failed to load OptimizedMarketplace:", error);
    return { default: () => <ErrorView message="Failed to load marketplace content. Please try again." /> };
  })
);

// Load sponsored products with proper error handling
const SponsoredProducts = lazy(() => 
  import("@/components/marketplace/SponsoredProducts").then(module => {
    console.log("SponsoredProducts component loaded successfully");
    return module;
  }).catch(error => {
    console.error("Failed to load SponsoredProducts:", error);
    return { default: () => <div className="py-4 text-center text-muted-foreground">Sponsored content unavailable</div> };
  })
);

// Better loading placeholder with reduced padding on mobile
const MarketplaceSkeleton = () => (
  <div className="space-y-2 w-full px-1 sm:px-4">
    <Skeleton className="h-10 w-full max-w-3xl mx-auto rounded-lg" />
    <Skeleton className="h-48 w-full rounded-lg" />
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-1">
          <Skeleton className="h-32 rounded-md w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  </div>
);

// Simple error boundary component
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback: React.ReactNode;
}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error("Error in marketplace component:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const Marketplace = () => {
  const params = useParams();
  
  // Track page load performance and preload resources
  useEffect(() => {
    trackPageLoad('/marketplace');
    
    // Preload critical resources and images for faster loading
    const resources = [
      '/lovable-uploads/a727b8a0-84a4-45b2-88da-392010b1b66c.png',
      '/lovable-uploads/c395d99e-dcf4-4659-9c50-fc50708c858d.png'
    ];
    
    // Create and add preload links for critical resources
    const links = resources.map(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = resource;
      link.fetchPriority = 'high';
      return link;
    });
    
    // Add links to document head
    links.forEach(link => document.head.appendChild(link));
    
    return () => {
      // Remove links on component unmount
      links.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, []);
  
  // If we have a productId parameter, show a 404 since the route should be /product/:productId
  if (params.productId) {
    return <NotFound />;
  }
  
  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-1 sm:px-4 pt-2 sm:pt-6 pb-16 overflow-visible">
        <Suspense fallback={<MarketplaceSkeleton />}>
          <ErrorBoundary fallback={<ErrorView message="There was a problem loading the marketplace. Please try again later." />}>
            <OptimizedMarketplace />
          </ErrorBoundary>
        </Suspense>
        
        {/* Add sponsored products section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Sponsored Products</h2>
          <Suspense fallback={<MarketplaceSkeleton />}>
            <ErrorBoundary fallback={<div className="py-4 text-center text-muted-foreground">
              Sponsored products unavailable at the moment
            </div>}>
              <SponsoredProducts />
            </ErrorBoundary>
          </Suspense>
        </div>
      </div>
    </Layout>
  );
};

export default Marketplace;
