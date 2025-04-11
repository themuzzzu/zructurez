
import { ProfileView } from "@/components/ProfileView";
import { SettingsNav } from "@/components/SettingsNav";
import { useState, useEffect } from "react";
import { GeneralSettings } from "@/components/GeneralSettings";
import { NotificationSettings } from "@/components/NotificationSettings";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Card } from "@/components/ui/card";

const Settings = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Update URL when tab changes without page reload
  useEffect(() => {
    const url = new URL(window.location.toString());
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "privacy":
        return <LockedFeature title="Privacy Settings" />;
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
        return <LockedFeature title="Subscribed Businesses" />;
      case "pricing":
        return <LockedFeature title="Pricing & Plans" />;
      case "testing":
        return <TestingTab />;
      case "analytics":
        return <AnalyticsTab />;
      default:
        return <ProfileView />;
    }
  };

  const LockedFeature = ({ title }: { title: string }) => (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-muted p-3">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground max-w-md">
          This feature is currently locked. Please contact your administrator to request access.
        </p>
      </div>
    </Card>
  );

  return (
    <Layout hideSidebar>
      <div className="container max-w-[1400px] py-4 md:py-6 px-2 md:px-4">
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
          <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
