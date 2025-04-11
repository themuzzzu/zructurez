
import { Button } from "@/components/ui/button";
import { 
  Settings, Bell, Shield, User, Package, 
  Briefcase, Wrench, Megaphone, ShoppingBag, 
  Calendar, BarChart, Activity, Heart, BadgeDollarSign,
  DollarSign, TagIcon, Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  locked?: boolean;
}

interface SettingsNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SettingsNav = ({ activeTab, setActiveTab }: SettingsNavProps) => {
  const navigate = useNavigate();
  
  const tabs: TabItem[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "general", label: "General", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield, locked: true },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "subscribed", label: "Subscriptions", icon: Heart, locked: true },
    { id: "business", label: "Business", icon: Briefcase },
    { id: "services", label: "Services", icon: Wrench },
    { id: "products", label: "Products", icon: Package },
    { id: "advertisements", label: "Advertisements", icon: Megaphone },
    { id: "ad-pricing", label: "Ad Pricing & Booking", icon: TagIcon },
    { id: "pricing", label: "Pricing & Plans", icon: BadgeDollarSign, locked: true },
    { id: "testing", label: "Testing", icon: Activity },
    { id: "analytics", label: "Analytics", icon: BarChart },
  ];

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL without full page reload - Fixed: Convert location to string
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url);
  };

  return (
    <nav className="w-full md:w-56 lg:w-64 space-y-1.5 px-2 md:px-0">
      {tabs.map(({ id, label, icon: Icon, locked }) => (
        <Button
          key={id}
          variant={activeTab === id ? "default" : "ghost"}
          className={`w-full justify-start ${activeTab === id ? "bg-primary" : ""} 
                     ${locked ? "opacity-70 cursor-not-allowed" : ""}`}
          onClick={() => !locked && handleTabChange(id)}
          title={locked ? "This feature requires admin approval" : ""}
        >
          <Icon className="mr-2 h-4 w-4" />
          {label}
          {locked && <Lock className="ml-auto h-3 w-3" />}
        </Button>
      ))}
    </nav>
  );
};
