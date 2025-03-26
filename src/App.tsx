
import { Route, Routes, BrowserRouter, Outlet, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Business from "./pages/Business";
import BusinessDetails from "./pages/BusinessDetails";
import Settings from "./pages/Settings";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Maps from "./pages/Maps";
import Events from "./pages/Events";
import Orders from "./pages/orders";
import Messages from "./pages/messages";
import Communities from "./pages/Communities";
import Checkout from "./pages/checkout";
import Search from "./pages/search";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import Jobs from "./pages/Jobs";
import AdminIndex from "./pages/admin";
import AdminApiDemo from "./pages/admin/AdminApiDemo";
import AdDashboard from "./pages/admin/AdDashboard";
import AdPlacement from "./pages/admin/AdPlacement";
import AdAuction from "./pages/admin/AdAuction";
import AdAnalytics from "./pages/admin/AdAnalytics";
import { NotFound } from "./components/NotFound";
import BusinessDashboard from "./pages/BusinessDashboard";
import GenericPage from "./pages/GenericPage";
import { Layout } from "./components/layout/Layout";
import { ThemeProvider } from "./components/ThemeProvider";
import "./App.css";

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1, // Reduce retries to avoid excessive requests
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Outlet /></Layout>}>
              <Route index element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              <Route path="/businesses" element={<Business />} />
              <Route path="/businesses/:id" element={<BusinessDetails />} />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business-dashboard"
                element={
                  <ProtectedRoute>
                    <BusinessDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/maps" element={<Maps />} />
              <Route path="/events" element={<Events />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/messages/*" element={<Messages />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/search" element={<Search />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/admin" element={<AdminIndex />} />
              <Route path="/admin/api-demo" element={<AdminApiDemo />} />
              <Route path="/admin/ad-dashboard" element={<AdDashboard />} />
              <Route path="/admin/ad-placement" element={<AdPlacement />} />
              <Route path="/admin/ad-auction" element={<AdAuction />} />
              <Route path="/admin/ad-analytics" element={<AdAnalytics />} />
              <Route path="/contact" element={<GenericPage title="Contact" />} />
              <Route path="/about" element={<GenericPage title="About" />} />
              <Route path="/faq" element={<GenericPage title="FAQ" />} />
              <Route path="/terms" element={<GenericPage title="Terms of Service" />} />
              <Route path="/privacy" element={<GenericPage title="Privacy Policy" />} />
              
              {/* Add a catch-all route for deployment previews */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
