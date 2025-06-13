
import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { adminRoutes } from "./adminRoutes";

// Lazy load components
const Auth = lazy(() => import("@/pages/Auth"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
const SettingsPage = lazy(() => import("@/pages/Settings"));
const ShopPage = lazy(() => import("@/pages/Shop"));
const MessagesPage = lazy(() => import("@/pages/Messages"));
const CreatePost = lazy(() => import("@/components/CreatePost"));
const CreateServiceForm = lazy(() => import("@/components/CreateServiceForm"));
const CreateBusinessListing = lazy(() => import("@/components/CreateBusinessListing"));
const BusinessDetails = lazy(() => import("@/pages/BusinessDetails"));
const ServiceDetails = lazy(() => import("@/pages/ServiceDetails"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const SearchResults = lazy(() => import("@/pages/SearchResults"));
const BusinessListings = lazy(() => import("@/pages/BusinessListings"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const CommunityPage = lazy(() => import("@/pages/CommunityPage"));
const AdCreationPage = lazy(() => import("@/pages/AdCreationPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const PerformancePage = lazy(() => import("@/pages/PerformancePage"));
const AppointmentsPage = lazy(() => import("@/pages/AppointmentsPage"));
const RankingsPage = lazy(() => import("@/pages/RankingsPage"));

export const userRoutes: RouteObject[] = [
  ...adminRoutes,
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/profile/:userId?",
    element: <ProfilePage />
  },
  {
    path: "/settings",
    element: <SettingsPage />
  },
  {
    path: "/shop",
    element: <ShopPage />
  },
  {
    path: "/messages",
    element: <MessagesPage />
  },
  {
    path: "/create-post",
    element: <CreatePost />
  },
  {
    path: "/create-service",
    element: <CreateServiceForm />
  },
  {
    path: "/create-business",
    element: <CreateBusinessListing />
  },
  {
    path: "/business/:id",
    element: <BusinessDetails />
  },
  {
    path: "/service/:id",
    element: <ServiceDetails />
  },
  {
    path: "/product/:id",
    element: <ProductDetails />
  },
  {
    path: "/search",
    element: <SearchResults />
  },
  {
    path: "/businesses",
    element: <BusinessListings />
  },
  {
    path: "/services",
    element: <ServicesPage />
  },
  {
    path: "/community",
    element: <CommunityPage />
  },
  {
    path: "/create-ad",
    element: <AdCreationPage />
  },
  {
    path: "/checkout",
    element: <CheckoutPage />
  },
  {
    path: "/performance",
    element: <PerformancePage />
  },
  {
    path: "/appointments",
    element: <AppointmentsPage />
  },
  {
    path: "/rankings",
    element: <RankingsPage />
  }
];
