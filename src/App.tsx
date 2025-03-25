
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
