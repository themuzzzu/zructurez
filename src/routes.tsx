
import { createBrowserRouter } from "react-router-dom";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/index",
    element: <Index />,
  },
  {
    path: "/marketplace",
    element: <Marketplace />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/services/:serviceId",
    element: <ServiceDetails />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/profile/:userId",
    element: <Profile />,
  },
  {
    path: "/product/:id",
    element: <ProductDetails />,
  },
  {
    path: "/business",
    element: <Business />,
  },
  {
    path: "/business/:id",
    element: <BusinessDetails />,
  },
  {
    path: "/wishlist",
    element: <Wishlist />,
  },
  {
    path: "/unifiedhome",
    element: <UnifiedHome />,
  },
  {
    path: "/maps",
    element: <MapView />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
