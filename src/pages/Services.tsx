
import React, { useState, useEffect, Suspense } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProductGrid } from "@/components/products/ProductsGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCardSkeleton } from "@/components/ShoppingCardSkeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LikeProvider } from "@/components/products/LikeContext";
import { LoadingView } from "@/components/LoadingView";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Mock data for services
const mockServices = [
  {
    id: "service-1",
    title: "Professional Cleaning",
    description: "Comprehensive cleaning services for homes and offices",
    price: 2500,
    image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80",
    category: "home",
    rating: 4.5,
    rating_count: 38,
    created_at: new Date().toISOString()
  },
  {
    id: "service-2",
    title: "Plumbing Services",
    description: "Expert plumbing repair and installation",
    price: 1200,
    image_url: "https://images.unsplash.com/photo-1606321022034-31968bb41e4c?auto=format&fit=crop&w=300&q=80",
    category: "home",
    rating: 4.7,
    rating_count: 42,
    created_at: new Date().toISOString()
  },
  {
    id: "service-3",
    title: "Electrical Repairs",
    description: "Residential and commercial electrical services",
    price: 1500,
    image_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80",
    category: "home",
    rating: 4.6,
    rating_count: 29,
    created_at: new Date().toISOString()
  },
  {
    id: "service-4",
    title: "Interior Design",
    description: "Transform your space with professional design services",
    price: 5000,
    image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=300&q=80",
    category: "home",
    rating: 4.8,
    rating_count: 56,
    created_at: new Date().toISOString()
  }
];

const Services = () => {
  const [gridLayout, setGridLayout] = useState<GridLayoutType>("grid3x3");
  const [initialized, setInitialized] = useState(false);

  // Initialize layout from localStorage
  useEffect(() => {
    try {
      const savedLayout = localStorage.getItem('serviceGridLayout') as GridLayoutType | null;
      if (savedLayout && ["grid2x2", "grid3x3", "grid4x4", "grid1x1"].includes(savedLayout)) {
        setGridLayout(savedLayout);
      }
      setInitialized(true);
    } catch (error) {
      console.error("Error initializing layout:", error);
      setInitialized(true);
    }
  }, []);

  // Use React Query with fallback to mock data
  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*');

        if (error) {
          console.error('Error fetching services:', error);
          return mockServices; // Return mock data on error
        }

        return data && data.length > 0 ? data : mockServices;
      } catch (err) {
        console.error("Fetch error:", err);
        return mockServices; // Return mock data on error
      }
    },
    staleTime: 60000, // 1 minute
    enabled: initialized, // Only run query when component is initialized
  });

  const handleLayoutChange = (newLayout: GridLayoutType) => {
    try {
      setGridLayout(newLayout);
      localStorage.setItem('serviceGridLayout', newLayout);
    } catch (error) {
      console.error("Error saving layout:", error);
    }
  };

  return (
    <Layout>
      <ErrorBoundary fallback={
        <div className="container mx-auto py-10 text-center">
          <h1 className="text-3xl font-bold mb-6">Services</h1>
          <p className="text-red-500 mb-4">There was an error loading the services page.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      }>
        <Suspense fallback={<LoadingView />}>
          <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Our Services</h1>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array(6).fill(null).map((_, i) => (
                  <ShoppingCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-red-500">Error loading services.</div>
            ) : (
              <LikeProvider>
                <ProductGrid
                  products={services}
                  layout={gridLayout}
                  onLayoutChange={handleLayoutChange}
                />
              </LikeProvider>
            )}
          </div>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

export default Services;
