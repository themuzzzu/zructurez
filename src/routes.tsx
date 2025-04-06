
import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "./pages/NotFound";
import MarketplaceSearch from "./pages/marketplace/search";
import SearchResultsPage from "./pages/search/SearchResultsPage";
import Business from "./pages/Business";
import BusinessDetails from "./pages/BusinessDetails";
import { lazy, Suspense } from "react";
import { LoadingView } from "@/components/LoadingView";
import Index from "./pages/Index";

// Use more reliable dynamic imports with error boundaries
const lazyImport = (importFn) => {
  const Component = lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      console.error("Error loading component:", error);
      return { default: () => <LoadingView text="Failed to load component. Please refresh." /> };
    }
  });
  
  return (props) => (
    <Suspense fallback={<LoadingView />}>
      <Component {...props} />
    </Suspense>
  );
};

// Lazily loaded components with error handling
const Marketplace = lazyImport(() => import("@/pages/Marketplace"));
const Auth = lazyImport(() => import("@/pages/Auth"));
const Events = lazyImport(() => import("@/pages/Events"));
const Jobs = lazyImport(() => import("@/pages/Jobs"));
const CategoryPage = lazyImport(() => import("@/pages/marketplace/CategoryPage"));
const ProductDetails = lazyImport(() => import("@/pages/ProductDetails"));
const Services = lazyImport(() => import("@/pages/Services"));
const ServiceDetails = lazyImport(() => import("@/pages/ServiceDetails"));
const Profile = lazyImport(() => import("@/pages/Profile"));
const Settings = lazyImport(() => import("@/pages/Settings"));
const Wishlist = lazyImport(() => import("@/pages/Wishlist"));
const Maps = lazyImport(() => import("@/pages/Maps"));
const Communities = lazyImport(() => import("@/pages/Communities"));
const MessagesPage = lazyImport(() => import("@/pages/messages"));
const Search = lazyImport(() => import("@/pages/search"));
const Orders = lazyImport(() => import("@/pages/orders"));
const Checkout = lazyImport(() => import("@/pages/checkout"));
const OrderSuccess = lazyImport(() => import("@/pages/order-success"));
const AdDashboard = lazyImport(() => import("@/pages/admin/AdDashboard"));
const AdAnalytics = lazyImport(() => import("@/pages/admin/AdAnalytics"));
const AdPlacement = lazyImport(() => import("@/pages/admin/AdPlacement"));
const AdAuction = lazyImport(() => import("@/pages/admin/AdAuction"));
const Dashboard = lazyImport(() => import("@/pages/dashboard"));
const Pricing = lazyImport(() => import("@/pages/Pricing"));
const BusinessRegistrationForm = lazyImport(() => 
  import("@/components/business-registration/BusinessRegistrationForm").then(m => ({ default: () => <m.BusinessRegistrationForm /> }))
);

// This file includes route definitions for the application
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/events",
    element: <Events />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/marketplace",
    element: <Marketplace />
  },
  {
    path: "/marketplace/category/:categoryId",
    element: <CategoryPage />
  },
  {
    path: "/marketplace/category/:categoryId/:subcategoryId",
    element: <CategoryPage />
  },
  {
    path: "/marketplace/search",
    element: <MarketplaceSearch />
  },
  {
    path: "/products",
    element: <Marketplace />
  },
  {
    path: "/businesses",
    element: <Business />
  },
  {
    path: "/businesses/:id",
    element: <BusinessDetails />
  },
  {
    path: "/register-business",
    element: <BusinessRegistrationForm />
  },
  {
    path: "/products/:id",
    element: <ProductDetails />
  },
  {
    path: "/product/:id",
    element: <ProductDetails />
  },
  {
    path: "/services",
    element: <Services />
  },
  {
    path: "/services/:id",
    element: <ServiceDetails />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/profile/:id",
    element: <Profile />
  },
  {
    path: "/settings",
    element: <Settings />
  },
  {
    path: "/settings/pricing",
    element: <Pricing />
  },
  {
    path: "/pricing",
    element: <Pricing />
  },
  {
    path: "/wishlist",
    element: <Wishlist />
  },
  {
    path: "/maps",
    element: <Maps />
  },
  {
    path: "/communities",
    element: <Communities />
  },
  {
    path: "/messages/*",
    element: <MessagesPage />
  },
  {
    path: "/messages",
    element: <MessagesPage />
  },
  {
    path: "/search",
    element: <Search />
  },
  {
    path: "/orders",
    element: <Orders />
  },
  {
    path: "/checkout",
    element: <Checkout />
  },
  {
    path: "/order-success",
    element: <OrderSuccess />
  },
  {
    path: "/admin/ads",
    element: <AdDashboard />
  },
  {
    path: "/admin/analytics",
    element: <AdAnalytics />
  },
  {
    path: "/admin/placement",
    element: <AdPlacement />
  },
  {
    path: "/admin/auction",
    element: <AdAuction />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);

export default router;
