
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Marketplace from "@/pages/Marketplace";
import ProductDetails from "@/pages/ProductDetails";
import SearchPage from "@/pages/search";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import AdDashboard from "./pages/admin/AdDashboard";
import AdAuction from "./pages/admin/AdAuction";
import AdPlacement from "./pages/admin/AdPlacement";
import AdAnalytics from "./pages/admin/AdAnalytics";
import Services from "./pages/Services";
import Maps from "./pages/Maps";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { NotFound } from "./components/NotFound";
import GenericPage from "./pages/GenericPage";
import { lazy, Suspense } from "react";
import { LoadingView } from "./components/LoadingView";

// Lazy load some components to improve initial load time
const Messages = lazy(() => import("./pages/messages"));
const Business = lazy(() => import("./pages/Business"));
const Events = lazy(() => import("./pages/Events"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Communities = lazy(() => import("./pages/Communities"));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Index />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/product/:productId" element={<ProductDetails />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/admin/ads" element={<AdDashboard />} />
      <Route path="/admin/ad-auction" element={<AdAuction />} />
      <Route path="/admin/ad-placement" element={<AdPlacement />} />
      <Route path="/admin/ad-analytics" element={<AdAnalytics />} />
      <Route path="/services" element={<Services />} />
      <Route path="/maps" element={<Maps />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />
      
      {/* Lazy loaded routes */}
      <Route 
        path="/messages/*" 
        element={
          <Suspense fallback={<LoadingView />}>
            <Messages />
          </Suspense>
        } 
      />
      <Route 
        path="/business" 
        element={
          <Suspense fallback={<LoadingView />}>
            <Business />
          </Suspense>
        } 
      />
      <Route 
        path="/events" 
        element={
          <Suspense fallback={<LoadingView />}>
            <Events />
          </Suspense>
        } 
      />
      <Route 
        path="/jobs" 
        element={
          <Suspense fallback={<LoadingView />}>
            <Jobs />
          </Suspense>
        } 
      />
      <Route 
        path="/communities" 
        element={
          <Suspense fallback={<LoadingView />}>
            <Communities />
          </Suspense>
        } 
      />
      
      {/* Generic placeholder pages for unimplemented routes */}
      <Route path="*" element={<NotFound />} />
    </>
  )
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
