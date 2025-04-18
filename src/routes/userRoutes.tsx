
import { RouteObject } from "react-router-dom";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Auth from "@/pages/Auth";
import Wishlist from "@/pages/Wishlist";
import { ErrorView } from "@/components/ErrorView";

export const userRoutes: RouteObject[] = [
  {
    path: "/settings",
    element: <Settings />,
    errorElement: <ErrorView />,
  },
  {
    path: "/auth",
    element: <Auth />,
    errorElement: <ErrorView />,
  },
  {
    path: "/profile",
    element: <Profile />,
    errorElement: <ErrorView />,
  },
  {
    path: "/profile/:userId",
    element: <Profile />,
    errorElement: <ErrorView />,
  },
  {
    path: "/wishlist",
    element: <Wishlist />,
    errorElement: <ErrorView />,
  }
];
