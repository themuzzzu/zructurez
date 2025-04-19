
import { RouteObject } from "react-router-dom";
import Marketplace from "@/pages/Marketplace";
import { ErrorView } from "@/components/ErrorView";
import MarketplaceHub from "@/pages/MarketplaceHub";
import MarketplaceSearch from "@/pages/search/marketplace/MarketplaceSearch";

export const marketplaceRoutes: RouteObject[] = [
  {
    path: "/marketplace",
    element: <MarketplaceHub />,
    errorElement: <ErrorView />,
  },
  {
    path: "/marketplace/old",
    element: <Marketplace />,
    errorElement: <ErrorView />,
  },
  {
    path: "/search/marketplace",
    element: <MarketplaceSearch />,
    errorElement: <ErrorView />,
  }
];
