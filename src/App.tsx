import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

// Pages
import Index from "@/pages/Index";
import Marketplace from "@/pages/Marketplace";
import Auth from "@/pages/Auth";
import ProductDetails from "@/pages/ProductDetails";
import ServiceDetails from "@/pages/ServiceDetails";
import Services from "@/pages/Services";
import Profile from "@/pages/Profile";
import Wishlist from "@/pages/Wishlist";
import Settings from "@/pages/Settings";
import BusinessDetails from "@/pages/BusinessDetails";
import Business from "@/pages/Business";
import Events from "@/pages/Events";
import Communities from "@/pages/Communities";
import Messages from "@/pages/Messages";
import OrdersPage from "@/pages/OrdersPage";
import CheckoutPage from "@/pages/CheckoutPage";
import SearchPage from "@/pages/SearchPage";
import Jobs from "@/pages/Jobs";
import Maps from "@/pages/Maps";
import GenericPage from "@/pages/GenericPage";
import BusinessDashboard from "@/pages/BusinessDashboard";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            <Route path="/services" element={<Services />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/businesses/:id" element={<BusinessDetails />} />
            <Route path="/businesses" element={<Business />} />
            <Route path="/events" element={<Events />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/generic-page" element={<GenericPage />} />
            <Route path="/business-dashboard" element={<BusinessDashboard />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Admin Dashboard</div>} />
      <Route path="/users" element={<div>User Management</div>} />
      <Route path="/products" element={<div>Product Management</div>} />
      <Route path="/orders" element={<div>Order Management</div>} />
      <Route path="/analytics" element={<div>Analytics Dashboard</div>} />
      <Route path="/settings" element={<div>Admin Settings</div>} />
    </Routes>
  );
};
