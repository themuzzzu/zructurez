
import { ProfileView } from "@/components/ProfileView";
import { SettingsNav } from "@/components/SettingsNav";
import { useState, useEffect } from "react";
import { GeneralSettings } from "@/components/GeneralSettings";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";
import { PrivacySettings } from "@/components/PrivacySettings";
import { ProductsTab } from "@/components/settings/ProductsTab";
import { BusinessSettings } from "@/components/settings/BusinessSettings";
import { ServiceSettings } from "@/components/settings/ServiceSettings";
import { AdvertisementsTab } from "@/components/settings/AdvertisementsTab";
import { OrdersTab } from "@/components/settings/OrdersTab";
import { SubscribedBusinessesTab } from "@/components/profile/SubscribedBusinessesTab";
import { AppointmentsTab } from "@/components/settings/AppointmentsTab";
import { TestingTab } from "@/components/settings/TestingTab";
import { AnalyticsTab } from "@/components/settings/AnalyticsTab";
import { PricingTab } from "@/components/settings/PricingTab";
import { AdvertisementPricingTab } from "@/components/settings/AdvertisementPricingTab";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home, ChevronLeft } from "lucide-react";
import { useNavigate, useSearchParams, useNavigationType } from "react-router-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock } from "lucide-react";

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user } = useAuth();
  
  // Check if user has admin privileges (simplified for now)
  const isAdmin = user?.app_metadata?.role === "admin";
  
  // Set active tab without causing full page reload
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab }, { replace: true });
  };
  
  // Update URL when tab changes
  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: activeTab }, { replace: true });
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "privacy":
        return isAdmin ? (
          <PrivacySettings />
        ) : (
          <LockedSettingsView title="Privacy Settings" message="Privacy settings are currently locked by administrators." />
        );
      case "orders":
        return <OrdersTab />;
      case "appointments":
        return <AppointmentsTab />;
      case "products":
        return <ProductsTab />;
      case "business":
        return <BusinessSettings />;
      case "services":
        return <ServiceSettings />;
      case "advertisements":
        return <AdvertisementsTab />;
      case "ad-pricing":
        return <AdvertisementPricingTab />;
      case "subscribed":
        return isAdmin ? (
          <SubscribedBusinessesTab />
        ) : (
          <LockedSettingsView title="Subscription Settings" message="Subscription management is currently locked by administrators." />
        );
      case "pricing":
        return <PricingTab />;
      case "testing":
        return <TestingTab />;
      case "analytics":
        return <AnalyticsTab />;
      default:
        return <ProfileView />;
    }
  };

  return (
    <Layout hideSidebar>
      <div className="container max-w-[1400px] py-4 px-2 md:px-4">
        {!isMobile && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4 flex items-center gap-2 text-sm hover:bg-muted"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
        )}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-64 w-full sticky top-0">
            <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="transition-all duration-300">{renderContent()}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Component to show when settings are locked
const LockedSettingsView = ({ title, message }: { title: string, message: string }) => (
  <div className="py-8 px-4 text-center">
    <Alert variant="default" className="border-amber-500/50 bg-amber-500/10">
      <Lock className="h-6 w-6 text-amber-500" />
      <AlertTitle className="text-lg font-semibold">{title} Locked</AlertTitle>
      <AlertDescription className="text-muted-foreground">{message}</AlertDescription>
    </Alert>
    <div className="mt-8">
      <p className="text-muted-foreground">Please contact your administrator to request access to these settings.</p>
    </div>
  </div>
);

export default Settings;
