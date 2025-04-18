
import { RouteObject } from "react-router-dom";
import UnifiedSearchPage from "@/pages/search/UnifiedSearchPage";
import SearchResultsPage from "@/pages/search/SearchResultsPage";
import { ErrorView } from "@/components/ErrorView";

export const searchRoutes: RouteObject[] = [
  {
    path: "/search",
    element: <UnifiedSearchPage />,
    errorElement: <ErrorView />,
  },
  {
    path: "/search/marketplace",
    element: <SearchResultsPage type="marketplace" />,
    errorElement: <ErrorView />,
  },
  {
    path: "/search/business",
    element: <SearchResultsPage type="business" />,
    errorElement: <ErrorView />,
  },
  {
    path: "/search/services",
    element: <SearchResultsPage type="services" />,
    errorElement: <ErrorView />,
  }
];
