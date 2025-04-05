
import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "./pages/NotFound";
import MarketplaceSearch from "./pages/marketplace/search";

// This file includes route definitions for the application
const router = createBrowserRouter([
  // Other routes would be defined here
  {
    path: "/marketplace/search",
    element: <MarketplaceSearch />
  },
  {
    path: "/search",
    element: <MarketplaceSearch />
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);

export default router;
