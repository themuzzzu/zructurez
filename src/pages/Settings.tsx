
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
import { LikedBusinessesTab } from "@/components/profile/LikedBusinessesTab";
import { AppointmentsTab } from "@/components/settings/AppointmentsTab";
import { AnalyticsTab } from "@/components/settings/AnalyticsTab";
import { Layout } from "@/components/layout/Layout";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

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
      case "liked":
        return <LikedBusinessesTab />;
      case "analytics":
        return <AnalyticsTab />;
      default:
        return <ProfileView />;
    }
  };

  return (
    <Layout hideSidebar>
      <div className="container max-w-[1400px] py-6 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
