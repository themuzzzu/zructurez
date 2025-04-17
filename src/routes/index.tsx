
import { Navigate, useRoutes } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { SignInPage } from "@/pages/SignInPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { SearchPage } from "@/pages/SearchPage";
import { MarketplacePage } from "@/pages/MarketplacePage"; 
import { BusinessDashboard } from "@/pages/BusinessDashboard";
import { ServicesPage } from "@/pages/ServicesPage";
import { ServiceDetailPage } from "@/pages/ServiceDetailPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { CartPage } from "@/pages/CartPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ListProductPage } from "@/pages/ListProductPage";
import { AccountSettingsPage } from "@/pages/AccountSettingsPage";
import { BusinessDetailPage } from "@/pages/BusinessDetailPage";
import { CreateServicePage } from "@/pages/CreateServicePage";
import { OrderConfirmationPage } from "@/pages/OrderConfirmationPage";
import { UnavailableCityPage } from "@/pages/UnavailableCityPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ChatPage } from "@/pages/ChatPage";
import { GroupsPage } from "@/pages/GroupsPage";
import { GroupDetailPage } from "@/pages/GroupDetailPage";
import { FAQPage } from "@/pages/FAQPage";
import { ContactPage } from "@/pages/ContactPage";
import { AboutPage } from "@/pages/AboutPage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "@/pages/TermsOfServicePage";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { UserManagement } from "@/pages/admin/UserManagement";
import { ContentModeration } from "@/pages/admin/ContentModeration";
import { SystemSettings } from "@/pages/admin/SystemSettings";
import { CreateBusinessPage } from "@/pages/CreateBusinessPage";
import { UserPreferencesPage } from "@/pages/UserPreferencesPage";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Suspense } from "react";
import { PageLoader } from "@/components/loaders/PageLoader";
import { PaymentPage } from "@/pages/PaymentPage";
import { ImageSearchPage } from "@/pages/ImageSearchPage";
import { AdDashboard } from "@/pages/admin/AdDashboard";
import { ServiceBookingPage } from "@/pages/ServiceBookingPage";
import { UnifiedHome } from "@/pages/UnifiedHome";
import Analytics from "@/pages/Analytics";

export const Routes = () => {
  return useRoutes([
    {
      element: <MainLayout />,
      children: [
        { path: "/", element: <LandingPage /> },
        { path: "/unified-home", element: <UnifiedHome /> },
        { path: "/search", element: <SearchPage /> },
        { path: "/marketplace", element: <MarketplacePage /> },
        { path: "/businesses", element: <ServicesPage /> },
        { path: "/services", element: <ServicesPage /> },
        { path: "/services/:id", element: <ServiceDetailPage /> },
        { path: "/products/:id", element: <ProductDetailPage /> },
        { path: "/business/:id", element: <BusinessDetailPage /> },
        { path: "/unavailable", element: <UnavailableCityPage /> },
        { path: "/chat", element: <ChatPage /> },
        { path: "/groups", element: <GroupsPage /> },
        { path: "/groups/:id", element: <GroupDetailPage /> },
        { path: "/faq", element: <FAQPage /> },
        { path: "/contact", element: <ContactPage /> },
        { path: "/about", element: <AboutPage /> },
        { path: "/privacy-policy", element: <PrivacyPolicyPage /> },
        { path: "/terms-of-service", element: <TermsOfServicePage /> },
        { path: "/image-search", element: <ImageSearchPage /> },
        { path: "/service-booking/:id", element: <ServiceBookingPage /> },
        {
          path: "/create-service",
          element: (
            <RequireAuth>
              <CreateServicePage />
            </RequireAuth>
          ),
        },
        {
          path: "/create-business",
          element: (
            <RequireAuth>
              <CreateBusinessPage />
            </RequireAuth>
          ),
        },
        {
          path: "/list-product",
          element: (
            <RequireAuth>
              <ListProductPage />
            </RequireAuth>
          ),
        },
        {
          path: "/cart",
          element: (
            <RequireAuth>
              <CartPage />
            </RequireAuth>
          ),
        },
        {
          path: "/order-confirmation",
          element: (
            <RequireAuth>
              <OrderConfirmationPage />
            </RequireAuth>
          ),
        },
        {
          path: "/payment",
          element: (
            <RequireAuth>
              <PaymentPage />
            </RequireAuth>
          ),
        },
        {
          path: "/profile",
          element: (
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          ),
        },
        {
          path: "/profile/:id",
          element: <ProfilePage />,
        },
        {
          path: "/settings",
          element: (
            <RequireAuth>
              <AccountSettingsPage />
            </RequireAuth>
          ),
        },
        {
          path: "/preferences",
          element: (
            <RequireAuth>
              <UserPreferencesPage />
            </RequireAuth>
          ),
        },
        {
          path: "/business-dashboard",
          element: (
            <RequireAuth>
              <BusinessDashboard />
            </RequireAuth>
          ),
        },
        {
          path: "/analytics",
          element: (
            <RequireAuth>
              <Analytics />
            </RequireAuth>
          ),
        },
      ],
    },
    {
      element: <AuthLayout />,
      children: [
        { path: "/signin", element: <SignInPage /> },
        { path: "/signup", element: <SignUpPage /> },
        { path: "/reset-password", element: <ResetPasswordPage /> },
      ],
    },
    {
      element: (
        <RequireAuth>
          <AdminLayout />
        </RequireAuth>
      ),
      children: [
        { path: "/admin", element: <AdminDashboard /> },
        { path: "/admin/users", element: <UserManagement /> },
        { path: "/admin/content", element: <ContentModeration /> },
        { path: "/admin/settings", element: <SystemSettings /> },
        { path: "/admin/ads", element: <AdDashboard /> },
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ]);
};
