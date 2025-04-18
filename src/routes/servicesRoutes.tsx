
import { RouteObject } from "react-router-dom";
import Services from "@/pages/Services";
import ServiceDetails from "@/pages/ServiceDetails";
import { ErrorView } from "@/components/ErrorView";

export const servicesRoutes: RouteObject[] = [
  {
    path: "/services",
    element: <Services />,
    errorElement: <ErrorView />,
  },
  {
    path: "/services/:serviceId",
    element: <ServiceDetails />,
    errorElement: <ErrorView />,
  }
];
