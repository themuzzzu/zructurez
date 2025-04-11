
import { Suspense, lazy } from "react";
import { Layout } from "@/components/layout/Layout";
import { SearchHero } from "@/components/home/SearchHero";
import { PopularCategories } from "@/components/home/PopularCategories";
import { ServiceCategoryScroller } from "@/components/services/ServiceCategoryScroller";
import { BusinessCategoryScroller } from "@/components/business/BusinessCategoryScroller";
import { MarketplaceCategoryScroller } from "@/components/marketplace/MarketplaceCategoryScroller";
import { NotificationPermission } from "@/components/notifications/NotificationPermission";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-loaded components - moved from eager loading to lazy loading
const TopRatedBusinesses = lazy(() => import("@/components/home/TopRatedBusinesses"));
const FeaturedBusinesses = lazy(() => import("@/components/home/FeaturedBusinesses"));
const TrendingServices = lazy(() => import("@/components/home/TrendingServices"));
const DealsSection = lazy(() => import("@/components/home/DealsSection"));
const QuickAccessServices = lazy(() => import("@/components/home/QuickAccessServices"));

// Loading fallback component
const SectionSkeleton = () => (
  <div className="space-y-2 w-full">
    <Skeleton className="h-8 w-1/3" />
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Skeleton className="h-32 rounded-md" />
      <Skeleton className="h-32 rounded-md" />
      <Skeleton className="hidden sm:block h-32 rounded-md" />
      <Skeleton className="hidden sm:block h-32 rounded-md" />
    </div>
  </div>
);

export default function Home() {
  const { user } = useAuth();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 space-y-6 pb-16 max-w-7xl">
        {/* Notification Permission Component - only show when user is logged in */}
        {user && <NotificationPermission className="mb-6" />}
        
        {/* Hero Section */}
        <SearchHero />
        
        {/* Business Categories Scroller - Horizontal scroll layout */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Explore Businesses</h2>
          <BusinessCategoryScroller />
        </section>
        
        {/* Marketplace Categories Scroller - New addition below business categories */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Shop Marketplace</h2>
          <MarketplaceCategoryScroller />
        </section>
        
        {/* Browse Services */}
        <section>
          <ServiceCategoryScroller />
        </section>
        
        {/* Popular Categories */}
        <PopularCategories />
        
        {/* Top Rated Businesses - Now lazy loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <TopRatedBusinesses />
        </Suspense>
        
        {/* Featured Businesses - Now lazy loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <FeaturedBusinesses />
        </Suspense>
        
        {/* Trending Services - Now lazy loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <TrendingServices />
        </Suspense>
        
        {/* Deals Section - Now lazy loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <DealsSection />
        </Suspense>
        
        {/* Quick Access Services - Now lazy loaded */}
        <Suspense fallback={<SectionSkeleton />}>
          <QuickAccessServices />
        </Suspense>
      </div>
    </Layout>
  );
}
