
import { ProfileView } from "@/components/ProfileView";
import { SettingsNav } from "@/components/SettingsNav";
import { useState } from "react";
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
import { AnalyticsTab } from "@/components/settings/AnalyticsTab";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "privacy":
        return <PrivacySettings />;
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
      case "subscribed":
        return <SubscribedBusinessesTab />;
      case "analytics":
        return <AnalyticsTab />;
      default:
        return <ProfileView />;
    }
  };

  return (
    <Layout hideSidebar>
      <div className="container max-w-[1400px] py-6 px-4">
        {!isMobile && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4 flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        )}
        <div className="flex flex-col md:flex-row gap-6">
          <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
