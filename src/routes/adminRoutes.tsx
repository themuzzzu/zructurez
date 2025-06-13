
import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const AdminPage = lazy(() => import("@/pages/admin/index"));
const EnhancedAdminDashboard = lazy(() => import("@/pages/admin/EnhancedAdminDashboard"));

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "/admin/dashboard",
    element: <EnhancedAdminDashboard />,
  }
];
