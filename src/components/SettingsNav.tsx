import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Bell,
  Lock,
  ShoppingBag,
  CalendarDays,
  Package,
  Store,
  Wrench,
  MessageSquare,
  Megaphone,
  PiggyBank,
  ListChecks,
  Activity,
  BarChart,
  MapPin,
  User,
  Menu,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLanguage } from "@/contexts/LanguageContext";

interface SettingsNavProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export function SettingsNav({ activeTab, setActiveTab }: SettingsNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { t } = useLanguage();

  const settingsNavItems = [
    {
      id: "profile",
      label: t("profile"),
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "general",
      label: t("general"),
      icon: <Settings className="h-4 w-4" />,
    },
    {
      id: "notifications",
      label: t("notifications"),
      icon: <Bell className="h-4 w-4" />,
    },
    {
      id: "privacy",
      label: t("privacy"),
      icon: <Lock className="h-4 w-4" />,
    },
    {
      id: "orders",
      label: t("orders"),
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      id: "appointments",
      label: t("appointments"),
      icon: <CalendarDays className="h-4 w-4" />,
    },
    {
      id: "products",
      label: t("products"),
      icon: <Package className="h-4 w-4" />,
    },
    {
      id: "business",
      label: t("business"),
      icon: <Store className="h-4 w-4" />,
    },
    {
      id: "services",
      label: t("services"),
      icon: <Wrench className="h-4 w-4" />,
    },
    {
      id: "advertisements",
      label: t("advertisements"),
      icon: <Megaphone className="h-4 w-4" />,
    },
    {
      id: "ad-pricing",
      label: t("adPricing"),
      icon: <PiggyBank className="h-4 w-4" />,
    },
    {
      id: "subscribed",
      label: t("subscribed"),
      icon: <ListChecks className="h-4 w-4" />,
    },
    {
      id: "pricing",
      label: t("pricing"),
      icon: <Activity className="h-4 w-4" />,
    },
    {
      id: "analytics",
      label: t("analytics"),
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      id: "location",
      label: t("location"),
      icon: <MapPin className="h-4 w-4" />,
    },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  if (isMobile) {
    return (
      <div className="w-full">
        <Button
          variant="outline"
          className="w-full flex justify-between items-center mb-4"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="flex items-center gap-2">
            {settingsNavItems.find((item) => item.id === activeTab)?.icon}
            {settingsNavItems.find((item) => item.id === activeTab)?.label}
          </span>
          <Menu className="h-4 w-4" />
        </Button>
        {isMenuOpen && (
          <div className="bg-background rounded-md shadow-lg border p-2 space-y-1 mb-4 animate-in fade-in duration-200">
            {settingsNavItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn("w-full justify-start", 
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : ""
                )}
                onClick={() => handleTabChange(item.id)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-[240px] shrink-0">
      <div className="space-y-1 py-2 sticky top-[80px]">
        {settingsNavItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className={cn("w-full justify-start", 
              activeTab === item.id
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : ""
            )}
            onClick={() => handleTabChange(item.id)}
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
