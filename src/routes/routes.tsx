
import { RouteObject } from "react-router-dom";
import { Layout } from "./Layout";
import { ErrorView } from "@/components/ErrorView";
import { homeRoutes } from "./homeRoutes";
import { marketplaceRoutes } from "./marketplaceRoutes";
import { searchRoutes } from "./searchRoutes";
import { businessRoutes } from "./businessRoutes";
import { servicesRoutes } from "./servicesRoutes";
import { userRoutes } from "./userRoutes";
import { miscRoutes } from "./miscRoutes";
import Shop from "@/pages/Shop";
import { NotFound } from "@/components/NotFound";

// Export the routes configuration without creating a router instance
export const routes: RouteObject[] = [
  {
    element: <Layout />,
    errorElement: <ErrorView />,
    children: [
      ...homeRoutes,
      ...marketplaceRoutes,
      ...searchRoutes,
      ...businessRoutes,
      ...servicesRoutes,
      ...userRoutes,
      ...miscRoutes,
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "*",
        element: <NotFound />,
      }
    ]
  }
];
