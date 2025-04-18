
import { RouteObject } from "react-router-dom";
import UnifiedSearchPage from "@/pages/search/UnifiedSearchPage";
import MarketplaceSearch from "@/pages/search/marketplace/MarketplaceSearch";
import ServicesSearch from "@/pages/search/services/ServicesSearch";
import BusinessSearch from "@/pages/search/business/BusinessSearch";
import { ErrorView } from "@/components/ErrorView";

export const searchRoutes: RouteObject[] = [
  {
    path: "/search",
    element: <UnifiedSearchPage />,
    errorElement: <ErrorView />,
  },
  {
    path: "/search/marketplace",
    element: <MarketplaceSearch />,
    errorElement: <ErrorView />,
  },
  {
    path: "/search/services",
    element: <ServicesSearch />,
    errorElement: <ErrorView />,
  },
  {
    path: "/search/business",
    element: <BusinessSearch />,
    errorElement: <ErrorView />,
  }
];
