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
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Card } from "@/components/ui/card";
import { LocationSettings } from "@/components/settings/LocationSettings";
import { useLanguage } from "@/contexts/LanguageContext";

const Settings = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { t } = useLanguage();

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url);
  }, [activeTab]);

  useEffect(() => {
    const tabFromParams = searchParams.get('tab');
    if (tabFromParams && tabFromParams !== activeTab) {
      setActiveTab(tabFromParams);
    }
  }, [searchParams, location, activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "privacy":
        return <LockedFeature title={t("privacy")} />;
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
        return <LockedFeature title={t("subscribed")} />;
      case "pricing":
        return <LockedFeature title={t("pricing")} />;
      case "testing":
        return <TestingTab />;
      case "analytics":
        return <AnalyticsTab />;
      case "location":
        return <LocationSettings />;
      default:
        return <ProfileView />;
    }
  };

  const LockedFeature = ({ title }: { title: string }) => (
    <Card className="p-8 text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-muted p-3">
          <div className="h-6 w-6 text-muted-foreground">🔒</div>
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground max-w-md">
          {t("lockedFeature")}
        </p>
      </div>
    </Card>
  );

  return (
    <Layout hideNav={false}>
      <div className="container max-w-[1400px] py-4 md:py-6 px-2 md:px-4 settings-container">
        {!isMobile && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4 flex items-center gap-2 text-sm hover:bg-muted"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="h-4 w-4" />
            {t("backToHome")}
          </Button>
        )}
        <div className="flex flex-col md:flex-row gap-4 settings-page">
          <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1 settings-content">{renderContent()}</div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
