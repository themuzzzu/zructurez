
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";

import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Events from "@/pages/Events";
import Jobs from "@/pages/Jobs";
import Marketplace from "@/pages/Marketplace";
import Business from "@/pages/Business";
import BusinessDetails from "@/pages/BusinessDetails";
import ProductDetails from "@/pages/ProductDetails";
import Services from "@/pages/Services";
import ServiceDetails from "@/pages/ServiceDetails";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Wishlist from "@/pages/Wishlist";
import Maps from "@/pages/Maps";
import Communities from "@/pages/Communities";
import { Messages } from "@/pages/messages/Messages";
import Search from "@/pages/search";
import Orders from "@/pages/orders";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/NotFound";
import AdDashboard from "@/pages/admin/AdDashboard";
import AdAnalytics from "@/pages/admin/AdAnalytics";
import AdPlacement from "@/pages/admin/AdPlacement";
import AdAuction from "@/pages/admin/AdAuction";
import { BusinessRegistrationForm } from "@/components/business-registration/BusinessRegistrationForm";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = new QueryClient();

  setTimeout(() => {
    setIsLoading(false);
  }, 1500);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="lovable-theme">
        <div className={isLoading ? "hidden" : "app"}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/events" element={<Events />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/*" element={<Marketplace />} />
            <Route path="/businesses" element={<Business />} />
            <Route path="/businesses/:id" element={<BusinessDetails />} />
            <Route path="/register-business" element={<BusinessRegistrationForm />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/messages/*" element={<Messages />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/search" element={<Search />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/ads" element={<AdDashboard />} />
            <Route path="/admin/analytics" element={<AdAnalytics />} />
            <Route path="/admin/placement" element={<AdPlacement />} />
            <Route path="/admin/auction" element={<AdAuction />} />
            <Route path="/dashboard" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
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
