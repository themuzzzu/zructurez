
import { RouteObject } from "react-router-dom";
import Profile from "@/pages/Profile";
import Auth from "@/pages/Auth";

export const userRoutes: RouteObject[] = [
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/profile/:id",
    element: <Profile />,
  },
  {
    path: "/login", 
    element: <Auth />,
  },
  {
    path: "/signup",
    element: <Auth isSignup={true} />,
  }
];
