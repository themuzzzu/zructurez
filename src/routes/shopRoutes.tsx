
import { RouteObject } from "react-router-dom";
import Shop from "@/pages/Shop";
import { ErrorView } from "@/components/ErrorView";

export const shopRoutes: RouteObject[] = [
  {
    path: "/shop",
    element: <Shop />,
    errorElement: <ErrorView />,
  },
];
