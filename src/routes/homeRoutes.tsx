
import { RouteObject } from "react-router-dom";
import Home from "@/pages/Home";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import UnifiedHome from "@/pages/UnifiedHome";
import { ErrorView } from "@/components/ErrorView";

export const homeRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorView />,
  },
  {
    path: "/index",
    element: <Index />,
    errorElement: <ErrorView />,
  },
  {
    path: "/unifiedhome",
    element: <UnifiedHome />,
    errorElement: <ErrorView />,
  },
  {
    path: "*",
    element: <NotFound />,
    errorElement: <ErrorView />,
  }
];
