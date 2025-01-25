import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
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
      case "products":
        return <ProductsTab />;
      case "business":
        return <BusinessSettings />;
      case "services":
        return <ServiceSettings />;
      case "advertisements":
        return <AdvertisementsTab />;
      default:
        return <ProfileView />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16 px-4">
        <div className="flex gap-6">
          <Sidebar className="w-64 hidden lg:block sticky top-24 h-[calc(100vh-6rem)]" />
          <main className="flex-1">
            <div className="flex flex-col md:flex-row gap-6">
              <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="flex-1">{renderContent()}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;