
import { createBrowserRouter } from "react-router-dom";
import GenericPage from "./pages/GenericPage"; 
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import BusinessDetails from "./pages/BusinessDetails";
import ServiceDetails from "./pages/ServiceDetails";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Wishlist from "./pages/Wishlist";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import { RoleProtectedRoute } from "./components/auth/RoleProtectedRoute";
import Maps from "./pages/Maps";
import Communities from "./pages/Communities";
import Events from "./pages/Events";
import Jobs from "./pages/Jobs";
import Pricing from "./pages/Pricing";
import Business from "./pages/Business";
import BusinessDashboard from "./pages/BusinessDashboard";

// Messages routes
import Messages from "./pages/messages";

// Checkout routes
import Checkout from "./pages/checkout";
import OrderSuccess from "./pages/order-success";
import Orders from "./pages/orders";

// Admin routes
import AdminDashboard from "./pages/admin";
import AdDashboard from "./pages/admin/AdDashboard";
import AdAnalytics from "./pages/admin/AdAnalytics";
import AdPlacement from "./pages/admin/AdPlacement";
import AdAuction from "./pages/admin/AdAuction";
import AdminApiDemo from "./pages/admin/AdminApiDemo";

// Dashboard routes
import Dashboard from "./pages/dashboard";

// Search routes
import Search from "./pages/search";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/marketplace",
    element: <Marketplace />,
  },
  {
    path: "/business/:id",
    element: <BusinessDetails />,
  },
  {
    path: "/service/:id",
    element: <ServiceDetails />,
  },
  {
    path: "/product/:id",
    element: <ProductDetails />,
  },
  {
    path: "/profile/:id?",
    element: <Profile />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/settings",
    element: (
      <RoleProtectedRoute requiredRole="customer">
        <Settings />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/wishlist",
    element: <Wishlist />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/maps",
    element: <Maps />,
  },
  {
    path: "/communities",
    element: <Communities />,
  },
  {
    path: "/events",
    element: <Events />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/business",
    element: <Business />,
  },
  {
    path: "/business-dashboard/:id?",
    element: (
      <RoleProtectedRoute requiredRole="business_owner">
        <BusinessDashboard />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/messages",
    element: <Messages />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/order-success",
    element: <OrderSuccess />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/admin",
    element: (
      <RoleProtectedRoute requiredRole="admin">
        <AdminDashboard />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/admin/ads",
    element: (
      <RoleProtectedRoute requiredRole="admin">
        <AdDashboard />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/admin/ad-analytics",
    element: (
      <RoleProtectedRoute requiredRole="admin">
        <AdAnalytics />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/admin/ad-placement",
    element: (
      <RoleProtectedRoute requiredRole="admin">
        <AdPlacement />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/admin/ad-auction",
    element: (
      <RoleProtectedRoute requiredRole="admin">
        <AdAuction />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/admin/api-demo",
    element: (
      <RoleProtectedRoute requiredRole="admin">
        <AdminApiDemo />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <RoleProtectedRoute requiredRole="business_owner">
        <Dashboard />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
