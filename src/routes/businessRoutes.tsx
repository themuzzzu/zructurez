
import { RouteObject } from "react-router-dom";
import Business from "@/pages/Business";
import BusinessDetails from "@/pages/BusinessDetails";
import { ErrorView } from "@/components/ErrorView";

export const businessRoutes: RouteObject[] = [
  {
    path: "/business",
    element: <Business />,
    errorElement: <ErrorView />,
  },
  {
    path: "/businesses",
    element: <Business />,
    errorElement: <ErrorView />,
  },
  {
    path: "/business/:id",
    element: <BusinessDetails />,
    errorElement: <ErrorView />,
  },
  {
    path: "/businesses/:id",
    element: <BusinessDetails />,
    errorElement: <ErrorView />,
  }
];
