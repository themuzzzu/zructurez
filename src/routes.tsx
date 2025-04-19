
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { dashboardRoutes } from "@/routes/dashboardRoutes";
import { marketplaceRoutes } from "@/routes/marketplaceRoutes";
import { shopRoutes } from "@/routes/shopRoutes";
import { landingRoutes } from "@/routes/landingRoutes";
import ErrorPage from "@/pages/Error";
import Index from "@/pages/Index";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
    errorElement: <ErrorPage />,
  },
  ...dashboardRoutes,
  ...marketplaceRoutes,
  ...shopRoutes,
  ...landingRoutes,
  {
    path: "*",
    element: <ErrorPage />
  }
];

export const router = createBrowserRouter(routes);
