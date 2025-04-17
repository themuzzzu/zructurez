
import { Navigate, useRoutes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { PageLoader } from "@/components/loaders/PageLoader";
import { RequireAuth } from "@/components/auth/RequireAuth";

// Use lazy loading for all pages
const LandingPage = lazy(() => import("@/pages/LandingPage").then(module => ({ default: module.default || module.LandingPage })));
const UnifiedHome = lazy(() => import("@/pages/UnifiedHome").then(module => ({ default: module.default || module.UnifiedHome })));
const SearchPage = lazy(() => import("@/pages/SearchPage").then(module => ({ default: module.default || module.SearchPage })));
const MarketplacePage = lazy(() => import("@/pages/MarketplacePage").then(module => ({ default: module.default || module.MarketplacePage })));
const ServicesPage = lazy(() => import("@/pages/ServicesPage").then(module => ({ default: module.default || module.ServicesPage })));
const ServiceDetailPage = lazy(() => import("@/pages/ServiceDetailPage").then(module => ({ default: module.default || module.ServiceDetailPage })));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetailPage").then(module => ({ default: module.default || module.ProductDetailPage })));
const BusinessDetailPage = lazy(() => import("@/pages/BusinessDetailPage").then(module => ({ default: module.default || module.BusinessDetailPage })));
const BusinessDashboard = lazy(() => import("@/pages/BusinessDashboard").then(module => ({ default: module.default || module.BusinessDashboard })));
const SignInPage = lazy(() => import("@/pages/SignInPage").then(module => ({ default: module.default || module.SignInPage })));
const SignUpPage = lazy(() => import("@/pages/SignUpPage").then(module => ({ default: module.default || module.SignUpPage })));
const ProfilePage = lazy(() => import("@/pages/ProfilePage").then(module => ({ default: module.default || module.ProfilePage })));
const Analytics = lazy(() => import("@/pages/Analytics").then(module => ({ default: module.default || module.Analytics })));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then(module => ({ default: module.default || module.NotFoundPage })));

// Lazy load layouts
const MainLayout = lazy(() => import("@/layouts/MainLayout").then(module => ({ default: module.default || module.MainLayout })));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout").then(module => ({ default: module.default || module.AuthLayout })));
const AdminLayout = lazy(() => import("@/layouts/AdminLayout").then(module => ({ default: module.default || module.AdminLayout })));

// Create a loading component
const LazyLoadingFallback = () => <PageLoader />;

export const Routes = () => {
  return useRoutes([
    {
      element: (
        <Suspense fallback={<LazyLoadingFallback />}>
          <MainLayout />
        </Suspense>
      ),
      children: [
        { 
          path: "/", 
          element: (
            <Suspense fallback={<LazyLoadingFallback />}>
              <LandingPage />
            </Suspense>
          ) 
        },
        { 
          path: "/unified-home", 
          element: (
            <Suspense fallback={<LazyLoadingFallback />}>
              <UnifiedHome />
            </Suspense>
          ) 
        },
        { 
          path: "/search", 
          element: (
            <Suspense fallback={<LazyLoadingFallback />}>
              <SearchPage />
            </Suspense>
          ) 
        },
        { 
          path: "/marketplace", 
          element: (
            <Suspense fallback={<LazyLoadingFallback />}>
              <MarketplacePage />
            </Suspense>
          ) 
        },
        { 
          path: "/businesses", 
          element: (
            <Suspense fallback={<LazyLoadingFallback />}>
              <ServicesPage />
            </Suspense>
          ) 
        },
        { 
          path: "/services", 
          element: (
            <Suspense fallback={<LazyLoadingFallback />}>
              <ServicesPage />
            </Suspense>
          ) 
        },
        { 
          path: "/services/:id", 
          element: (
            <Suspense fallback={<LazyLoadingFallback />}>
              <ServiceDetailPage />
            </Suspense>
          ) 
        },
        { 
          path: "/products/:id", 
          element: (
            <Suspense fallback={<LazyLoadingFallback />}>
              <ProductDetailPage />
            </Suspense>
          ) 
        },
        { 
          path: "/business/:id", 
          element: (
            <Suspense fallback={<LazyLoadingFallback />}>
              <BusinessDetailPage />
            </Suspense>
          ) 
        },
        {
          path: "/analytics",
          element: (
            <RequireAuth>
              <Suspense fallback={<LazyLoadingFallback />}>
                <Analytics />
              </Suspense>
            </RequireAuth>
          ),
        },
        {
          path: "/business-dashboard",
          element: (
            <RequireAuth>
              <Suspense fallback={<LazyLoadingFallback />}>
                <BusinessDashboard />
              </Suspense>
            </RequireAuth>
          ),
        },
        {
          path: "/profile",
          element: (
            <RequireAuth>
              <Suspense fallback={<LazyLoadingFallback />}>
                <ProfilePage />
              </Suspense>
            </RequireAuth>
          ),
        },
        {
          path: "/profile/:id",
          element: (
            <Suspense fallback={<LazyLoadingFallback />}>
              <ProfilePage />
            </Suspense>
          ),
        },
      ],
    },
    {
      element: (
        <Suspense fallback={<LazyLoadingFallback />}>
          <AuthLayout />
        </Suspense>
      ),
      children: [
        { 
          path: "/signin", 
          element: (
            <Suspense fallback={<LazyLoadingFallback />}>
              <SignInPage />
            </Suspense>
          ) 
        },
        { 
          path: "/signup", 
          element: (
            <Suspense fallback={<LazyLoadingFallback />}>
              <SignUpPage />
            </Suspense>
          ) 
        },
      ],
    },
    { 
      path: "*", 
      element: (
        <Suspense fallback={<LazyLoadingFallback />}>
          <NotFoundPage />
        </Suspense>
      ) 
    },
  ]);
};
