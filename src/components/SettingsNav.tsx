import { Button } from "@/components/ui/button";
import { Settings, Bell, Shield, User, Package, Briefcase, Wrench, Megaphone, ShoppingBag, Heart } from "lucide-react";

interface SettingsNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SettingsNav = ({ activeTab, setActiveTab }: SettingsNavProps) => {
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "general", label: "General", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "liked", label: "Liked Businesses", icon: Heart },
    { id: "business", label: "Business", icon: Briefcase },
    { id: "services", label: "Services", icon: Wrench },
    { id: "products", label: "Products", icon: Package },
    { id: "advertisements", label: "Advertisements", icon: Megaphone },
  ];

  return (
    <nav className="w-full md:w-64 space-y-2">
      {tabs.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={activeTab === id ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab(id)}
        >
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      ))}
    </nav>
  );
};