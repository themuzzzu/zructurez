
import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "./pages/NotFound";
import MarketplaceSearch from "./pages/marketplace/search";
import SearchResultsPage from "./pages/search/SearchResultsPage";
import Business from "./pages/Business";
import BusinessDetails from "./pages/BusinessDetails";

// This file includes route definitions for the application
const router = createBrowserRouter([
  {
    path: "/businesses",
    element: <Business />
  },
  {
    path: "/businesses/:id",
    element: <BusinessDetails />
  },
  {
    path: "/marketplace/search",
    element: <MarketplaceSearch />
  },
  {
    path: "/search",
    element: <SearchResultsPage />
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);

export default router;
