
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { TrendingServicesSection } from "@/components/services/TrendingServicesSection";
import { ServiceBannerAd } from "@/components/ads/ServiceBannerAd";
import { ServiceCategoryFilter } from "@/components/ServiceCategoryFilter";
import { SponsoredServices } from "@/components/services/SponsoredServices";
import { RecommendedServices } from "@/components/services/RecommendedServices";
import { SuggestedServices } from "@/components/services/SuggestedServices";

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Services</h1>
        
        {/* Service Banner Ad */}
        <div className="mb-8">
          <ServiceBannerAd />
        </div>
        
        {/* Service Category Filter */}
        <div className="mb-8">
          <ServiceCategoryFilter onCategoryChange={handleCategoryChange} />
        </div>
        
        {/* Sponsored Services */}
        <div className="mb-8">
          <SponsoredServices />
        </div>
        
        {/* Recommended Services */}
        <div className="mb-8">
          <RecommendedServices />
        </div>
        
        {/* Suggested Services */}
        <div className="mb-8">
          <SuggestedServices />
        </div>
        
        {/* Trending Services */}
        <div className="mb-8">
          <TrendingServicesSection />
        </div>
      </div>
    </Layout>
  );
};

export default Services;
