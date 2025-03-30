
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { FormSidebar } from "@/components/business-registration/FormSidebar";
import { BusinessCategoryGrid } from "@/components/home/BusinessCategoryGrid";
import { SearchHero } from "@/components/home/SearchHero";
import { TrendingServices } from "@/components/home/TrendingServices";
import { PopularCategories } from "@/components/home/PopularCategories";
import { FeaturedBusinesses } from "@/components/home/FeaturedBusinesses";
import { LocalAreas } from "@/components/home/LocalAreas";
import { DealsSection } from "@/components/home/DealsSection";
import { QuickAccessServices } from "@/components/home/QuickAccessServices";

export default function Index() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="w-full">
        {/* Hero Section with Search */}
        <SearchHero />
        
        {/* Main Content */}
        <div className="container py-8 mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content Area - 9 columns on large screens */}
            <div className="lg:col-span-9 space-y-10">
              {/* Business Categories Grid */}
              <BusinessCategoryGrid />
              
              {/* Quick Access Services */}
              <QuickAccessServices />
              
              {/* Trending Services */}
              <TrendingServices />
              
              {/* Popular Categories with Horizontal Scroll */}
              <PopularCategories />
              
              {/* Featured Businesses */}
              <FeaturedBusinesses />
              
              {/* Deals & Offers Section */}
              <DealsSection />
            </div>
            
            {/* Sidebar - 3 columns on large screens */}
            <div className="lg:col-span-3 space-y-6">
              {/* Registration CTA */}
              <div className="bg-card rounded-xl shadow-md overflow-hidden">
                <div className="p-5 space-y-4">
                  <h3 className="text-xl font-semibold text-center">Register Your Business</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Join thousands of businesses and get discovered by potential customers.
                  </p>
                  <button 
                    onClick={() => navigate("/register-business")} 
                    className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
              
              {/* Local Areas Section */}
              <LocalAreas />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
