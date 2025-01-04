import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Store,
  Wrench,
  Users,
  MessageSquare,
  Calendar,
  Settings,
  Briefcase,
  Map,
  MessagesSquare,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar = ({ className }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const routes = [
    { name: "Home", path: "/", icon: Home },
    { name: "Marketplace", path: "/marketplace", icon: Store },
    { name: "Services", path: "/services", icon: Wrench },
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { 
      type: "separator",
      label: "Social"
    },
    { name: "Communities", path: "/communities", icon: Users },
    { name: "Messages", path: "/messages", icon: MessageSquare, subItems: [
      { name: "Chats", path: "/messages", icon: MessageSquare },
      { name: "Groups", path: "/groups", icon: MessagesSquare },
    ]},
    { 
      type: "separator",
      label: "Other"
    },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "Maps", path: "/maps", icon: Map },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className={cn("h-screen border-r bg-card overflow-y-auto", className)}>
      <div className="space-y-1 p-3">
        {routes.map((route, index) => {
          if (route.type === "separator") {
            return (
              <div 
                key={index}
                className="px-3 py-2 text-xs font-semibold text-muted-foreground"
              >
                {route.label}
              </div>
            );
          }

          const Icon = route.icon;
          const isActive = location.pathname === route.path;
          const hasSubItems = route.subItems && route.subItems.length > 0;
          const isSubItemActive = hasSubItems && route.subItems?.some(item => location.pathname === item.path);

          return (
            <div key={route.path}>
              <Button
                variant={isActive || isSubItemActive ? "secondary" : "ghost"}
                className="w-full justify-start h-12 px-3 gap-4 hover:bg-accent/50"
                onClick={() => navigate(route.path)}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{route.name}</span>
              </Button>
              {hasSubItems && (
                <div className="ml-6 space-y-1 mt-1">
                  {route.subItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = location.pathname === subItem.path;
                    return (
                      <Button
                        key={subItem.path}
                        variant={isSubActive ? "secondary" : "ghost"}
                        className="w-full justify-start h-10 px-3 gap-4 hover:bg-accent/50"
                        onClick={() => navigate(subItem.path)}
                      >
                        <SubIcon className="h-4 w-4 shrink-0" />
                        <span className="text-sm font-medium">{subItem.name}</span>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};