
import { RouteObject } from "react-router-dom";
import Marketplace from "@/pages/Marketplace";
import { ErrorView } from "@/components/ErrorView";

export const marketplaceRoutes: RouteObject[] = [
  {
    path: "/marketplace",
    element: <Marketplace />,
    errorElement: <ErrorView />,
  }
];
