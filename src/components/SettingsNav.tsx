
import { Button } from "@/components/ui/button";
import { 
  Settings, Bell, Shield, User, Package, 
  Briefcase, Wrench, Megaphone, ShoppingBag, 
  Calendar, BarChart, Activity, Heart, BadgeDollarSign,
  DollarSign, TagIcon, Lock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

interface SettingsNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SettingsNav = ({ activeTab, setActiveTab }: SettingsNavProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user has admin privileges (simplified for now)
  const isAdmin = user?.app_metadata?.role === "admin";
  
  // Base tabs available to all users
  const baseTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "general", label: "General", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];
  
  // Restricted tabs that need admin permission
  const restrictedTabs = [
    { id: "privacy", label: "Privacy", icon: Shield, locked: !isAdmin },
    { id: "subscribed", label: "Subscriptions", icon: Heart, locked: !isAdmin },
  ];
  
  // Business and product related tabs
  const businessTabs = [
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "business", label: "Business", icon: Briefcase },
    { id: "services", label: "Services", icon: Wrench },
    { id: "products", label: "Products", icon: Package },
    { id: "advertisements", label: "Advertisements", icon: Megaphone },
    { id: "ad-pricing", label: "Ad Pricing & Booking", icon: TagIcon },
    { id: "pricing", label: "Pricing & Plans", icon: BadgeDollarSign },
    { id: "testing", label: "Testing", icon: Activity },
    { id: "analytics", label: "Analytics", icon: BarChart },
  ];
  
  // Combine all tabs
  const allTabs = [...baseTabs, ...restrictedTabs, ...businessTabs];

  // Handle tab click
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <nav className="w-full md:w-64 space-y-1 bg-background rounded-lg p-1">
      {allTabs.map(({ id, label, icon: Icon, locked }) => {
        const isActive = activeTab === id;
        
        return (
          <Button
            key={id}
            variant={isActive ? "default" : "ghost"}
            className={cn(
              "w-full justify-start relative",
              isActive ? "bg-primary text-primary-foreground" : "",
              locked ? "opacity-80" : ""
            )}
            onClick={() => handleTabClick(id)}
          >
            <Icon className="mr-2 h-4 w-4" />
            {label}
            {locked && (
              <Lock className="h-3 w-3 absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            )}
          </Button>
        );
      })}
    </nav>
  );
};
