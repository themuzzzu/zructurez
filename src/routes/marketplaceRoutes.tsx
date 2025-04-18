
import { RouteObject } from "react-router-dom";
import Marketplace from "@/pages/Marketplace";
import ProductDetails from "@/pages/ProductDetails";
import { ErrorView } from "@/components/ErrorView";

export const marketplaceRoutes: RouteObject[] = [
  {
    path: "/marketplace",
    element: <Marketplace />,
    errorElement: <ErrorView />,
  },
  {
    path: "/product/:id",
    element: <ProductDetails />,
    errorElement: <ErrorView />,
  },
  {
    path: "/products/:id",
    element: <ProductDetails />,
    errorElement: <ErrorView />,
  }
];
