
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";

// Create the router using the routes
export const router = createBrowserRouter(routes);

// Export the Routes component
export function Routes() {
  return <RouterProvider router={router} />;
}

export default router;
