
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { shopRoutes } from "@/routes/shopRoutes";
import { marketplaceRoutes } from "@/routes/marketplaceRoutes";
import ErrorPage from "@/pages/NotFound"; // Use NotFound as fallback
import Index from "@/pages/Index";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
    errorElement: <ErrorPage />,
  },
  ...marketplaceRoutes,
  ...shopRoutes,
  {
    path: "*",
    element: <ErrorPage />
  }
];

export const router = createBrowserRouter(routes);
