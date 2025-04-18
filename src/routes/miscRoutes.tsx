
import { RouteObject } from "react-router-dom";
import { Suspense, lazy } from "react";
import More from "@/pages/More";
import ComingSoonPage from "@/pages/ComingSoonPage";
import { ErrorView } from "@/components/ErrorView";
import { CircularLoader } from "@/components/loaders/CircularLoader";

// Lazy load heavy components to improve initial load time
const LazyMapView = lazy(() => import("@/pages/MapView"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <CircularLoader size={48} color="#3B82F6" />
  </div>
);

export const miscRoutes: RouteObject[] = [
  {
    path: "/maps",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LazyMapView />
      </Suspense>
    ),
    errorElement: <ErrorView />,
  },
  {
    path: "/more",
    element: <More />,
    errorElement: <ErrorView />,
  },
  {
    path: "/jobs",
    element: <ComingSoonPage title="Jobs" message="The Jobs section is coming soon!" />,
    errorElement: <ErrorView />,
  },
  {
    path: "/events",
    element: <ComingSoonPage title="Events" message="The Events section is coming soon!" />,
    errorElement: <ErrorView />,
  },
  {
    path: "/messaging",
    element: <ComingSoonPage title="Messaging" message="The Messaging section is coming soon!" />,
    errorElement: <ErrorView />,
  }
];
