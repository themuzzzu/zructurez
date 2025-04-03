
import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";
import { queryClient, prefetchCommonQueries } from "@/lib/react-query";

// Always loaded components
import { LoadingView } from "@/components/LoadingView";

// Lazily loaded components
const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const Events = lazy(() => import("@/pages/Events"));
const Jobs = lazy(() => import("@/pages/Jobs"));
const Marketplace = lazy(() => import("@/pages/Marketplace"));
const Business = lazy(() => import("@/pages/Business"));
const BusinessDetails = lazy(() => import("@/pages/BusinessDetails"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const Services = lazy(() => import("@/pages/Services"));
const ServiceDetails = lazy(() => import("@/pages/ServiceDetails"));
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));
const Wishlist = lazy(() => import("@/pages/Wishlist"));
const Maps = lazy(() => import("@/pages/Maps"));
const Communities = lazy(() => import("@/pages/Communities"));
const MessagesPage = lazy(() => import("@/pages/messages"));
const Search = lazy(() => import("@/pages/search"));
const Orders = lazy(() => import("@/pages/orders"));
const Checkout = lazy(() => import("@/pages/checkout"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const AdDashboard = lazy(() => import("@/pages/admin/AdDashboard"));
const AdAnalytics = lazy(() => import("@/pages/admin/AdAnalytics"));
const AdPlacement = lazy(() => import("@/pages/admin/AdPlacement"));
const AdAuction = lazy(() => import("@/pages/admin/AdAuction"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const BusinessRegistrationForm = lazy(() => import("@/components/business-registration/BusinessRegistrationForm").then(m => ({ default: m.BusinessRegistrationForm })));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.includes('/auth') && !location.pathname.includes('/wishlist')) {
      sessionStorage.setItem('previousPath', location.pathname + location.search);
    }
    
    // Prefetch data for common queries
    prefetchCommonQueries().catch(console.error);
  }, [location]);

  // Reduce initial loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Reduced from 1500ms
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="lovable-theme">
        <div className={isLoading ? "hidden" : "app"}>
          <Suspense fallback={<LoadingView />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/events" element={<Events />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/marketplace/*" element={<Marketplace />} />
              <Route path="/products" element={<Marketplace />} />
              <Route path="/businesses" element={<Business />} />
              <Route path="/businesses/:id" element={<BusinessDetails />} />
              <Route path="/register-business" element={<BusinessRegistrationForm />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/maps" element={<Maps />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/messages/*" element={<MessagesPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/search" element={<Search />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin/ads" element={<AdDashboard />} />
              <Route path="/admin/analytics" element={<AdAnalytics />} />
              <Route path="/admin/placement" element={<AdPlacement />} />
              <Route path="/admin/auction" element={<AdAuction />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
        {isLoading && (
          <div className="flex flex-col space-y-4 items-center justify-center min-h-screen">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="animate-pulse">Loading application...</p>
          </div>
        )}
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
