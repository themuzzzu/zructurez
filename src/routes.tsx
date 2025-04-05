
import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "./pages/NotFound";
import MarketplaceSearch from "./pages/marketplace/search";
import SearchResultsPage from "./pages/search/SearchResultsPage";

// This file includes route definitions for the application
const router = createBrowserRouter([
  // Other routes would be defined here
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
