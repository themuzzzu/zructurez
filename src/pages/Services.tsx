
import React, { useState, useEffect, Suspense } from "react";
import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GridLayoutType } from "@/components/products/types/ProductTypes";
import { ServiceCategoryGrid } from "@/components/services/ServiceCategoryGrid";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ServiceRankings } from "@/components/rankings/ServiceRankings";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingView } from "@/components/LoadingView";
import { LocalBusinessSpotlight } from "@/components/marketplace/LocalBusinessSpotlight";
import { TrendingServicesSection } from "@/components/services/TrendingServicesSection";
import { AutoScrollingBannerAd } from "@/components/ads/AutoScrollingBannerAd";
import { useAdBanners } from "@/hooks/useAdBanners";
import { SponsoredServices } from "@/components/services/SponsoredServices";
import { RecommendedServices } from "@/components/services/RecommendedServices";

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
  },
  {
    id: "service-5",
    title: "Lawn Care",
    description: "Professional lawn maintenance and landscaping",
    price: 1800,
    image_url: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=300&q=80",
    category: "outdoor",
    rating: 4.4,
    rating_count: 31,
    created_at: new Date().toISOString()
  },
  {
    id: "service-6",
    title: "IT Support",
    description: "Technical support for all your computer needs",
    price: 3500,
    image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=300&q=80",
    category: "tech",
    rating: 4.9,
    rating_count: 48,
    created_at: new Date().toISOString()
  }
];

const Services = () => {
  const navigate = useNavigate();
  const [gridLayout, setGridLayout] = useState<GridLayoutType>("grid3x3");
  const [initialized, setInitialized] = useState(false);
  const { ads: bannerAds } = useAdBanners("service", "banner", 3);

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

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*');

        if (error) {
          console.error('Error fetching services:', error);
          return mockServices;
        }

        return data && data.length > 0 ? data : mockServices;
      } catch (err) {
        console.error("Fetch error:", err);
        return mockServices;
      }
    },
    staleTime: 60000,
    enabled: initialized,
    retry: 1,
    retryDelay: 1000,
  });

  const handleLayoutChange = (newLayout: GridLayoutType) => {
    try {
      setGridLayout(newLayout);
      localStorage.setItem('serviceGridLayout', newLayout);
    } catch (error) {
      console.error("Error saving layout:", error);
    }
  };

  const handleCreateService = () => {
    navigate('/create-service');
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
          <div className="container mx-auto py-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Services Marketplace</h1>
              <Button onClick={handleCreateService} className="mt-4 md:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Create Service
              </Button>
            </div>

            {/* Banner Ad Carousel */}
            <div className="mb-8">
              <AutoScrollingBannerAd ads={bannerAds} />
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Browse Categories</h2>
              <ServiceCategoryGrid />
            </div>

            {/* Sponsored Services Section */}
            <div className="mb-8">
              <SponsoredServices limit={4} showTitle={true} />
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Featured Service Providers</h2>
                <Button variant="outline" onClick={() => navigate('/businesses')}>
                  View All
                </Button>
              </div>
              <LocalBusinessSpotlight />
            </div>

            <div className="mb-8">
              <TrendingServicesSection />
            </div>

            {/* Recommended Services */}
            <div className="mb-8">
              <RecommendedServices limit={4} showTitle={true} />
            </div>

            <div className="mb-8">
              <ServiceGrid 
                services={services || []} 
                isLoading={isLoading}
                layout={gridLayout}
                onLayoutChange={handleLayoutChange}
              />
            </div>

            <div className="mb-8">
              <ServiceRankings />
            </div>
          </div>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

export default Services;
