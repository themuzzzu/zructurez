import { createBrowserRouter, RouterProvider, RouteObject } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Marketplace from "./pages/Marketplace";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth"; 
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import Business from "./pages/Business";
import BusinessDetails from "./pages/BusinessDetails";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Wishlist from "./pages/Wishlist";
import UnifiedHome from "./pages/UnifiedHome";
import MapView from "./pages/MapView";
import ComingSoonPage from "./pages/ComingSoonPage";
import More from "./pages/More";
import { RedirectHandler } from "@/components/RedirectHandler";
import { Outlet } from "react-router-dom";
import { ErrorView } from "@/components/ErrorView";
import { Suspense, lazy } from "react";
import { CircularLoader } from "@/components/loaders/CircularLoader";

// Lazy load heavy components to improve initial load time
const LazyMapView = lazy(() => import("./pages/MapView"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <CircularLoader size={48} color="#3B82F6" />
  </div>
);

const Layout = () => {
  return (
    <>
      <RedirectHandler />
      <Outlet />
    </>
  );
};

// Export the routes configuration without creating a router instance
export const routes: RouteObject[] = [
  {
    element: <Layout />,
    errorElement: <ErrorView />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <ErrorView />,
      },
      {
        path: "/index",
        element: <Index />,
        errorElement: <ErrorView />,
      },
      {
        path: "/marketplace",
        element: <Marketplace />,
        errorElement: <ErrorView />,
      },
      {
        path: "/services",
        element: <Services />,
        errorElement: <ErrorView />,
      },
      {
        path: "/services/:serviceId",
        element: <ServiceDetails />,
        errorElement: <ErrorView />,
      },
      {
        path: "/settings",
        element: <Settings />,
        errorElement: <ErrorView />,
      },
      {
        path: "/auth",
        element: <Auth />,
        errorElement: <ErrorView />,
      },
      {
        path: "/profile",
        element: <Profile />,
        errorElement: <ErrorView />,
      },
      {
        path: "/profile/:userId",
        element: <Profile />,
        errorElement: <ErrorView />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
        errorElement: <ErrorView />,
      },
      {
        path: "/products/:id",
        element: <ProductDetails />,
        errorElement: <ErrorView />,
      },
      {
        path: "/business",
        element: <Business />,
        errorElement: <ErrorView />,
      },
      {
        path: "/businesses",
        element: <Business />,
        errorElement: <ErrorView />,
      },
      {
        path: "/business/:id",
        element: <BusinessDetails />,
        errorElement: <ErrorView />,
      },
      {
        path: "/businesses/:id",
        element: <BusinessDetails />,
        errorElement: <ErrorView />,
      },
      {
        path: "/wishlist",
        element: <Wishlist />,
        errorElement: <ErrorView />,
      },
      {
        path: "/unifiedhome",
        element: <UnifiedHome />,
        errorElement: <ErrorView />,
      },
      {
        path: "/maps",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LazyMapView />
          </Suspense>
        ),
        errorElement: <ErrorView />,
      },
      {
        path: "/more",
        element: <More />,
        errorElement: <ErrorView />,
      },
      {
        path: "/jobs",
        element: <ComingSoonPage title="Jobs" message="The Jobs section is coming soon!" />,
        errorElement: <ErrorView />,
      },
      {
        path: "/events",
        element: <ComingSoonPage title="Events" message="The Events section is coming soon!" />,
        errorElement: <ErrorView />,
      },
      {
        path: "/messaging",
        element: <ComingSoonPage title="Messaging" message="The Messaging section is coming soon!" />,
        errorElement: <ErrorView />,
      },
      {
        path: "*",
        element: <NotFound />,
        errorElement: <ErrorView />,
      },
    ]
  }
];

// Create the router using the routes
export const router = createBrowserRouter(routes);

// Export the Routes component
export function Routes() {
  return <RouterProvider router={router} />;
}

export default router;
