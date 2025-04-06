
import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "./pages/NotFound";
import MarketplaceSearch from "./pages/marketplace/search";
import SearchResultsPage from "./pages/search/SearchResultsPage";
import Business from "./pages/Business";
import BusinessDetails from "./pages/BusinessDetails";
import { lazy, Suspense } from "react";
import { LoadingView } from "@/components/LoadingView";

// Lazily loaded components
const Marketplace = lazy(() => import("@/pages/Marketplace"));
const Auth = lazy(() => import("@/pages/Auth"));
const Events = lazy(() => import("@/pages/Events"));
const Jobs = lazy(() => import("@/pages/Jobs"));
const CategoryPage = lazy(() => import("@/pages/marketplace/CategoryPage"));
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
const OrderSuccess = lazy(() => import("@/pages/order-success"));
const AdDashboard = lazy(() => import("@/pages/admin/AdDashboard"));
const AdAnalytics = lazy(() => import("@/pages/admin/AdAnalytics"));
const AdPlacement = lazy(() => import("@/pages/admin/AdPlacement"));
const AdAuction = lazy(() => import("@/pages/admin/AdAuction"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const BusinessRegistrationForm = lazy(() => import("@/components/business-registration/BusinessRegistrationForm").then(m => ({ default: m.BusinessRegistrationForm })));

// This function wraps each component with Suspense
const withSuspense = (Component) => {
  return (
    <Suspense fallback={<LoadingView />}>
      <Component />
    </Suspense>
  );
};

// This file includes route definitions for the application
const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(Marketplace)
  },
  {
    path: "/auth",
    element: withSuspense(Auth)
  },
  {
    path: "/events",
    element: withSuspense(Events)
  },
  {
    path: "/jobs",
    element: withSuspense(Jobs)
  },
  {
    path: "/marketplace",
    element: withSuspense(Marketplace)
  },
  {
    path: "/marketplace/category/:categoryId",
    element: withSuspense(CategoryPage)
  },
  {
    path: "/marketplace/category/:categoryId/:subcategoryId",
    element: withSuspense(CategoryPage)
  },
  {
    path: "/marketplace/search",
    element: <MarketplaceSearch />
  },
  {
    path: "/products",
    element: withSuspense(Marketplace)
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
    element: withSuspense(BusinessRegistrationForm)
  },
  {
    path: "/products/:id",
    element: withSuspense(ProductDetails)
  },
  {
    path: "/product/:id",
    element: withSuspense(ProductDetails)
  },
  {
    path: "/services",
    element: withSuspense(Services)
  },
  {
    path: "/services/:id",
    element: withSuspense(ServiceDetails)
  },
  {
    path: "/profile",
    element: withSuspense(Profile)
  },
  {
    path: "/profile/:id",
    element: withSuspense(Profile)
  },
  {
    path: "/settings",
    element: withSuspense(Settings)
  },
  {
    path: "/settings/pricing",
    element: withSuspense(Pricing)
  },
  {
    path: "/pricing",
    element: withSuspense(Pricing)
  },
  {
    path: "/wishlist",
    element: withSuspense(Wishlist)
  },
  {
    path: "/maps",
    element: withSuspense(Maps)
  },
  {
    path: "/communities",
    element: withSuspense(Communities)
  },
  {
    path: "/messages/*",
    element: withSuspense(MessagesPage)
  },
  {
    path: "/messages",
    element: withSuspense(MessagesPage)
  },
  {
    path: "/search",
    element: withSuspense(Search)
  },
  {
    path: "/orders",
    element: withSuspense(Orders)
  },
  {
    path: "/checkout",
    element: withSuspense(Checkout)
  },
  {
    path: "/order-success",
    element: withSuspense(OrderSuccess)
  },
  {
    path: "/admin/ads",
    element: withSuspense(AdDashboard)
  },
  {
    path: "/admin/analytics",
    element: withSuspense(AdAnalytics)
  },
  {
    path: "/admin/placement",
    element: withSuspense(AdPlacement)
  },
  {
    path: "/admin/auction",
    element: withSuspense(AdAuction)
  },
  {
    path: "/dashboard",
    element: withSuspense(Dashboard)
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);

export default router;
