
import { Layout } from "@/components/layout/Layout";
import { SearchHero } from "@/components/home/SearchHero";
import { PopularCategories } from "@/components/home/PopularCategories";
import { TopRatedBusinesses } from "@/components/home/TopRatedBusinesses";
import { FeaturedBusinesses } from "@/components/home/FeaturedBusinesses";
import { ServiceCategoryScroller } from "@/components/services/ServiceCategoryScroller";
import { TrendingServices } from "@/components/home/TrendingServices";
import { DealsSection } from "@/components/home/DealsSection";
import { QuickAccessServices } from "@/components/home/QuickAccessServices";
import { BusinessCategoryScroller } from "@/components/home/BusinessCategoryScroller";
import { NotificationPermission } from "@/components/notifications/NotificationPermission";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 space-y-10 pb-16 max-w-7xl">
        {/* Notification Permission Component - only show when user is logged in */}
        {user && <NotificationPermission className="mb-6" />}
        
        {/* Hero Section */}
        <SearchHero />
        
        {/* Business Categories Scroller - Horizontal scroll layout */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Explore Businesses</h2>
          <BusinessCategoryScroller />
        </section>
        
        {/* Browse Services */}
        <section>
          <ServiceCategoryScroller />
        </section>
        
        {/* Popular Categories */}
        <PopularCategories />
        
        {/* Top Rated Businesses */}
        <TopRatedBusinesses />
        
        {/* Featured Businesses */}
        <FeaturedBusinesses />
        
        {/* Trending Services */}
        <TrendingServices />
        
        {/* Deals Section */}
        <DealsSection />
        
        {/* Quick Access Services */}
        <QuickAccessServices />
      </div>
    </Layout>
  );
}
