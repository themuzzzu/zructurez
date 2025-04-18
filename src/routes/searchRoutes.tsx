
import { RouteObject } from "react-router-dom";
import MarketplaceSearch from "@/pages/marketplace/search";
import { ErrorView } from "@/components/ErrorView";

export const searchRoutes: RouteObject[] = [
  {
    path: "/search",
    element: <MarketplaceSearch />,
    errorElement: <ErrorView />,
  }
];
