
import React, { useState, Suspense } from "react";
import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingView } from "@/components/LoadingView";
import { AutoScrollingBannerAd } from "@/components/ads/AutoScrollingBannerAd";
import { useAdBanners } from "@/hooks/useAdBanners";
import { SponsoredBusinesses } from "@/components/business/SponsoredBusinesses";
import { RecommendedBusinesses } from "@/components/business/RecommendedBusinesses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessCard } from "@/components/BusinessCard";
import { Skeleton } from "@/components/ui/skeleton";

const Businesses = () => {
  const navigate = useNavigate();
  const { ads: bannerAds } = useAdBanners("business", "banner", 3);
  
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching businesses:', error);
          return [];
        }

        return data || [];
      } catch (err) {
        console.error("Fetch error:", err);
        return [];
      }
    },
    staleTime: 60000,
  });

  const handleCreateBusiness = () => {
    navigate('/create-business');
  };

  return (
    <Layout>
      <ErrorBoundary fallback={
        <div className="container mx-auto py-10 text-center">
          <h1 className="text-3xl font-bold mb-6">Businesses</h1>
          <p className="text-red-500 mb-4">There was an error loading the businesses page.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      }>
        <Suspense fallback={<LoadingView />}>
          <div className="container mx-auto py-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Business Directory</h1>
              <Button onClick={handleCreateBusiness} className="mt-4 md:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                List Your Business
              </Button>
            </div>

            {/* Banner Ad Carousel */}
            <div className="mb-8">
              <AutoScrollingBannerAd ads={bannerAds} />
            </div>

            {/* Sponsored Businesses Section */}
            <div className="mb-8">
              <SponsoredBusinesses limit={4} showTitle={true} />
            </div>

            {/* Recommended Businesses */}
            <div className="mb-8">
              <RecommendedBusinesses limit={4} showTitle={true} />
            </div>

            {/* All Businesses */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>All Businesses</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, index) => (
                      <div key={index} className="space-y-2">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {businesses && businesses.length > 0 ? (
                      businesses.map((business) => (
                        <BusinessCard
                          key={business.id}
                          id={business.id}
                          name={business.name}
                          description={business.description}
                          image={business.image_url || ""}
                          category={business.category || ""}
                          location={business.location || ""}
                          rating={4.5} // Default rating
                          reviews={10} // Default reviews count
                          verified={business.verified || false}
                          contact={business.contact || ""}
                          hours={business.hours || ""}
                        />
                      ))
                    ) : (
                      <p className="col-span-full text-center py-8 text-muted-foreground">
                        No businesses found. Be the first to list your business!
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

export default Businesses;
